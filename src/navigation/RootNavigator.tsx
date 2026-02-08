import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import { supabase } from '../api/supabase';
import { RootStackParamList } from './types';
import { Colors, Typography } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { DriverNavigator } from './DriverNavigator';
import { AddCarScreen } from '../screens/driver/AddCarScreen';
import { KYCOnboardingScreen } from '../screens/auth/KYCOnboardingScreen';

// Placeholder Navigators (To be implemented)
const AdminPlaceholder = () => (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={{ ...Typography.h3, color: Colors.textDim, marginTop: 16 }}>Admin Dashboard</Text>
    </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [role, setRole] = useState<'admin' | 'driver' | null>(null);
    const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
    const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

    useEffect(() => {
        // 1. Check current session
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            if (currentSession) fetchRole(currentSession.user.id);
            else setLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession) fetchRole(newSession.user.id);
            else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, onboarding_completed, kyc_status')
                .eq('id', userId)
                .single();

            if (data) {
                setRole(data.role as 'admin' | 'driver');
                setIsOnboarded(!!data.onboarding_completed);
                setKycStatus(data.kyc_status || 'pending');
            }
        } catch (err) {
            console.error('Role fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // ... rest of the file

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                {!session ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : role === 'admin' ? (
                    <Stack.Screen name="AdminApp" component={AdminPlaceholder} />
                ) : !isOnboarded ? (
                    <Stack.Screen name="KYCOnboarding" component={KYCOnboardingScreen} />
                ) : (
                    <>
                        <Stack.Screen name="DriverApp" component={DriverNavigator} />
                        <Stack.Screen name="AddCar" component={AddCarScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

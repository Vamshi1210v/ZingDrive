import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, ClipboardList, User, Car } from 'lucide-react-native';
import { BookingPoolScreen } from '../screens/driver/BookingPoolScreen';
import { DriverTabParamList } from './types';
import { Colors, Typography } from '../theme';
import { View, Text, Platform } from 'react-native';

const Tab = createBottomTabNavigator<DriverTabParamList>();

const Placeholder = (name: string) => () => (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...Typography.h3, color: Colors.textDim }}>{name} Screen</Text>
    </View>
);

export const DriverNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 85,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarLabelStyle: {
                    ...Typography.caption,
                    fontSize: 10,
                    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
                },
            }}
        >
            <Tab.Screen
                name="DriverHome"
                component={BookingPoolScreen}
                options={{
                    tabBarLabel: 'Active Pool',
                    tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="MyTrips"
                component={Placeholder('My Trips')}
                options={{
                    tabBarLabel: 'Trips',
                    tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="MyVehicles"
                component={Placeholder('Vehicles')}
                options={{
                    tabBarLabel: 'Vehicles',
                    tabBarIcon: ({ color }) => <Car color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="DriverProfile"
                component={Placeholder('Profile')}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, ClipboardList, User, Car } from 'lucide-react-native';
import { BookingPoolScreen } from '../screens/driver/BookingPoolScreen';
import { DriverTabParamList } from './types';
import { Colors, Typography } from '../theme';
import { View, Text, Platform } from 'react-native';

import { MyTripsScreen } from '../screens/driver/MyTripsScreen';
import { ProfileScreen } from '../screens/driver/ProfileScreen';
import { MyVehiclesScreen } from '../screens/driver/MyVehiclesScreen';

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
                component={MyTripsScreen}
                options={{
                    tabBarLabel: 'Trips',
                    tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="MyVehicles"
                component={MyVehiclesScreen}
                options={{
                    tabBarLabel: 'Vehicles',
                    tabBarIcon: ({ color }) => <Car color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="DriverProfile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};

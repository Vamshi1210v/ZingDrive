import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { ZingHeader } from '../../components/common';
import { BookingCard } from '../../components/booking/BookingCard';
import { Booking } from '../../types/booking';

const ACCEPTED_TRIPS: Booking[] = [
    {
        id: '1',
        tripType: 'ONE WAY TRIP',
        paymentMode: 'Paid by Cash',
        pickup: 'Devikapuram, Tamil Nadu, India',
        drop: 'Mundiyampakkam, Tamil Nadu, India',
        price: '1900.3',
        carType: 'HATCHBACK (AC)',
        carCapacity: '4+1 seater',
        distance: '73.0 KM',
        extraKmRate: '11.2/km',
        driverCharge: 'Included',
        departureTime: 'Feb 07, 2026 09:00 pm',
    },
];

export const MyTripsScreen = () => {
    const renderTripItem = ({ item, index }: { item: Booking, index: number }) => (
        <BookingCard
            item={item}
            index={index}
            buttonTitle="Confirmed RIDE"
            buttonVariant="secondary"
            onButtonPress={() => { }}
        />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader title="My Trips" />

            <FlatList
                data={ACCEPTED_TRIPS}
                keyExtractor={(item) => item.id}
                renderItem={renderTripItem}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Rides</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No rides confirmed yet.</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    listHeader: {
        marginBottom: Spacing.lg,
        marginTop: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xxl,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textMuted,
    },
});

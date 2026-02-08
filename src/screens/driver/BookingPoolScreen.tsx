import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MapPin, Clock, ArrowRightLeft, User, TrendingUp, ShieldCheck, Banknote, Car, Calendar, Circle } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingButton, ZingHeader } from '../../components/common';
import { BookingCard } from '../../components/booking/BookingCard';
import { Booking } from '../../types/booking';
import { supabase } from '../../api/supabase';

const MOCK_BOOKINGS: Booking[] = [
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
    {
        id: '2',
        tripType: 'ROUND TRIP',
        paymentMode: 'Paid by Wallet',
        pickup: 'Koramangala 4th Block',
        drop: 'Kempegowda Intl Airport',
        price: '2400.0',
        carType: 'SUV (AC)',
        carCapacity: '6+1 seater',
        distance: '85.0 KM',
        extraKmRate: '15.0/km',
        driverCharge: 'Included',
        departureTime: 'Feb 08, 2026 10:00 am',
    },
];

export const BookingPoolScreen = () => {
    const insets = useSafeAreaInsets();
    const [isVerified, setIsVerified] = React.useState(false);

    React.useEffect(() => {
        const checkVerification = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('kyc_status')
                    .eq('id', user.id)
                    .single();
                setIsVerified(data?.kyc_status === 'verified');
            }
        };
        checkVerification();
    }, []);

    const handleAccept = (bookingId: string) => {
        if (!isVerified) {
            Alert.alert(
                "Verification Required",
                "Your account is currently under verification. You will be able to accept rides once your documents are approved.",
                [{ text: "OK" }]
            );
            return;
        }
        // Proceed with acceptance logic
    };

    const renderStatCard = (title: string, value: string, icon: React.ReactNode, delay: number) => (
        <Animated.View
            entering={FadeInRight.delay(delay).duration(600).springify()}
            style={styles.statCard}
        >
            <ZingCard variant="glass" padding="md">
                <View style={styles.statHeader}>
                    {icon}
                    <Text style={styles.statValue}>{value}</Text>
                </View>
                <Text style={styles.statTitle}>{title}</Text>
            </ZingCard>
        </Animated.View>
    );

    const renderBookingItem = ({ item, index }: { item: Booking, index: number }) => (
        <BookingCard
            item={item}
            index={index}
            buttonTitle="ACCEPT"
            onButtonPress={() => handleAccept(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader
                title="Active Pool"
                rightElement={
                    <TouchableOpacity style={styles.profileBtn}>
                        <User color={Colors.text} size={24} />
                    </TouchableOpacity>
                }
            />

            <FlatList
                data={MOCK_BOOKINGS}
                keyExtractor={(item) => item.id}
                renderItem={renderBookingItem}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <View style={styles.statsRow}>
                            {renderStatCard("Today's Earnings", "₹4.2k", <TrendingUp size={18} color={Colors.success} />, 100)}
                            {renderStatCard("Status", isVerified ? "Verified" : "Pending", <ShieldCheck size={18} color={isVerified ? Colors.success : Colors.warning} />, 200)}
                        </View>

                        <Text style={styles.sectionTitle}>Available Jobs</Text>
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
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    statCard: {
        width: '48%',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    statValue: {
        ...Typography.h3,
        marginLeft: Spacing.xs,
    },
    statTitle: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.md,
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

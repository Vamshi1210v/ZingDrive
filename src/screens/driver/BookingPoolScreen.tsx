import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MapPin, Clock, ArrowRight, User, TrendingUp, ShieldCheck } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingButton, ZingHeader } from '../../components/common';

const MOCK_BOOKINGS = [
    {
        id: '1',
        pickup: 'Electronic City Phase 1',
        drop: 'Indiranagar Metro Station',
        time: 'In 15 mins',
        estimate: '₹450',
        status: 'open',
    },
    {
        id: '2',
        pickup: 'Koramangala 4th Block',
        drop: 'Kempegowda Intl Airport',
        time: 'In 45 mins',
        estimate: '₹1,200',
        status: 'open',
    },
];

export const BookingPoolScreen = () => {
    const insets = useSafeAreaInsets();

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

    const renderBookingItem = ({ item, index }: { item: typeof MOCK_BOOKINGS[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(400 + index * 100).duration(600).springify()}>
            <ZingCard variant="glass" padding="lg" style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                    <View style={styles.statusPill}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>PENDING</Text>
                    </View>
                    <Text style={styles.estimateText}>{item.estimate}</Text>
                </View>

                <View style={styles.addressContainer}>
                    <View style={styles.pathLine} />
                    <View style={styles.addressRow}>
                        <View style={[styles.dot, { backgroundColor: Colors.info }]} />
                        <Text style={styles.addressText} numberOfLines={1}>{item.pickup}</Text>
                    </View>
                    <View style={[styles.addressRow, { marginTop: Spacing.md }]}>
                        <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
                        <Text style={styles.addressText} numberOfLines={1}>{item.drop}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.bookingFooter}>
                    <View style={styles.timeRow}>
                        <Clock size={16} color={Colors.textMuted} />
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <ZingButton
                        title="Accept"
                        variant="primary"
                        onPress={() => { }}
                        style={styles.acceptBtn}
                        textStyle={styles.acceptBtnText}
                    />
                </View>
            </ZingCard>
        </Animated.View>
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
                            {renderStatCard("Verified", "Active", <ShieldCheck size={18} color={Colors.info} />, 200)}
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
        paddingHorizontal: Spacing.lg,
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
    bookingCard: {
        marginBottom: Spacing.md,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 171, 0, 0.1)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs - 2,
        borderRadius: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.warning,
        marginRight: 6,
    },
    statusText: {
        ...Typography.caption,
        color: Colors.warning,
        fontSize: 10,
    },
    estimateText: {
        ...Typography.h3,
        color: Colors.success,
    },
    addressContainer: {
        marginBottom: Spacing.lg,
        position: 'relative',
    },
    pathLine: {
        position: 'absolute',
        top: 10,
        left: 3.5,
        bottom: 10,
        width: 1,
        backgroundColor: Colors.glassOutline,
        borderStyle: 'dashed',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.md,
    },
    addressText: {
        ...Typography.body,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.glassOutline,
        marginBottom: Spacing.lg,
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginLeft: Spacing.xs,
    },
    acceptBtn: {
        height: 40,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
    },
    acceptBtnText: {
        fontSize: 14,
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

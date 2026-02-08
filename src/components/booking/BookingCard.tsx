import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MapPin, ArrowRightLeft, Banknote, Car, Calendar, Circle } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingButton } from '../common';
import { Booking } from '../../types/booking';

interface BookingCardProps {
    item: Booking;
    index: number;
    buttonTitle: string;
    onButtonPress?: () => void;
    buttonVariant?: 'primary' | 'secondary' | 'outline';
}

export const BookingCard: React.FC<BookingCardProps> = ({
    item,
    index,
    buttonTitle,
    onButtonPress,
    buttonVariant = 'primary'
}) => {
    return (
        <Animated.View entering={FadeInDown.delay(400 + index * 100).duration(600).springify()}>
            <ZingCard variant="glass" padding="none" style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.tripTypeText}>{item.tripType}</Text>
                    <View style={styles.paymentPill}>
                        <Text style={styles.paymentText}>{item.paymentMode}</Text>
                    </View>
                </View>

                <View style={styles.routeSection}>
                    <View style={styles.routeIconColumn}>
                        <Circle size={18} color={Colors.textDim} strokeWidth={3} />
                        <View style={styles.verticalLineDashed} />
                        <MapPin size={18} color={Colors.warning} />
                    </View>
                    <View style={styles.addressColumn}>
                        <Text style={styles.addressText} numberOfLines={1}>{item.pickup}</Text>
                        <View style={styles.addressSpacer} />
                        <Text style={styles.addressText} numberOfLines={1}>{item.drop}</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statColumn}>
                        <Banknote color={Colors.success} size={28} />
                        <Text style={styles.statValueText}>Rs {item.price}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={[styles.statColumn, { flex: 1.5 }]}>
                        <Car color={Colors.warning} size={28} />
                        <Text style={styles.statValueText}>{item.carType}</Text>
                        <Text style={styles.statSubValueText}>({item.carCapacity})</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statColumn}>
                        <ArrowRightLeft color={Colors.textDim} size={28} />
                        <Text style={styles.statValueText}>{item.distance}</Text>
                    </View>
                </View>

                <View style={styles.pricingDetailsRow}>
                    <View style={styles.priceDetailItem}>
                        <Text style={styles.priceDetailValue}>Rs {item.extraKmRate}</Text>
                        <Text style={styles.priceDetailLabel}>(for extra km)</Text>
                    </View>
                    <View style={styles.priceDetailDivider} />
                    <View style={styles.priceDetailItem}>
                        <Text style={styles.priceDetailValue}>{item.driverCharge}</Text>
                        <Text style={styles.priceDetailLabel}>(driver charge)</Text>
                    </View>
                </View>

                <View style={styles.taxInfoSection}>
                    <Text style={styles.taxInfoMain}>Toll & State Tax Included</Text>
                    <Text style={styles.taxInfoSub}>Parking Extra, if applicable</Text>
                </View>

                <View style={styles.departureSection}>
                    <View style={styles.departureHeader}>
                        <Calendar size={18} color={Colors.textDim} />
                        <Text style={styles.departureLabel}>Departure:</Text>
                    </View>
                    <Text style={styles.departureTime}>{item.departureTime}</Text>
                </View>

                <ZingButton
                    title={buttonTitle}
                    variant={buttonVariant}
                    onPress={onButtonPress || (() => { })}
                    style={styles.acceptButton}
                    textStyle={styles.acceptButtonText}
                />
            </ZingCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bookingCard: {
        marginBottom: Spacing.lg,
        paddingTop: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    tripTypeText: {
        ...Typography.caption,
        color: Colors.textDim,
        fontWeight: 'bold',
    },
    paymentPill: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 20,
        ...Shadow.small,
    },
    paymentText: {
        ...Typography.caption,
        color: Colors.text,
        fontSize: 10,
    },
    routeSection: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
    },
    routeIconColumn: {
        alignItems: 'center',
        marginRight: Spacing.md,
        width: 20,
    },
    verticalLineDashed: {
        width: 2,
        height: 30,
        backgroundColor: Colors.glassOutline,
        borderStyle: 'dashed',
        marginVertical: Spacing.xs,
    },
    addressColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    addressText: {
        ...Typography.bodySmall,
        color: Colors.textDim,
    },
    addressSpacer: {
        height: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.glassOutline,
        alignItems: 'center',
    },
    statColumn: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing.xs,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: Colors.glassOutline,
    },
    statValueText: {
        ...Typography.bodySmall,
        color: Colors.text,
        fontWeight: 'bold',
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    statSubValueText: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        textTransform: 'lowercase',
    },
    pricingDetailsRow: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderColor: Colors.glassOutline,
    },
    priceDetailItem: {
        flex: 1,
        alignItems: 'center',
    },
    priceDetailValue: {
        ...Typography.bodySmall,
        color: Colors.textDim,
        fontWeight: 'bold',
    },
    priceDetailLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        textTransform: 'lowercase',
    },
    priceDetailDivider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.glassOutline,
    },
    taxInfoSection: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.glassOutline,
    },
    taxInfoMain: {
        ...Typography.bodySmall,
        color: Colors.textDim,
        fontWeight: 'bold',
    },
    taxInfoSub: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        textTransform: 'none',
    },
    departureSection: {
        padding: Spacing.md,
    },
    departureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    departureLabel: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginLeft: Spacing.sm,
    },
    departureTime: {
        ...Typography.bodySmall,
        color: Colors.textDim,
        fontWeight: 'bold',
        textAlign: 'right',
        position: 'absolute',
        right: Spacing.md,
        top: Spacing.md + 2,
    },
    acceptButton: {
        backgroundColor: Colors.success,
        borderRadius: 0,
        height: 54,
    },
    acceptButtonText: {
        ...Typography.h3,
        color: Colors.text,
        letterSpacing: 1,
    },
});

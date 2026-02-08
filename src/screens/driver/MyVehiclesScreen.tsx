import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, TextInput } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeInRight,
    SlideInRight,
    SlideInLeft,
    Layout
} from 'react-native-reanimated';
import {
    Car as CarIcon,
    UserPlus,
    ShieldCheck,
    FileText,
    Compass,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Plus,
    X,
    Phone,
    UserCircle,
    Star,
    PhoneCall,
    Fuel,
    Users
} from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingHeader, ZingButton } from '../../components/common';

const MOCK_CARS = [
    {
        id: '1',
        name: 'Maruti Suzuki Dzire',
        plate: 'KA03AN1201',
        type: 'SEDAN',
        seats: '5 Seater',
        fuel: 'petrol',
        status: 'Verified',
        docs: {
            rc: 'Verified',
            insurance: 'Verified',
            permit: 'Verified',
            photo: 'Not Submit'
        }
    }
];

const MOCK_DRIVERS = [
    {
        id: '1',
        name: 'GIRESH S',
        phone: '9110669332',
        status: 'Verified',
        docs: {
            license: 'Verified',
            police: 'Rejected'
        }
    },
    {
        id: '2',
        name: 'SANTHOSH VADDARA',
        phone: '9902350915',
        status: 'Verified',
        docs: {
            license: 'Verified',
            police: 'Not Submit'
        }
    }
];

export const MyVehiclesScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState<'DRIVER' | 'CAR'>('CAR');
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [captcha, setCaptcha] = useState('');

    const renderVerificationStatus = (label: string, status: string, icon: React.ReactNode) => (
        <View style={styles.docRow}>
            <Text style={styles.docLabel}>{label}</Text>
            <View style={styles.docStatusContainer}>
                <Text style={[
                    styles.docStatus,
                    status === 'Verified' ? styles.statusGreen : status === 'Rejected' ? styles.statusRed : styles.statusGray
                ]}>{status}</Text>
                {icon}
            </View>
        </View>
    );

    const renderAddDriverModal = () => (
        <Modal
            visible={showAddModal && activeTab === 'DRIVER'}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAddModal(false)}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    entering={FadeInUp.springify()}
                    style={styles.modalContent}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Driver</Text>
                        <TouchableOpacity onPress={() => setShowAddModal(false)}>
                            <X size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputRow}>
                            <UserCircle size={20} color={Colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Name"
                                placeholderTextColor={Colors.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <Phone size={20} color={Colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Number"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <ShieldCheck size={20} color={Colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter number shown in image below"
                                placeholderTextColor={Colors.textMuted}
                                value={captcha}
                                onChangeText={setCaptcha}
                            />
                        </View>
                    </View>

                    <View style={styles.captchaContainer}>
                        <View style={styles.captchaBox}>
                            <Text style={styles.captchaText}>6728</Text>
                        </View>
                    </View>

                    <ZingButton
                        title="SUBMIT"
                        variant="primary"
                        onPress={() => setShowAddModal(false)}
                        style={styles.modalSubmitBtn}
                    />
                </Animated.View>
            </View>
        </Modal>
    );

    const CarCard = ({ car }: { car: typeof MOCK_CARS[0] }) => (
        <ZingCard variant="glass" padding="none" style={styles.itemCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.itemTitle}>{car.name}</Text>
                <View style={[styles.statusPill, styles.pillBlack]}>
                    <Text style={styles.pillText}>VERIFIED</Text>
                </View>
            </View>

            <View style={styles.carInfoRow}>
                <View style={styles.carIconCircle}>
                    <CarIcon size={32} color={Colors.textDim} />
                    <View style={styles.plateContainer}>
                        <Text style={styles.plateText}>{car.plate}</Text>
                    </View>
                </View>
                <View style={styles.carDetails}>
                    <Text style={styles.detailText}>{car.type}</Text>
                    <Text style={styles.detailSubText}>{car.seats}</Text>
                    <Text style={styles.detailSubText}>{car.fuel}</Text>
                </View>
            </View>

            <View style={styles.docSection}>
                {renderVerificationStatus("Regis. Certificate", car.docs.rc, <FileText size={18} color={Colors.success} />)}
                {renderVerificationStatus("Insurance", car.docs.insurance, <ShieldCheck size={18} color={Colors.success} />)}
                {renderVerificationStatus("Permit", car.docs.permit, <Compass size={18} color={Colors.success} />)}
                <View style={styles.cardDivider} />
                {renderVerificationStatus("Car Photo with Owner", car.docs.photo, <CarIcon size={18} color={Colors.textMuted} />)}
            </View>
        </ZingCard>
    );

    const DriverCard = ({ driver }: { driver: typeof MOCK_DRIVERS[0] }) => (
        <ZingCard variant="glass" padding="none" style={styles.itemCard}>
            <View style={styles.cardHeader}>
                <View style={styles.driverProfileHeader}>
                    <UserCircle size={40} color={Colors.textDim} />
                    <View style={styles.driverMainInfo}>
                        <Text style={styles.itemTitle}>{driver.name}</Text>
                        <Text style={styles.driverPhone}>{driver.phone}</Text>
                    </View>
                </View>
                <View style={[styles.statusPill, styles.pillBlack]}>
                    <Text style={styles.pillText}>VERIFIED</Text>
                </View>
            </View>

            <View style={styles.docSection}>
                {renderVerificationStatus("Driving Licence", driver.docs.license, <FileText size={18} color={Colors.success} />)}
                {renderVerificationStatus("Police Verification", driver.docs.police,
                    driver.docs.police === 'Rejected' ? <XCircle size={18} color={Colors.error} /> : <ShieldCheck size={18} color={Colors.textMuted} />
                )}
            </View>
        </ZingCard>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader
                title="Add Car and Driver"
                rightElement={
                    <View style={styles.headerRight}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>3.5</Text>
                            <Star size={12} color="#FFD700" fill="#FFD700" />
                        </View>
                        <TouchableOpacity style={styles.callHeaderBtn}>
                            <PhoneCall size={20} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab('DRIVER')}
                    style={[styles.tab, activeTab === 'DRIVER' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'DRIVER' && styles.activeTabText]}>DRIVER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('CAR')}
                    style={[styles.tab, activeTab === 'CAR' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'CAR' && styles.activeTabText]}>CAR</Text>
                </TouchableOpacity>
            </View>

            {/* Warning Message */}
            <View style={styles.warningBanner}>
                <XCircle size={18} color={Colors.text} />
                <Text style={styles.warningText}>
                    In case of any problem in uploading documents, please WhatsApp documents to 7777-880-880.
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'CAR' ? (
                    <Animated.View entering={SlideInRight} exiting={SlideInLeft} layout={Layout.springify()}>
                        {MOCK_CARS.map(car => <CarCard key={car.id} car={car} />)}
                    </Animated.View>
                ) : (
                    <Animated.View entering={SlideInLeft} exiting={SlideInRight} layout={Layout.springify()}>
                        {MOCK_DRIVERS.map(driver => <DriverCard key={driver.id} driver={driver} />)}
                    </Animated.View>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    if (activeTab === 'CAR') {
                        navigation?.navigate('AddCar');
                    } else {
                        setShowAddModal(true);
                    }
                }}
            >
                {activeTab === 'CAR' ? <Plus size={30} color={Colors.text} /> : <UserPlus size={30} color={Colors.text} />}
            </TouchableOpacity>

            {/* Bottom Button */}
            <TouchableOpacity style={styles.premiumBtn}>
                <Text style={styles.premiumBtnText}>UPGRADE TO PREMIUM ACCOUNT</Text>
            </TouchableOpacity>

            {renderAddDriverModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 0, 0.4)',
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: Spacing.md,
        minWidth: 55,
        justifyContent: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: 'bold',
        marginRight: 2,
    },
    callHeaderBtn: {
        padding: Spacing.xs,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        ...Typography.caption,
        color: Colors.textDim,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: Colors.text,
    },
    warningBanner: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: Spacing.md,
        alignItems: 'center',
    },
    warningText: {
        ...Typography.caption,
        color: Colors.text,
        fontSize: 10,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 100,
    },
    itemCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    itemTitle: {
        ...Typography.body,
        fontWeight: 'bold',
        color: Colors.textMuted,
    },
    statusPill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 8,
    },
    pillBlack: {
        backgroundColor: '#000',
        ...Shadow.small,
    },
    pillText: {
        ...Typography.caption,
        color: Colors.text,
        fontSize: 10,
        fontWeight: 'bold',
    },
    carInfoRow: {
        flexDirection: 'row',
        padding: Spacing.md,
        alignItems: 'center',
    },
    carIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.lg,
    },
    plateContainer: {
        position: 'absolute',
        bottom: -5,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        borderRadius: 10,
    },
    plateText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.text,
    },
    carDetails: {
        flex: 1,
    },
    detailText: {
        ...Typography.bodySmall,
        color: Colors.textDim,
        fontWeight: 'bold',
    },
    detailSubText: {
        ...Typography.caption,
        color: Colors.textMuted,
        textTransform: 'none',
        marginTop: 2,
    },
    docSection: {
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    docRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
    },
    docLabel: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
    },
    docStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docStatus: {
        ...Typography.bodySmall,
        marginRight: Spacing.sm,
        fontWeight: 'bold',
    },
    statusGreen: {
        color: Colors.success,
    },
    statusRed: {
        color: Colors.error,
    },
    statusGray: {
        color: Colors.textMuted,
    },
    cardDivider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginVertical: Spacing.sm,
        borderStyle: 'dashed',
    },
    driverProfileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverMainInfo: {
        marginLeft: Spacing.md,
    },
    driverPhone: {
        ...Typography.caption,
        color: Colors.textMuted,
        textTransform: 'none',
    },
    fab: {
        position: 'absolute',
        bottom: 80,
        right: Spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadow.medium,
    },
    premiumBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.primary,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumBtnText: {
        ...Typography.bodySmall,
        fontWeight: 'bold',
        color: Colors.text,
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        ...Shadow.medium,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    modalTitle: {
        ...Typography.h3,
        color: Colors.text,
    },
    inputGroup: {
        padding: Spacing.md,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        marginBottom: Spacing.md,
        paddingBottom: 4,
    },
    input: {
        flex: 1,
        marginLeft: Spacing.md,
        ...Typography.body,
    },
    captchaContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    captchaBox: {
        backgroundColor: '#FFB800',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 8,
    },
    captchaText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 4,
        fontStyle: 'italic',
    },
    modalSubmitBtn: {
        borderRadius: 0,
        height: 54,
    },
});

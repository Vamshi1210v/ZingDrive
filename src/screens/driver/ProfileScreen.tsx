import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import {
    User,
    Phone,
    Mail,
    Shield,
    Camera,
    Edit2,
    CreditCard,
    Smartphone,
    Building2,
    CheckCircle2,
    ChevronRight,
    LogOut
} from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingHeader, ZingButton } from '../../components/common';
import { supabase } from '../../api/supabase';

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI ID', icon: <CreditCard size={18} /> },
    { id: 'paytm', label: 'PAYTM No.', icon: <Smartphone size={18} /> },
    { id: 'bank', label: 'BANK Details', icon: <Building2 size={18} /> },
];

export const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('upi');

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const renderInfoItem = (icon: React.ReactNode, label: string, value: string, editable: boolean = true) => (
        <Animated.View layout={Layout.springify()} style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
                {icon}
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            {editable && (
                <TouchableOpacity style={styles.editBtn}>
                    <Edit2 size={16} color={Colors.primary} />
                </TouchableOpacity>
            )}
        </Animated.View>
    );

    const renderVerificationCard = (title: string, icon: React.ReactNode, status: string) => (
        <ZingCard variant="glass" padding="md" style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
                <View style={styles.verificationTitleRow}>
                    {icon}
                    <Text style={styles.verificationTitle}>{title}</Text>
                </View>
                <CheckCircle2 size={20} color={Colors.success} />
            </View>
            <View style={styles.statusDivider} />
            <Text style={styles.statusText}>{status}</Text>
        </ZingCard>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader
                title="Profile"
                rightElement={
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <LogOut size={20} color={Colors.error} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Header */}
                <Animated.View
                    entering={FadeInDown.duration(600).springify()}
                    style={styles.headerSection}
                >
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <User size={60} color={Colors.textDim} />
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Camera size={16} color={Colors.background} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>CHANDRAKANTH</Text>
                    <View style={styles.agencyTag}>
                        <Building2 size={14} color={Colors.primary} />
                        <Text style={styles.agencyName}>zingcabs</Text>
                    </View>
                </Animated.View>

                {/* Contact Information */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(600).springify()}
                    style={styles.section}
                >
                    <ZingCard variant="glass" padding="none">
                        {renderInfoItem(<Phone size={20} color={Colors.info} />, "Phone Number", "9110669332")}
                        <View style={styles.divider} />
                        {renderInfoItem(<Mail size={20} color={Colors.warning} />, "Email Address", "cabszing@gmail.com")}
                        <View style={styles.divider} />
                        {renderInfoItem(<Shield size={20} color={Colors.success} />, "PAN Number", "BOHPG6794K")}
                    </ZingCard>
                </Animated.View>

                {/* Payment Methods */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(600).springify()}
                    style={styles.section}
                >
                    <Text style={styles.sectionHeader}>Account to receive Payments</Text>
                    <ZingCard variant="glass" padding="none">
                        <View style={styles.tabContainer}>
                            {PAYMENT_METHODS.map((tab) => (
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    style={[
                                        styles.tab,
                                        activeTab === tab.id && styles.activeTab
                                    ]}
                                >
                                    <Text style={[
                                        styles.tabLabel,
                                        activeTab === tab.id && styles.activeTabLabel
                                    ]}>{tab.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.tabContent}>
                            {renderInfoItem(
                                activeTab === 'upi' ? <CreditCard size={20} color={Colors.primary} /> :
                                    activeTab === 'paytm' ? <Smartphone size={20} color={Colors.primary} /> :
                                        <Building2 size={20} color={Colors.primary} />,
                                activeTab === 'upi' ? "UPI ID" : activeTab === 'paytm' ? "Paytm Number" : "Bank Details",
                                "XXXXXXXX"
                            )}
                        </View>
                    </ZingCard>
                </Animated.View>

                {/* Verification Section */}
                <Animated.View
                    entering={FadeInDown.delay(600).duration(600).springify()}
                    style={styles.section}
                >
                    <View style={styles.verificationPrompt}>
                        <Text style={styles.promptMain}>Join ZingDrive Network</Text>
                        <Text style={styles.promptSub}>Your Aadhaar and PAN are verified successfully.</Text>
                    </View>

                    <View style={styles.verificationGrid}>
                        {renderVerificationCard(
                            "Aadhaar Card",
                            <Building2 size={20} color={Colors.success} />,
                            "Verified successfully"
                        )}
                        <View style={{ width: Spacing.md }} />
                        {renderVerificationCard(
                            "PAN Card",
                            <Shield size={20} color={Colors.success} />,
                            "Verified successfully"
                        )}
                    </View>
                </Animated.View>

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
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
        paddingTop: Spacing.lg,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: Colors.glassOutline,
        ...Shadow.medium,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.background,
    },
    userName: {
        ...Typography.h2,
        color: Colors.text,
        letterSpacing: 1,
    },
    agencyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryGlass,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 20,
        marginTop: Spacing.sm,
    },
    agencyName: {
        ...Typography.caption,
        color: Colors.primary,
        marginLeft: Spacing.xs,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
        marginLeft: Spacing.xs,
        fontWeight: 'bold',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    infoIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    infoValue: {
        ...Typography.body,
        color: Colors.text,
        fontWeight: '600',
    },
    editBtn: {
        padding: Spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.glassOutline,
        marginLeft: 76,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Colors.glassOutline,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: Colors.primary,
    },
    tabLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
    },
    activeTabLabel: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    tabContent: {
        paddingVertical: Spacing.sm,
    },
    verificationPrompt: {
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xs,
    },
    promptMain: {
        ...Typography.body,
        fontWeight: 'bold',
        color: Colors.text,
    },
    promptSub: {
        ...Typography.bodySmall,
        color: Colors.textDim,
        fontSize: 12,
    },
    verificationGrid: {
        flexDirection: 'row',
    },
    verificationCard: {
        flex: 1,
    },
    verificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    verificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verificationTitle: {
        ...Typography.bodySmall,
        fontWeight: 'bold',
        marginLeft: Spacing.sm,
    },
    statusDivider: {
        height: 1,
        backgroundColor: Colors.glassOutline,
        marginBottom: Spacing.sm,
    },
    statusText: {
        ...Typography.caption,
        color: Colors.success,
        fontSize: 10,
        fontWeight: 'bold',
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 61, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

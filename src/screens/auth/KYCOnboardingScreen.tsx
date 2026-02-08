import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Image,
    Platform
} from 'react-native';
import { Shield, CreditCard, FileText, Camera, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingHeader, ZingButton } from '../../components/common';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { supabase } from '../../api/supabase';

export const KYCOnboardingScreen = ({ navigation }: any) => {
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [dlNumber, setDlNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!aadhaarNumber || !panNumber || !dlNumber) {
            setError('Please fill in all document numbers');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    onboarding_completed: true,
                    kyc_status: 'pending',
                    // In a real app we'd also upload images to storage here
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Trigger RootNavigator to re-fetch by updating metadata
            await supabase.auth.updateUser({
                data: { onboarding_completed: true }
            });

            // RootNavigator will now handle the switch!
        } catch (err: any) {
            setError(err.message || 'Failed to submit verification');
        } finally {
            setLoading(false);
        }
    };

    const renderDocumentUpload = (label: string, icon: React.ReactNode) => (
        <View style={styles.uploadContainer}>
            <Text style={styles.uploadLabel}>{label}</Text>
            <TouchableOpacity style={styles.uploadBox}>
                <View style={styles.uploadInner}>
                    {icon}
                    <Text style={styles.uploadPlaceholder}>Click to upload image</Text>
                </View>
                <View style={styles.cameraIcon}>
                    <Camera size={14} color={Colors.background} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderInputGroup = (label: string, icon: React.ReactNode, value: string, setValue: (v: string) => void, placeholder: string) => (
        <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.fieldIcon}>{icon}</View>
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    value={value}
                    onChangeText={setValue}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader
                title="Identity Verification"
                showBack
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.springify()} style={styles.introSection}>
                    <Text style={styles.introTitle}>KYC Verification</Text>
                    <Text style={styles.introSub}>Please upload clear photos of your documents for faster verification.</Text>
                </Animated.View>

                {/* Aadhaar Section */}
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
                    <Text style={styles.sectionTitle}>Aadhaar Card</Text>
                    <ZingCard variant="glass" padding="md">
                        {renderInputGroup("Aadhaar Number", <CreditCard size={18} color={Colors.primary} />, aadhaarNumber, setAadhaarNumber, "Enter 12 digit number")}
                        <View style={styles.uploadRow}>
                            {renderDocumentUpload("Front View", <FileText size={24} color={Colors.textMuted} />)}
                            <View style={{ width: Spacing.md }} />
                            {renderDocumentUpload("Back View", <FileText size={24} color={Colors.textMuted} />)}
                        </View>
                    </ZingCard>
                </Animated.View>

                {/* Driving License Section */}
                <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
                    <Text style={styles.sectionTitle}>Driving License</Text>
                    <ZingCard variant="glass" padding="md">
                        {renderInputGroup("License Number", <Shield size={18} color={Colors.primary} />, dlNumber, setDlNumber, "Enter DL Number")}
                        <View style={styles.uploadRow}>
                            {renderDocumentUpload("Front View", <FileText size={24} color={Colors.textMuted} />)}
                            <View style={{ width: Spacing.md }} />
                            {renderDocumentUpload("Back View", <FileText size={24} color={Colors.textMuted} />)}
                        </View>
                    </ZingCard>
                </Animated.View>

                {/* PAN Section */}
                <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.section}>
                    <Text style={styles.sectionTitle}>PAN Detail</Text>
                    <ZingCard variant="glass" padding="md">
                        {renderInputGroup("PAN Number", <CreditCard size={18} color={Colors.primary} />, panNumber, setPanNumber, "Enter PAN Number")}
                    </ZingCard>
                </Animated.View>

                <View style={styles.infoBox}>
                    <CheckCircle2 size={16} color={Colors.success} />
                    <Text style={styles.infoText}>Your data is safe and used only for verification purposes.</Text>
                </View>

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <ZingButton
                    title="SUBMIT FOR VERIFICATION"
                    variant="primary"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.submitBtn}
                />

                <View style={{ height: Spacing.xl }} />
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
        padding: Spacing.md,
    },
    introSection: {
        marginBottom: Spacing.lg,
        paddingHorizontal: Spacing.xs,
    },
    introTitle: {
        ...Typography.h2,
        color: Colors.text,
    },
    introSub: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginTop: 4,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.caption,
        color: Colors.textDim,
        fontWeight: 'bold',
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    fieldLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        marginBottom: 4,
        textTransform: 'none',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.glassOutline,
        paddingVertical: 4,
    },
    fieldIcon: {
        marginRight: Spacing.sm,
    },
    textInput: {
        flex: 1,
        ...Typography.body,
        color: Colors.text,
        padding: 0,
    },
    uploadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    uploadContainer: {
        flex: 1,
    },
    uploadLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
        marginBottom: 8,
        textTransform: 'none',
    },
    uploadBox: {
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.glassOutline,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadInner: {
        alignItems: 'center',
    },
    uploadPlaceholder: {
        ...Typography.caption,
        fontSize: 8,
        color: Colors.textMuted,
        marginTop: 4,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        backgroundColor: Colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.surface,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 200, 83, 0.05)',
        padding: Spacing.md,
        borderRadius: 8,
        marginBottom: Spacing.xl,
    },
    infoText: {
        ...Typography.caption,
        color: Colors.success,
        fontSize: 10,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    submitBtn: {
        borderRadius: 12,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        textAlign: 'center',
        marginBottom: Spacing.md,
        fontWeight: 'bold',
    },
});

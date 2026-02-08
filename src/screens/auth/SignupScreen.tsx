import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { User, Mail, Lock, Calendar, ArrowRight, ArrowLeft, X } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingCard, ZingButton } from '../../components/common';
import Animated, { FadeInDown, FadeInUp, SlideInUp } from 'react-native-reanimated';
import { supabase } from '../../api/supabase';

export const SignupScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (!name || !email || !password || !dob) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        dob: dob,
                    }
                }
            });

            if (authError) {
                setError(authError.message);
            } else {
                // On success, navigate to KYC
                navigation.navigate('KYCOnboarding');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const DatePickerModal = () => (
        <Modal
            visible={showDatePicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    entering={SlideInUp.springify().damping(15)}
                    style={styles.modalContent}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Date of Birth</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <X size={24} color={Colors.textDim} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.pickerGrid}>
                        {/* Simplified picker - for a real production app we'd use a better picker, 
                            but for this UI demonstration we'll simulate a quick selector */}
                        <Text style={styles.pickerInfo}>Enter date in format DD/MM/YYYY</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={Colors.textMuted}
                            value={dob}
                            onChangeText={setDob}
                            keyboardType="numeric"
                            autoFocus
                        />
                        <ZingButton
                            title="CONFIRM"
                            onPress={() => setShowDatePicker(false)}
                            style={styles.modalConfirmBtn}
                        />
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );

    const renderInput = (
        icon: React.ReactNode,
        placeholder: string,
        value: string,
        onChangeText: (text: string) => void,
        secureTextEntry: boolean = false,
        onPress?: () => void
    ) => (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            style={styles.inputContainer}
        >
            <View style={styles.inputIcon}>
                {icon}
            </View>
            {onPress ? (
                <Text style={[styles.input, !value && { color: Colors.textMuted }]}>
                    {value || placeholder}
                </Text>
            ) : (
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    editable={!onPress}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ArrowLeft color={Colors.text} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the ZingDrive professional network</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800).springify()} style={styles.formContainer}>
                    <ZingCard variant="glass" padding="md">
                        {renderInput(<User size={20} color={Colors.primary} />, "Full Name", name, setName)}
                        <View style={styles.divider} />
                        {renderInput(<Mail size={20} color={Colors.primary} />, "Email Address", email, setEmail)}
                        <View style={styles.divider} />
                        {renderInput(<Lock size={20} color={Colors.primary} />, "Password", password, setPassword, true)}
                        <View style={styles.divider} />
                        {renderInput(
                            <Calendar size={20} color={Colors.primary} />,
                            "Date of Birth",
                            dob,
                            setDob,
                            false,
                            () => setShowDatePicker(true)
                        )}
                    </ZingCard>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <Text style={styles.termsText}>
                        By signing up, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>

                    <ZingButton
                        title="CONTINUE"
                        onPress={handleSignup}
                        variant="primary"
                        loading={loading}
                        style={styles.signupBtn}
                        icon={<ArrowRight size={20} color={Colors.text} />}
                    />
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <DatePickerModal />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: {
        marginBottom: Spacing.xxl,
    },
    backBtn: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textDim,
    },
    formContainer: {
        marginBottom: Spacing.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    inputIcon: {
        marginRight: Spacing.md,
    },
    input: {
        flex: 1,
        ...Typography.body,
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.glassOutline,
        marginVertical: Spacing.xs,
    },
    signupBtn: {
        marginTop: Spacing.lg,
    },
    termsText: {
        ...Typography.caption,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing.lg,
        lineHeight: 18,
    },
    linkText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    footerText: {
        ...Typography.bodySmall,
        color: Colors.textDim,
    },
    loginLink: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        textAlign: 'center',
        marginTop: Spacing.md,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: Spacing.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
        ...Shadow.medium,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        ...Typography.h2,
        color: Colors.text,
    },
    pickerGrid: {
        paddingTop: Spacing.md,
    },
    pickerInfo: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    modalInput: {
        height: 56,
        backgroundColor: Colors.background,
        borderRadius: 16,
        paddingHorizontal: Spacing.md,
        ...Typography.h3,
        textAlign: 'center',
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.glassOutline,
    },
    modalConfirmBtn: {
        borderRadius: 16,
    }
});

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    ScrollView,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    withSequence
} from 'react-native-reanimated';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { ZingButton, ZingInput, ZingCard } from '../../components/common';
import { supabase } from '../../api/supabase';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const blobPos = useSharedValue(0);

    useEffect(() => {
        blobPos.value = withRepeat(
            withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    const blobStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: Math.sin(blobPos.value * Math.PI * 2) * 50 },
            { translateY: Math.cos(blobPos.value * Math.PI * 2) * 30 },
            { scale: 1 + Math.sin(blobPos.value * Math.PI) * 0.1 },
        ],
    }));

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError) setError(authError.message);
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Animated Blobs */}
            <Animated.View style={[styles.blob, styles.blob1, blobStyle]} />
            <View style={[styles.blob, styles.blob2]} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Animated.View
                            entering={FadeInDown.delay(200).duration(800).springify()}
                            style={styles.logoCircle}
                        >
                            <Text style={styles.logoText}>Z</Text>
                        </Animated.View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).duration(800).springify()}
                            style={styles.title}
                        >
                            Welcome Back
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInDown.delay(500).duration(800)}
                            style={styles.subtitle}
                        >
                            Log in to manage your driver profile
                        </Animated.Text>
                    </View>

                    <Animated.View
                        entering={FadeInUp.delay(600).duration(1000).springify()}
                        style={styles.formContainer}
                    >
                        <ZingCard variant="glass" padding="lg">
                            <ZingInput
                                label="Email Address"
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                icon={<Mail size={20} color={Colors.textMuted} />}
                            />

                            <ZingInput
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<Lock size={20} color={Colors.textMuted} />}
                            />

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {error ? (
                                <Animated.Text
                                    entering={FadeInDown}
                                    style={styles.errorText}
                                >
                                    {error}
                                </Animated.Text>
                            ) : null}

                            <ZingButton
                                title="Login"
                                onPress={handleLogin}
                                loading={loading}
                                style={styles.loginBtn}
                                icon={<ArrowRight size={20} color={Colors.text} />}
                            />
                        </ZingCard>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(800).duration(800)}
                        style={styles.footer}
                    >
                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    blob: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: (width * 0.8) / 2,
        opacity: 0.15,
    },
    blob1: {
        backgroundColor: Colors.primary,
        top: -height * 0.1,
        right: -width * 0.2,
    },
    blob2: {
        backgroundColor: '#4C1D95', // Deep Purple
        bottom: -height * 0.1,
        left: -width * 0.2,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        marginTop: height * 0.12,
        marginBottom: Spacing.xl,
        alignItems: 'center',
    },
    logoCircle: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        transform: [{ rotate: '15deg' }],
    },
    logoText: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.text,
    },
    title: {
        ...Typography.h1,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.bodySmall,
        textAlign: 'center',
        color: Colors.textDim,
    },
    formContainer: {
        width: '100%',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: Spacing.lg,
    },
    forgotText: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
    },
    loginBtn: {
        marginTop: Spacing.sm,
    },
    errorText: {
        ...Typography.bodySmall,
        color: Colors.error,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: Spacing.xl,
    },
    footerText: {
        ...Typography.bodySmall,
        textAlign: 'center',
        color: Colors.textDim,
    },
    link: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

export default LoginScreen;

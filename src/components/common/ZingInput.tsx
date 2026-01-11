import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    TextInputProps,
    StyleProp,
    ViewStyle
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../../theme';

interface ZingInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
}

export const ZingInput: React.FC<ZingInputProps> = ({
    label,
    error,
    containerStyle,
    icon,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        borderColor: focusAnim.value ? Colors.primary : Colors.glassOutline,
        backgroundColor: focusAnim.value ? 'rgba(255, 107, 0, 0.05)' : Colors.glass,
        borderWidth: focusAnim.value ? 1.5 : 1,
    }));

    const handleFocus = (e: any) => {
        setIsFocused(true);
        focusAnim.value = withSpring(1);
        props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        focusAnim.value = withSpring(0);
        props.onBlur?.(e);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Animated.View style={[styles.inputContainer, animatedStyle]}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.textMuted}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </Animated.View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
        width: '100%',
    },
    label: {
        ...Typography.bodySmall,
        marginBottom: Spacing.xs,
        color: Colors.textDim,
        fontWeight: '600',
    },
    inputContainer: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
    },
    input: {
        flex: 1,
        ...Typography.body,
        color: Colors.text,
        height: '100%',
    },
    icon: {
        marginRight: Spacing.sm,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        marginTop: Spacing.xs,
        textTransform: 'none',
    },
});

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    StyleProp,
    ViewStyle,
    TextStyle
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, Shadow } from '../../theme';

interface ZingButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'glass';
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ZingButton: React.FC<ZingButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return styles.primary;
            case 'secondary':
                return styles.secondary;
            case 'outline':
                return styles.outline;
            case 'glass':
                return styles.glass;
            default:
                return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return [styles.text, { color: Colors.primary }];
            default:
                return styles.text;
        }
    };

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                styles.base,
                getVariantStyles(),
                disabled && styles.disabled,
                style,
                animatedStyle
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.text} />
            ) : (
                <>
                    {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                </>
            )}
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        ...Shadow.small,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.surface,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        ...Shadow.small,
    },
    glass: {
        backgroundColor: Colors.glass,
        borderWidth: 1,
        borderColor: Colors.glassOutline,
        ...Shadow.small,
    },
    text: {
        ...Typography.button,
    },
    disabled: {
        opacity: 0.5,
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },
});

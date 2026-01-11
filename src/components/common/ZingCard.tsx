import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { Colors, Spacing, Shadow } from '../../theme';

interface ZingCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'glass' | 'surface' | 'outline';
    padding?: keyof typeof Spacing;
}

export const ZingCard: React.FC<ZingCardProps> = ({
    children,
    style,
    variant = 'glass',
    padding = 'md'
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'glass':
                return styles.glass;
            case 'surface':
                return styles.surface;
            case 'outline':
                return styles.outline;
            default:
                return styles.glass;
        }
    };

    return (
        <View style={[
            styles.base,
            getVariantStyle(),
            { padding: Spacing[padding] },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 24,
        overflow: 'hidden',
        ...Shadow.small,
    },
    glass: {
        backgroundColor: Colors.glass,
        borderWidth: 1,
        borderColor: Colors.glassOutline,
    },
    surface: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.glassOutline,
    },
});

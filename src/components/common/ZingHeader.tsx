import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface ZingHeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
}

export const ZingHeader: React.FC<ZingHeaderProps> = ({
    title,
    showBack = false,
    onBack,
    rightElement,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
            <View style={styles.content}>
                <View style={styles.left}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={onBack}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <ChevronLeft color={Colors.text} size={28} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.right}>
                    {rightElement}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
    },
    left: {
        width: 40,
        alignItems: 'flex-start',
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -Spacing.xs,
    },
    title: {
        ...Typography.h3,
        textAlign: 'center',
    },
});

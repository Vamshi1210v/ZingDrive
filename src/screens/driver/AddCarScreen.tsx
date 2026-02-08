import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { ChevronDown, Phone } from 'lucide-react-native';
import { Colors, Spacing, Typography, Shadow } from '../../theme';
import { ZingHeader, ZingButton, ZingCard } from '../../components/common';

export const AddCarScreen = ({ navigation }: any) => {
    const [carBrand, setCarBrand] = useState('');
    const [carName, setCarName] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');
    const [seats, setSeats] = useState('4');

    const renderDropdown = (label: string, value: string, placeholder: string) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TouchableOpacity style={styles.dropdown}>
                <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
                    {value || placeholder}
                </Text>
                <ChevronDown size={20} color={Colors.textMuted} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ZingHeader
                title="Add New Car"
                showBack
                onBack={() => navigation?.goBack()}
                rightElement={
                    <TouchableOpacity style={styles.callBtn}>
                        <Phone size={20} color={Colors.text} />
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ZingCard variant="glass" padding="md" style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Select Car</Text>
                    {renderDropdown("Car Brand", carBrand, "Select a brand")}
                    {renderDropdown("Car Name", carName, "Select a car")}
                </ZingCard>

                <ZingCard variant="glass" padding="md" style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Car Details</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Car Number</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter car number"
                            placeholderTextColor={Colors.textMuted}
                            value={carNumber}
                            onChangeText={setCarNumber}
                        />
                    </View>
                    {renderDropdown("Fuel Type", fuelType, "Select fuel type")}

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>No. of seats</Text>
                        <View style={styles.seatsRow}>
                            <Text style={styles.seatOptionFade}>26</Text>
                            <View style={styles.seatActiveBox}>
                                <Text style={styles.seatActiveText}>{seats}</Text>
                            </View>
                            <Text style={styles.seatOptionFade}>5</Text>
                        </View>
                    </View>
                </ZingCard>
            </ScrollView>

            <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => navigation?.goBack()}
            >
                <Text style={styles.submitBtnText}>ADD CAR</Text>
            </TouchableOpacity>
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
    callBtn: {
        padding: Spacing.xs,
    },
    sectionCard: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: 'bold',
        color: Colors.textDim,
        marginBottom: Spacing.md,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    inputLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        paddingVertical: Spacing.sm,
    },
    dropdownValue: {
        ...Typography.body,
        color: Colors.text,
    },
    dropdownPlaceholder: {
        ...Typography.body,
        color: Colors.textMuted,
    },
    textInput: {
        ...Typography.body,
        color: Colors.text,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        paddingVertical: Spacing.sm,
    },
    seatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
    },
    seatOptionFade: {
        ...Typography.h3,
        color: Colors.textDim,
        opacity: 0.3,
        marginHorizontal: Spacing.xl,
    },
    seatActiveBox: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.divider,
        paddingHorizontal: Spacing.xl,
    },
    seatActiveText: {
        ...Typography.h2,
        color: Colors.text,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        ...Typography.bodySmall,
        fontWeight: 'bold',
        color: Colors.text,
        letterSpacing: 1,
    }
});

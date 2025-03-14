import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import axiosInstance from '@utils/axiosInstance';
import { withBadge } from "react-native-elements";
import theme from '@theme';

const UserReportModal = ({ visible, onClose, userToReport, onReport }) => {
    const [capacityValue, setCapacityValue] = useState('');
    const [description, setDescription] = useState('');
    const [countIsFocus, setCountIsFocus] = useState(false);


    const dataCapacity = [
        { label: 'Spam', value: 'spam' },
        { label: 'Toxic Behavior', value: 'toxic behavior' },
        { label: 'Hate speech', value: 'hate speech' },
        { label: 'Scamming', value: 'scamming' },
        { label: 'Griefing', value: 'griefing' },
        { label: 'Doxxing', value: 'doxxing' },
        { label: 'Other', value: 'other' },
    ];


    const handleReport = async () => {

        const reportData = {
            reason: capacityValue,
            description: description || '',
        };

        try {
            console.log('Signalement en cours...');
            const response = await axiosInstance.post(`/users-reports/${userToReport.user._id}`, reportData);
            console.log('Signalement réussi:', response.data);
            onReport(userToReport);
            onClose();
        } catch (error) {
            console.log('in error =>', error.response)
            console.error('Erreur lors du signalement:', error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={styles.modalContainer}>

                    <Text style={styles.title}>Report {userToReport?.user?.username}</Text>

                    <Dropdown
                        style={[styles.capacityDropdown, countIsFocus && { borderColor: 'blue' }]}
                        iconStyle={styles.iconStyle}
                        data={dataCapacity}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder={!countIsFocus ? 'Choose a reason' : '...'}
                        value={capacityValue}
                        onFocus={() => setCountIsFocus(true)}
                        onBlur={() => setCountIsFocus(false)}
                        onChange={item => {
                            setCapacityValue(item.value);
                            setCountIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <View style={styles.iconContainer}>
                                <AntDesign
                                    style={styles.icon}
                                    color={countIsFocus ? 'blue' : 'black'}
                                    name="warning"
                                    size={25}
                                />
                            </View>
                        )}
                    />

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={{ marginBottom: 10 }}>Description (optional):</Text>
                        <TextInput
                            style={styles.description}
                            placeholder="Describe briefly the problem"
                            onChangeText={setDescription}
                            value={description}
                        />
                    </View>

                    <Text style={styles.message}>Do you want to report this user ?</Text>

                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <TouchableOpacity onPress={handleReport}>
                            <Text style={styles.buttonSignal}>Report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.button}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        // width: "60%",
        padding: 20,
        backgroundColor: "#F0E9E0",
        borderRadius: 50,
        alignItems: "center",

    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        padding: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 10,
        marginVertical: 10,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: theme.colors.green,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: theme.colors.white,
        marginTop: 10,
        fontWeight: "bold",
        borderRadius: 100,
    },
    buttonSignal: {
        backgroundColor: theme.colors.red,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: theme.colors.white,
        marginTop: 10,
        fontWeight: "bold",
        borderRadius: 100,
    },
    description: {
        height: 60,
        borderColor: '#55453F',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 15,

    },
    // DROPDOWN
    capacityDropdown: {
        height: 40,
        borderColor: '#55453F',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 15,
        width: 250,
        marginBottom: 20,
    },
    icon: {
        marginRight: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
};

export default UserReportModal;

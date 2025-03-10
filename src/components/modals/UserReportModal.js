import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import axiosInstance from '@utils/axiosInstance'; 

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>

                    <Text style={styles.title}>Signaler {userToReport?.user?.username}</Text>

                    <Dropdown
                        style={[styles.capacityDropdown, countIsFocus && { borderColor: 'blue' }]}
                        iconStyle={styles.iconStyle}
                        data={dataCapacity}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder={!countIsFocus ? 'Choisir un motif' : '...'}
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

                    <View >
                        <Text>Description (facultatif):</Text>
                        <TextInput
                            style={styles.description}
                            placeholder="Décrivez brièvement le problème"
                            onChangeText={setDescription}
                            value={description}
                        />
                    </View>

                    <Text style={styles.message}>Es-tu sûr de vouloir signaler cet utilisateur ?</Text>

                   
                    <TouchableOpacity onPress={handleReport}>
                        <Text style={styles.button}>Signaler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.button}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    message: {
        fontSize: 16,
        marginVertical: 10,
    },
    button: {
        fontSize: 16,
        color: "blue",
        marginTop: 10,
    },
    description: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 15,
      
    },
    // DROPDOWN
    capacityDropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 15,
        width: '80%',
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

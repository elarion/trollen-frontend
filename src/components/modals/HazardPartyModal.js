import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HazardPartyModal = ({ visible, onClose, onConfirm }) => {
    const [game, setGame] = useState(true);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalViewHazardParty}>
                    <Text style={styles.modalTitle}>Join a Hazard Party</Text>
                    <View style={styles.inputSectionHazardParty}>
                        <Text>Choose any game you want to play</Text>
                        <View style={styles.sectionBoxHazardParty}>
                            <Checkbox
                                style={styles.checkbox}
                                value={game}
                                onValueChange={setGame}
                                color={game ? '#4630EB' : undefined}
                            />
                            <Text style={styles.checkboxTextHazardParty}>Motamaux</Text>
                        </View>
                    </View>
                    <View style={styles.btnModalJoinRoom}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => onClose()}>
                            <Text style={styles.textStyle}>back</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonValidation]}
                            onPress={() => onConfirm()}>
                            <Text style={styles.textStyle}>join</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '90%',
    },
    modalViewHazardParty: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    sectionBoxHazardParty: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '1%',
        paddingVertical: 10,
    },

    inputSectionHazardParty: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    checkboxTextHazardParty: {
        fontSize: 15,
    },
    button: {
        borderRadius: 20,
        padding: 10,
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '20%',
        width: '100%'
    },
    btnModalJoinRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10%',
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'red',
        width: '45%',
        alignItems: 'center',
    },
    buttonValidation: {
        backgroundColor: 'green',
        width: '45%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 800,
    },
    inputSection: {
        height: '60%',
        marginTop: '10%',
        alignItems: 'center',
        width: '100%',
        gap: 10
    },
    scrollContainer: { paddingBottom: 20 }, // Permet de scroller sans bug
    modalTitle: { fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 10 },
    inputSection: { marginTop: 10, alignItems: 'center', width: '100%', gap: 10 },
    input: { width: '90%', height: 40, borderWidth: 1, borderRadius: 20, paddingLeft: 15 },
    dropdown: { height: 40, borderWidth: 0.5, borderRadius: 20, paddingHorizontal: 15, width: '90%' },
    sectionBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    checkbox: { marginRight: 10 },
    btnModal: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
    button: { borderRadius: 99, padding: 10 },
    buttonClose: { backgroundColor: 'red', width: '45%', alignItems: 'center' },
    buttonValidation: { backgroundColor: 'green', width: '45%', alignItems: 'center' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default HazardPartyModal;

import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

import theme from '@theme';

const initialPartyForm = {
    roomname: '',
    tag: '',
    password: '',
    isSafe: false,
    isPrivate: false,
    capacityValue: '0',
};
const CreateRoomModal = ({ visible, onClose, onConfirm }) => {
    const [partyForm, setPartyForm] = useState(initialPartyForm);
    const [game, setGame] = useState('WordToWord');
    const [partyName, setPartyName] = useState('');

    return (<Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => onClose(false)}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalViewCreateParty}>
                <Text style={styles.modalTitle}>Create a party</Text>


                <View style={styles.inputSectionCreateParty}>
                    <TextInput
                        style={styles.input}
                        placeholder="Room name"
                        onChangeText={setPartyName}
                        value={partyName}
                    />
                </View>
                <Text>Choose any game you want to play:</Text>
                <View style={styles.checkboxContainerCreateParty}>
                    <View style={styles.checkboxWrapperCreateParty}>
                        <Checkbox
                            style={styles.checkbox}
                            value={game}
                            onValueChange={setGame}
                            color={game ? '#4630EB' : undefined}
                        />
                        <Text style={styles.checkboxTextCreateParty}>WordToWord</Text>
                    </View>
                </View>

                <View style={styles.btnModalCreateParty}>
                    <Pressable
                        style={[styles.button, styles.buttonCloseCreateParty]}
                        onPress={() => onClose(false)}
                    >
                        <Text style={styles.textStyleCreateParty}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonValidationCreateParty]}
                        onPress={() => onConfirm({ partyName, game })}
                    >
                        <Text style={styles.textStyleCreateParty}>Validate</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </Modal>);
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
        maxHeight: '80%',
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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
    inputSection: {
        height: '60%',
        marginTop: '10%',
        alignItems: 'center',
        width: '100%',
        gap: 10
    },
    centeredViewCreateParty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalViewCreateParty: {
        width: '90%',
        backgroundColor: theme.colors.veryLightBrown,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    inputSectionCreateParty: {
        width: '100%',
        marginVertical: 10,
        alignItems: 'center',
    },
    checkboxContainerCreateParty: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    checkboxWrapperCreateParty: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxTextCreateParty: {
        fontSize: 15,
        marginLeft: 5,
    },
    btnModalCreateParty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    buttonCreateParty: {
        backgroundColor: theme.colors.green,
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCloseCreateParty: {
        backgroundColor: theme.colors.red,
        width: '45%',
        alignItems: 'center',
    },
    buttonValidationCreateParty: {
        backgroundColor: '#899E6A',
        width: '45%',
        alignItems: 'center',
    },
    textStyleCreateParty: {
        color: 'white',
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
    buttonClose: { backgroundColor: theme.colors.red, width: '45%', alignItems: 'center' },
    buttonValidation: { backgroundColor: theme.colors.green, width: '45%', alignItems: 'center' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default CreateRoomModal;

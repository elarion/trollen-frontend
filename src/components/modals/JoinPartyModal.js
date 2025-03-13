import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, Alert } from 'react-native';

import theme from '@theme';

const JoinPartyModal = ({ visible, onClose, onConfirm }) => {
    const [join_id, setJoin_id] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose();
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalViewJoinParty}>
                    <Text style={styles.modalTitle}>Join a party</Text>
                    <View style={styles.inputSection}>
                        <Text>Party name</Text>
                        <TextInput autoCapitalize="none" style={styles.input} placeholder="Room name" onChangeText={value => setJoin_id(value)} value={join_id} />
                        <Text>Password (optional)</Text>
                        <TextInput autoCapitalize="none" style={styles.input} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                    </View>
                    <View style={styles.btnModalJoinRoom}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={onClose}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonValidation]}
                            onPress={() => onConfirm({ join_id, password })}>
                            <Text style={styles.textStyle}>Join</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

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
    modalViewJoinParty: {
        width: '90%',
        margin: 20,
        backgroundColor: theme.colors.veryLightBrown,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
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
    buttonClose: { backgroundColor: theme.colors.red, width: '45%', alignItems: 'center' },
    buttonValidation: { backgroundColor: theme.colors.green, width: '45%', alignItems: 'center' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default JoinPartyModal;
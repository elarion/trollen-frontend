import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const initialRoomForm = {
    roomname: '',
    tag: '',
    password: '',
    isSafe: false,
    isPrivate: false,
    capacityValue: '0',
};
const CreateRoomModal = ({ visible, onClose, onConfirm }) => {
    const [roomForm, setRoomForm] = useState(initialRoomForm);
    const [roomname, setRoomname] = useState('');
    const [tag, setTag] = useState('');
    const [password, setPassword] = useState('');
    const [isSafe, setSafe] = useState(false);
    const [isPrivate, setPrivate] = useState(false);
    const [capacityValue, setCapacityValue] = useState('0');
    const [countIsFocus, setCountIsFocus] = useState(false);

    const dataCapacity = Array.from({ length: 21 }, (_, i) => ({ label: `${i}`, value: `${i}` }));

    const handleConfirm = () => {
        onConfirm({
            roomname,
            tag,
            password,
            isSafe,
            isPrivate,
            capacityValue,
        });
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalView}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>Create a Room</Text>

                        <View style={styles.inputSection}>
                            <Text>Room name</Text>
                            <TextInput style={styles.input} placeholder="Room name" onChangeText={setRoomname} value={roomname} />

                            <Text>Tags</Text>
                            <TextInput style={styles.input} placeholder="Tag1,Tag2,Tag3" onChangeText={setTag} value={tag} />

                            <Text>Password (Optionnel)</Text>
                            <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry={true} />

                            <Text>Capacity</Text>
                            <Dropdown
                                style={[styles.dropdown, countIsFocus && { borderColor: 'blue' }]}
                                iconStyle={styles.iconStyle}
                                data={dataCapacity}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={!countIsFocus ? 'Capacity' : '...'}
                                value={capacityValue}
                                onFocus={() => setCountIsFocus(true)}
                                onBlur={() => setCountIsFocus(false)}
                                onChange={item => {
                                    setCapacityValue(item.value);
                                    setCountIsFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <View style={styles.iconContainer}>
                                        <AntDesign style={styles.icon} color={countIsFocus ? 'blue' : 'black'} name="team" size={25} />
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.sectionBox}>
                            <Checkbox style={styles.checkbox} value={isSafe} onValueChange={setSafe} />
                            <Text style={styles.checkboxText}>Safe Room (no spell)</Text>
                        </View>

                        <View style={styles.sectionBox}>
                            <Checkbox style={styles.checkbox} value={isPrivate} onValueChange={setPrivate} />
                            <Text style={styles.checkboxText}>Private Room</Text>
                        </View>

                        <View style={styles.btnModal}>
                            <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
                                <Text style={styles.textStyle}>Back</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.buttonValidation]} onPress={handleConfirm}>
                                <Text style={styles.textStyle}>Confirm</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        maxHeight: '80%', // Empêche la modal de dépasser l'écran
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

export default CreateRoomModal;

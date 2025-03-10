import { Modal, SlideAnimation } from 'react-native-modals'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const JoinRoomModal = ({ modalJoinRoomVisible, setModalJoinRoomVisible }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalJoinRoomVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalJoinRoomVisible(!modalJoinRoomVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalViewJoinRoom}>
                    <Text style={styles.modalTitle}>Join room</Text>
                    <View style={styles.inputSection}>
                        <Text>Room name</Text>
                        <TextInput style={styles.roomname} placeholder="Room name" onChangeText={value => setRoomname(value)} value={roomname} />
                        <Text>Password (optionnel)</Text>
                        <TextInput style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                    </View>
                    <View style={styles.btnModalJoinRoom}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalJoinRoomVisible(!modalJoinRoomVisible)}>
                            <Text style={styles.textStyle}>Retour</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonValidation]}
                            onPress={() => goToRoom()}>
                            <Text style={styles.textStyle}>Valider</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default JoinRoomModal;
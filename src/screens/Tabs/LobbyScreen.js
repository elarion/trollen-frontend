// Imports Hooks
import React, { useState } from 'react';

// Imports Components
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LobbyModalRoom from '@components/modals/LobbyModalRoom';
import { Portal } from '@components/Portal';
import TopHeader from '@components/TopHeader';

// Imports Store
import { logoutUser } from '@store/authSlice';
import { useDispatch } from 'react-redux';

// Imports Axios
import axiosInstance from '@utils/axiosInstance';

// Imports Theme
import theme from '@theme';

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const [roomname, setRoomname] = useState('');
    const [tag, setTag] = useState('');
    const [capacityValue, setCapacityValue] = useState(null);
    const [isSafe, setSafe] = useState(false);
    const [is_, set] = useState(false);
    const [password, setPassword] = useState('');

    const handleCreateRoom = async (roomData) => {
        console.log(roomData);
        try {
            const response = await axiosInstance.post(`/rooms/create`, {
                room_socket_id: 'a',
                name: roomData.roomname,
                tags: roomData.tag,
                settings: { max: roomData.capacityValue, is_safe: roomData.isSafe, is_: roomData.is_, password: roomData.password }
            });

            const data = response.data;

            if (data) {
                setRoomname('');
                setPassword('');
                setTag('');
                setCapacityValue(null);
                setSafe(false);
                set(false);
                setModalVisible(!modalVisible);
                console.log('VICTORYYYY');
                navigation.navigate('Room', { roomId: data.room._id });
            }
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        }
    };

    const handleJoinRoom = async () => {
        console.log('In handleJoinRoom =>', roomname, password);
        try {
            console.log('hrere');
            const roomToJoin = await axiosInstance.put(`/rooms/join-by-name/${roomname}`, {
                password: password
            });

            console.log('After axiosInstance =>', roomToJoin.data);

            if (!roomToJoin.data.success) return;

            setRoomname('');
            setPassword('');
            setModalJoinRoomVisible(!modalJoinRoomVisible);
            navigation.navigate('Room', { roomId: roomToJoin.data.room._id });
        } catch (error) {
            console.error("Erreur lors de la connexion in handleJoinRoom :", error.request, error.response);
        } finally {
            console.log('In finally =>');
            // setModalJoinRoomVisible(!modalJoinRoomVisible);
        }
    }

    const handleLogout = async () => {
        console.log('In LobbyScreen => logout');
        await dispatch(logoutUser()).unwrap(); // Attendre la fin du logout

        // navigation.reset sert à réinitialiser la pile de navigation pour empêcher le retour en arrière du retour en arrière
        navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }], // Rediriger et empêcher le retour en arrière
        });
    };

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />

                    <View style={styles.portalBox}>

                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                            <Portal portal="portal-4" />
                            <Portal portal="portal-2" />
                            <Portal portal="portal-3" />
                        </View>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalJoinRoomVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Hazard ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Party</Text>
                        </TouchableOpacity>

                        <Text onPress={handleLogout}>logout</Text>

                        <LobbyModalRoom visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={handleCreateRoom} />

                        {/* MODALE JOIN  ROOM */}
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
                                        <TextInput autoCapitalize="none" style={styles.roomname} placeholder="Room name" onChangeText={value => setRoomname(value)} value={roomname} />
                                        <Text>Password (optionnel)</Text>
                                        <TextInput autoCapitalize="none" style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                                    </View>
                                    <View style={styles.btnModalJoinRoom}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalJoinRoomVisible(!modalJoinRoomVisible)}>
                                            <Text style={styles.textStyle}>Retour</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonValidation]}
                                            onPress={() => handleJoinRoom()}>
                                            <Text style={styles.textStyle}>Valider</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1, resizeMode: 'cover',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingVertical: 10,
        // position: 'relative',
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    portalBox: {
        marginTop: 20, alignItems: 'center', height: '50%'
    },
    createRoomBtn: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 10, width: '40%', alignItems: 'center'
    },
    textCreateBtn: { color: 'white' },
    button: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 10, width: '40%', alignItems: 'center', marginBottom: 10,
    },


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalViewCreationRoom: {
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
        height: '70%'
    },
    modalViewJoinRoom: {
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
        height: '40%'
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
});

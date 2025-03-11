import React, { useState, useEffect } from 'react';

// Imports Hooks
import * as SecureStore from 'expo-secure-store';

// Imports Components
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import CreateRoomModal from '@components/modals/CreateRoomModal';
import JoinRoomModal from '@components/modals/JoinRoomModal';
import HazardPartyModal from '@components/modals/HazardPartyModal';
import CreatePartyModal from '@components/modals/CreatePartyModal';
import JoinPartyModal from '@components/modals/JoinPartyModal';
import { Portal } from '@components/Portal';
import TopHeader from '@components/TopHeader';

// Imports Store
import { logout } from '@store/authSlice';
import { useDispatch } from 'react-redux';

// Imports Axios
import axiosInstance from '@utils/axiosInstance';

// Imports Theme
import theme from '@theme';

// Imports Socket
import { connectSocket, getSocket } from "@services/socketService";


export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [modalCreateRoomVisible, setModalCreateRoomVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const [modalHazardPartyVisible, setModalHazardPartyVisible] = useState(false);
    const [modalCreatePartyVisible, setModalCreatePartyVisible] = useState(false);
    const [modalJoinPartyVisible, setModalJoinPartyVisible] = useState(false);

    useEffect(() => {
        (async () => {
            const socket = await connectSocket();
            if (!socket) return;

            return () => {
                console.log("❌ Déconnexion du socket via le LOBBY =>", socket.id);
                socket.disconnect();
            };
        })();
    }, []);

    const handleCreateRoom = async (roomData) => {
        try {
            const response = await axiosInstance.post(`/rooms/create`, {
                room_socket_id: 'a',
                name: roomData.roomname,
                tags: roomData.tag,
                // 
                settings: { max: roomData.capacityValue, is_safe: roomData.isSafe, is_: roomData.is_, password: roomData.password }
            });

            const data = response.data;

            if (data) {
                setModalCreateRoomVisible(!modalCreateRoomVisible);
                navigation.navigate('Room', { roomId: data.room._id });
            }
        } catch (error) {
            console.error("Error with room creation =>", error.response.data.success);
        }
    };

    const handleJoinRoom = async ({ roomname, password }) => {
        try {
            if (roomname === '') return;

            const roomToJoin = await axiosInstance.put(`/rooms/join-by-name/${roomname}`, {
                password: password
            });

            if (!roomToJoin.data.success) return;

            setModalJoinRoomVisible(!modalJoinRoomVisible);
            navigation.navigate('Room', { roomId: roomToJoin.data.room._id });
        } catch (error) {
            if (!error.response.data.success)
                console.log("Error with room creation =>", error.response.data.message);
        } finally {
            console.log('In finally =>');
        }
    }

    const handleCreateParty = async ({ partyName, game = "Motamaux" }) => {
        try {
            if (partyName === '') return;

            const response = await axiosInstance.post(`/parties/create`, {
                name: partyName,
                game: game,
            });

            const data = response.data;

            if (data) {
                setModalCreatePartyVisible(!modalCreatePartyVisible);
                navigation.navigate('Party', { party_id: data.party._id });
            }
        } catch (error) {
            if (!error.response.data.success) {
                console.error("Error with party creation real error:", error.response.data);
            }
            console.error("Error with party creation :", error);
        }
    }

    const handleJoinParty = async () => {
        try {
            const response = await fetch(`${EXPO}/parties`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: user.tokenDecoded.id, join_id: partyName }),
            });

            const data = await response.json();

            if (data) {
                setPartyName('');
                setModalJoinPartyVisible(!modalJoinPartyVisible);
                navigation.navigate('Party', { party_id: data.party._id });
            }

            console.log('Party joined successfully:', data);
        } catch (error) {
            console.error('Error joining party:', error.message);
        }
    }

    const handleHazardParty = async () => {
        console.log('In handleHazardParty =>');
    }

    const handleLogout = async () => {
        try {
            const socket = getSocket();
            if (socket) {
                socket.disconnect(); // 🔥 Déconnecte du serveur WebSocket
            }

            dispatch(logout());

            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');

            // // navigation.reset sert à réinitialiser la pile de navigation pour empêcher le retour en arrière du retour en arrière
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }], // Rediriger et empêcher le retour en arrière
            });
        } catch (error) {
            console.error('Error with logout =>', error);
        }
    };

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={[styles.backgroundImage, { backgroundColor: 'transparent' }]}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />

                    <View style={styles.portalBox}>

                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                            <Portal portal="portal-4" />
                            <Portal portal="portal-2" />
                            <Portal portal="portal-3" />
                        </View>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreateRoomVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalJoinRoomVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreateRoomVisible(true)}>
                            <Text style={styles.textCreateBtn}>Hazard ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalHazardPartyVisible(true)}>
                            <Text style={styles.textCreateBtn}>Hazard Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreatePartyVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalJoinPartyVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Party</Text>
                        </TouchableOpacity>

                        <Text onPress={handleLogout}>logout</Text>

                        {/* MODALE CREATE ROOM */}
                        <CreateRoomModal visible={modalCreateRoomVisible} onClose={() => setModalCreateRoomVisible(false)} onConfirm={handleCreateRoom} />

                        {/* MODALE JOIN  ROOM */}
                        <JoinRoomModal visible={modalJoinRoomVisible} onClose={() => setModalJoinRoomVisible(false)} onConfirm={handleJoinRoom} />

                        {/* MODALE HAZARD PARTY */}
                        <HazardPartyModal visible={modalHazardPartyVisible} onClose={() => setModalHazardPartyVisible(false)} onConfirm={handleHazardParty} />

                        {/* MODALE CREATE PARTY */}
                        <CreatePartyModal visible={modalCreatePartyVisible} onClose={() => setModalCreatePartyVisible(false)} onConfirm={handleCreateParty} />

                        {/* MODALE JOIN PARTY */}
                        <JoinPartyModal visible={modalJoinPartyVisible} onClose={() => setModalJoinPartyVisible(false)} onConfirm={handleJoinParty} />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground >
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
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 100, width: '40%', alignItems: 'center', marginBottom: 10,
    },
});

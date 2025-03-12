import React, { useState, useEffect, useRef } from 'react';

// Imports Hooks
import * as SecureStore from 'expo-secure-store';

// Imports Components
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Gyroscope } from 'expo-sensors';
import CreateRoomModal from '@components/modals/CreateRoomModal';
import JoinRoomModal from '@components/modals/JoinRoomModal';
import HazardPartyModal from '@components/modals/HazardPartyModal';
import CreatePartyModal from '@components/modals/CreatePartyModal';
import JoinPartyModal from '@components/modals/JoinPartyModal';
import { Portal } from '@components/Portal';
import TopHeader from '@components/TopHeader';
const { width, height } = Dimensions.get('window');
import { Image } from 'react-native';
import { avatars } from '@configs/avatars';
// Imports Store
import { logout } from '@store/authSlice';
import { useDispatch } from 'react-redux';

// Imports Axios
import axiosInstance from '@utils/axiosInstance';

import { useSelector } from 'react-redux';

// Imports Theme
import theme from '@theme';

// Imports Socket
import { connectSocket, getSocket } from "@services/socketService";

// Composant Joystick
const CustomJoystick = ({ onMove }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const maxDistance = 40;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let dx = gesture.dx;
                let dy = gesture.dy;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > maxDistance) {
                    dx = (dx / distance) * maxDistance;
                    dy = (dy / distance) * maxDistance;
                }

                setPosition({ x: dx, y: dy });

                onMove({
                    angle: Math.atan2(dy, dx) * (180 / Math.PI),
                    distance: (distance / maxDistance) * 100,
                });
            },
            onPanResponderRelease: () => {
                setPosition({ x: 0, y: 0 });
                onMove({ angle: 0, distance: 0 });
            },
        })
    ).current;

    return (
        <View style={styles.joystickBase}>
            <View {...panResponder.panHandlers} style={[styles.joystickStick, { transform: [{ translateX: position.x }, { translateY: position.y }] }]} />
        </View>
    );
};

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [characterPosition, setCharacterPosition] = useState({ x: width / 2, y: height / 2 });
    const [gyroData, setGyroData] = useState({ x: 0, y: 0 });
    const [joystickData, setJoystickData] = useState({ angle: 0, distance: 0 });
    const animationRef = useRef(null);
    const [modalCreateRoomVisible, setModalCreateRoomVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const [modalHazardPartyVisible, setModalHazardPartyVisible] = useState(false);
    const [modalCreatePartyVisible, setModalCreatePartyVisible] = useState(false);
    const [modalJoinPartyVisible, setModalJoinPartyVisible] = useState(false);
    const user = useSelector(state => state.auth.user);
    const gyroSensitivity = 10;
    const joystickSpeed = 10;
    const [modalCooldown, setModalCooldown] = useState(false);
    const portals = [
        { id: 'portal-1', x: width * 0.2, y: height * 0.3, action: () => setModalCreateRoomVisible(true) },
        { id: 'portal-2', x: width * 0.4, y: height * 0.3, action: () => setModalJoinRoomVisible(true) },
        { id: 'portal-3', x: width * 0.6, y: height * 0.3, action: () => setModalCreatePartyVisible(true) },
        { id: 'portal-4', x: width * 0.8, y: height * 0.3, action: () => setModalJoinPartyVisible(true) },
    ];
    
    const portalSize = 50; 
    const triggerCooldown = () => {
        setModalCooldown(true);
        setTimeout(() => setModalCooldown(false), 2000); 
    };

    useEffect(() => {
        (async () => {
            console.log('user =>', user);
            const socket = await connectSocket();
            if (!socket) return;

            return () => {
                console.log("❌ Déconnexion du socket via le LOBBY =>", socket.id);
                socket.disconnect();
            };
        })();
    }, []);

    useEffect(() => {
        const subscription = Gyroscope.addListener((data) => {
            setGyroData({ x: data.x, y: data.y });
        });
        Gyroscope.setUpdateInterval(70);

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            const gyroX = gyroData.y * gyroSensitivity;
            const gyroY = gyroData.x * gyroSensitivity;

            const joystickX = Math.cos(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;
            const joystickY = Math.sin(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;

            let newX = characterPosition.x + gyroX + joystickX;
            let newY = characterPosition.y + gyroY + joystickY;

            newX = Math.max(25, Math.min(width - 25, newX));
            newY = Math.max(25, Math.min(height - 25, newY));

            setCharacterPosition({ x: newX, y: newY });
            portals.forEach(portal => {
                if (!modalCooldown && 
                    newX >= portal.x - portalSize / 2 &&
                    newX <= portal.x + portalSize / 2 &&
                    newY >= portal.y - portalSize / 2 &&
                    newY <= portal.y + portalSize / 2
                ) {
                    portal.action();
                    setModalCooldown(true); 
            
                    
                    setTimeout(() => setModalCooldown(false), 2000);
                }
            });

            animationRef.current = requestAnimationFrame(updatePosition);
        };

        animationRef.current = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationRef.current);
    }, [gyroData, joystickData]);

    const handleCreateRoom = async (roomData) => {
        try {
            const response = await axiosInstance.post(`/rooms/create`, {
                room_socket_id: 'a',
                name: roomData.roomname,
                tags: roomData.tag,
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
            console.error("Error with party creation real error:", error.response.data);
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
                socket.disconnect();
            }

            dispatch(logout());
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');

            navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
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
                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreateRoomVisible(true)}>
                            <Portal portal="portal-4" />
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalJoinRoomVisible(true)}>
                            <Portal portal="portal-2" />
                            <Text style={styles.textCreateBtn}>Join Room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreateRoomVisible(true)}>
                            <Portal portal="portal-4" />
                            <Text style={styles.textCreateBtn}>Hazard ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalHazardPartyVisible(true)}>
                            <Portal portal="portal-4" />
                            <Text style={styles.textCreateBtn}>Hazard Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalCreatePartyVisible(true)}>
                            <Portal portal="portal-3" />
                            <Text style={styles.textCreateBtn}>Create Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalJoinPartyVisible(true)}>
                            <Portal portal="portal-4" />
                            <Text style={styles.textCreateBtn}>Join Party</Text>
                        </TouchableOpacity>

                        <View style={[styles.character, { left: characterPosition.x - 25, top: characterPosition.y - 25 }]}>
                            <Text style={styles.characterText}>{user.username}</Text>
                            <Image source={avatars[user.selected_character.avatar]} style={styles.characterImage} />
                        </View>

                        <View style={styles.joystickContainer}>
                            <CustomJoystick onMove={setJoystickData} />
                        </View>
                        {portals.map(portal => (
    <View key={portal.id} style={[styles.portal, { left: portal.x, top: portal.y }]} />
))} 
                        <CreateRoomModal visible={modalCreateRoomVisible} onClose={() => setModalCreateRoomVisible(false)} onConfirm={handleCreateRoom}modalCooldown={modalCooldown} 
    triggerCooldown={triggerCooldown}  />
                        <JoinRoomModal visible={modalJoinRoomVisible} onClose={() => setModalJoinRoomVisible(false)} onConfirm={handleJoinRoom} modalCooldown={modalCooldown} 
    triggerCooldown={triggerCooldown} />
                        <HazardPartyModal visible={modalHazardPartyVisible} onClose={() => setModalHazardPartyVisible(false)} onConfirm={handleHazardParty}modalCooldown={modalCooldown} 
    triggerCooldown={triggerCooldown}  />
                        <CreatePartyModal visible={modalCreatePartyVisible} onClose={() => setModalCreatePartyVisible(false)} onConfirm={handleCreateParty}modalCooldown={modalCooldown} 
    triggerCooldown={triggerCooldown}  />
                        <JoinPartyModal visible={modalJoinPartyVisible} onClose={() => setModalJoinPartyVisible(false)} onConfirm={handleJoinParty} modalCooldown={modalCooldown} 
    triggerCooldown={triggerCooldown}  />
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
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingVertical: 10,
    },
    portalBox: {
        marginTop: 60, alignItems: 'center', height: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    createRoomBtn: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 10, width: '30%', alignItems: 'center'
    },
    textCreateBtn: { color: 'white' },
    button: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 100, width: '30%', alignItems: 'center', marginBottom: 10,
    },
  character: {
        position: 'absolute',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, 
    },
    
    characterImage: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
       
    joystickContainer: {
        left: '45%',
        transform: [{ translateX: -50 }],
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        zIndex: 1,
    },
    joystickBase: {
        width: 100,
        height: 100,
        borderRadius: 500,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    joystickStick: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        zIndex: 1,

    },
    debugInfo: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    debugText: {
        color: 'white',
        fontSize: 12,
    },
    characterText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'inter',
        marginTop: 5,
    }
});

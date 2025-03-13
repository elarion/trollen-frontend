import React, { useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, ImageBackground, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Gyroscope } from 'expo-sensors';
import CreateRoomModal from '@components/modals/CreateRoomModal';
import JoinRoomModal from '@components/modals/JoinRoomModal';
import HazardPartyModal from '@components/modals/HazardPartyModal';
import CreatePartyModal from '@components/modals/CreatePartyModal';
import JoinPartyModal from '@components/modals/JoinPartyModal';
import { Portal } from '@components/Portal';
import TopHeader from '@components/TopHeader';
import { avatars } from '@configs/avatars';
import { logout } from '@store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@utils/axiosInstance';
import { connectSocket, getSocket } from "@services/socketService";
import theme from '@theme';
import { Image }  from 'react-native';

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

const { width, height } = Dimensions.get('window');

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [characterPosition, setCharacterPosition] = useState({ x: width / 2, y: height / 1.3 });
    const [gyroData, setGyroData] = useState({ x: 0, y: 0 });
    const [joystickData, setJoystickData] = useState({ angle: 0, distance: 0 });
    const animationRef = useRef(null);
    const [modalCreateRoomVisible, setModalCreateRoomVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const [modalHazardPartyVisible, setModalHazardPartyVisible] = useState(false);
    const [modalCreatePartyVisible, setModalCreatePartyVisible] = useState(false);
    const [modalJoinPartyVisible, setModalJoinPartyVisible] = useState(false);
    const [modalCancelled, setModalCancelled] = useState(false);
    const user = useSelector(state => state.auth.user);
    const gyroSensitivity = 10;
    const joystickSpeed = 10;
    const [portals, setPortals] = useState([]);
    const portalSize = 50;
    const collisionRadius = 30;

    const [activePortal, setActivePortal] = useState(null);
    const portalScales = useRef({
        'portal-create-room': new Animated.Value(1),
        'portal-join-room': new Animated.Value(1),
        'portal-create-party': new Animated.Value(1),
        'portal-join-party': new Animated.Value(1)
    }).current;

    const portalRefs = {
        createRoom: useRef(null),
        joinRoom: useRef(null),
        createParty: useRef(null),
        joinParty: useRef(null),
    };

    const updatePortalPositions = () => {
        const updatedPortals = [];

        const measurePortal = (ref, id, name, action) => {
            if (ref.current) {
                ref.current.measure((x, y, width, height, pageX, pageY) => {
                    updatedPortals.push({
                        id,
                        x: pageX + width / 2,
                        y: pageY + height / 2,
                        name,
                        action,
                    });
                });
            }
        };

        measurePortal(portalRefs.createRoom, 'portal-create-room', "Create Room", () => setModalCreateRoomVisible(true));
        measurePortal(portalRefs.joinRoom, 'portal-join-room', "Join Room", () => setModalJoinRoomVisible(true));
        measurePortal(portalRefs.createParty, 'portal-create-party', "Create Party", () => setModalCreatePartyVisible(true));
        measurePortal(portalRefs.joinParty, 'portal-join-party', "Join Party", () => setModalJoinPartyVisible(true));

        if (updatedPortals.length > 0) {
            setPortals(updatedPortals);
        }
    };

    useEffect(() => {
        const timer = setTimeout(updatePortalPositions, 500);
        const dimensionsHandler = Dimensions.addEventListener('change', updatePortalPositions);

        return () => {
            clearTimeout(timer);
            dimensionsHandler.remove();
        };
    }, []);

    useEffect(() => {
        (async () => {
            const socket = await connectSocket();
            if (!socket) return;

            return () => {
                socket.disconnect();
            };
        })();
    }, [user]);

    useEffect(() => {
        const subscription = Gyroscope.addListener((data) => {
            setGyroData({ x: data.x, y: data.y });
        });
        Gyroscope.setUpdateInterval(70);

        return () => subscription.remove();
    }, []);

    const checkCollision = (characterX, characterY, portalX, portalY, radius) => {
        const distance = Math.sqrt(
            Math.pow(characterX - portalX, 2) +
            Math.pow(characterY - portalY, 2)
        );
        return distance < radius;
    };

    const pulsePortal = (portalId) => {
        if (!portalScales[portalId]) return;

        Animated.loop(
            Animated.sequence([
                Animated.timing(portalScales[portalId], {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(portalScales[portalId], {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

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

            let foundPortal = false;
            let portalToActivate = null;

            portals.forEach(portal => {
                if (checkCollision(newX, newY, portal.x, portal.y, collisionRadius * 1.5)) {
                    foundPortal = true;
                    portalToActivate = portal;

                    if (activePortal?.id !== portal.id) {
                        setActivePortal(portal);
                        pulsePortal(portal.id);
                    }

                    if (!modalCancelled) {
                        portal.action();
                        setModalCancelled(true);
                    }
                }
            });

            if (!foundPortal && activePortal) {
                setActivePortal(null);
                setModalCancelled(false);
            }

            animationRef.current = requestAnimationFrame(updatePosition);
        };

        animationRef.current = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationRef.current);
    }, [gyroData, joystickData, portals, activePortal, modalCancelled]);

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

                    <View style={styles.portalTopBox}>
                        <Animated.View
                            ref={portalRefs.joinParty}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-join-party'] }] }}
                        >
                            <Portal portal="portal-4" />
                            <Text style={styles.textCreateBtn}>Join Party</Text>
                        </Animated.View>
                        <Animated.View
                            ref={portalRefs.createParty}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-create-party'] }] }}
                        >
                            <Portal portal="portal-3" />
                            <Text style={styles.textCreateBtn}>Create Party</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.portalCenterBox}>
                        <Animated.View
                            ref={portalRefs.createRoom}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-create-room'] }] }}
                        >
                            <Image source={require('@assets/portals/portal-5.png')} style={styles.portalCenter} />
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.portalBottomBox}>
                        <Animated.View
                            ref={portalRefs.joinRoom}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-join-room'] }] }}
                        >
                            <Portal portal="portal-1" />
                            <Text style={styles.textCreateBtn}>Join Room</Text>
                        </Animated.View>
                    </View>

                    <View style={[styles.character, { left: characterPosition.x - 20, top: characterPosition.y - 20 }]}>
                        <Text style={styles.characterText}>{user.username}</Text>
                        <Image source={avatars[user.selected_character.avatar]} style={styles.characterImage} />
                    </View>

                    <View style={styles.joystickContainer}>
                        <CustomJoystick onMove={setJoystickData} />
                    </View>

                    <CreateRoomModal visible={modalCreateRoomVisible} onClose={() => setModalCreateRoomVisible(false)} onConfirm={handleCreateRoom} />
                    <JoinRoomModal visible={modalJoinRoomVisible} onClose={() => setModalJoinRoomVisible(false)} onConfirm={handleJoinRoom} />
                    <HazardPartyModal visible={modalHazardPartyVisible} onClose={() => setModalHazardPartyVisible(false)} onConfirm={handleHazardParty} />
                    <CreatePartyModal visible={modalCreatePartyVisible} onClose={() => setModalCreatePartyVisible(false)} onConfirm={handleCreateParty} />
                    <JoinPartyModal visible={modalJoinPartyVisible} onClose={() => setModalJoinPartyVisible(false)} onConfirm={handleJoinParty} />
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        width: '100%',
        paddingVertical: 10,
    },
    portalTopBox: {
        marginTop: 60,
        alignItems: 'center',
        flexDirection: 'row',
    },
    portalCenterBox: {
        top: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    portalCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    portalBottomBox: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
        left: '10%',
    },
    textCreateBtn: {
        color: 'black',
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
    },
    characterText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 2,
        borderRadius: 4,
    },
    joystickContainer: {
        position: 'absolute',
        bottom: 20,
        left: '80%',
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
        borderRadius: 50,
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
    interactButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        zIndex: 2,
    },
    interactButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

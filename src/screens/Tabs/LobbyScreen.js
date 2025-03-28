import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Alert, PanResponder, Animated, Easing } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
import { useFocusEffect } from '@react-navigation/native';

// Imports Axios
import axiosInstance from '@utils/axiosInstance';

// Imports Theme
/* import theme from '@theme';
 */
// Imports Socket
import { connectSocket, getSocket } from "@services/socketService";
import theme from '@theme';
import { Image } from 'react-native';



const CustomJoystick = ({ onMove, disabled }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const maxDistance = 40; // Permet de limiter la distance de déplacement du joystick

    // Réinitialiser la position lorsque le joystick est désactivé
    useEffect(() => {
        if (disabled) {
            setPosition({ x: 0, y: 0 });
            onMove({ angle: 0, distance: 0 });
        }
    }, [disabled, onMove]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled, // Ne pas répondre si désactivé
            onMoveShouldSetPanResponder: () => !disabled, // Ne pas répondre si désactivé
            onPanResponderMove: (_, gesture) => {
                if (disabled) return; // Ne pas traiter si désactivé

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
        <View style={[styles.joystickBase, disabled ? styles.joystickDisabled : null]}>
            <View
                {...panResponder.panHandlers}
                style={[
                    styles.joystickStick,
                    { transform: [{ translateX: position.x }, { translateY: position.y }] },
                    disabled ? styles.joystickStickDisabled : null
                ]}
            />
        </View>
    );
};

const { width, height } = Dimensions.get('window');
const socket = getSocket();

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    // Position relative initiale (en pourcentage de la taille de l'écran)
    const [relativePosition, setRelativePosition] = useState({ x: 0.5, y: 0.7 });
    // Position absolue calculée à partir de la position relative
    const [characterPosition, setCharacterPosition] = useState({
        x: relativePosition.x * width,
        y: relativePosition.y * height
    });
    const [screenDimensions, setScreenDimensions] = useState({ width, height });
    const [joystickData, setJoystickData] = useState({ angle: 0, distance: 0 });
    const animationRef = useRef(null);
    const [modalCreateRoomVisible, setModalCreateRoomVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const [modalHazardPartyVisible, setModalHazardPartyVisible] = useState(false);
    const [modalCreatePartyVisible, setModalCreatePartyVisible] = useState(false);
    const [modalJoinPartyVisible, setModalJoinPartyVisible] = useState(false);
    const [modalCancelled, setModalCancelled] = useState(false);
    const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    const joystickSpeed = 10;
    const [portals, setPortals] = useState([]);
    const portalSize = 50;
    const collisionRadius = 25;
    const [players, setPlayers] = useState({});
    const socket = useRef(null);
    // Référence pour le throttling des émissions socket
    const lastEmitTime = useRef(0);
    const EMIT_INTERVAL = 100; // Émettre au maximum toutes les 100ms

    // Références pour les animations des joueurs
    const playerAnimatedValues = useRef({});

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

    // Fonction pour mettre à jour les positions absolues quand les dimensions changent
    const updateAbsolutePositions = useCallback(() => {
        const { width, height } = screenDimensions;
        setCharacterPosition({
            x: relativePosition.x * width,
            y: relativePosition.y * height
        });

        // Mettre à jour les positions des autres joueurs
        Object.keys(playerAnimatedValues.current).forEach(playerId => {
            if (players[playerId]) {
                Animated.timing(playerAnimatedValues.current[playerId].x, {
                    toValue: players[playerId].x * width,
                    duration: 200,
                    useNativeDriver: true
                }).start();

                Animated.timing(playerAnimatedValues.current[playerId].y, {
                    toValue: players[playerId].y * height,
                    duration: 200,
                    useNativeDriver: true
                }).start();
            }
        });
    }, [relativePosition, screenDimensions, players]);

    // Gérer les changements de dimensions d'écran (rotation, redimensionnement)
    useEffect(() => {
        const handleDimensionsChange = ({ window }) => {
            setScreenDimensions({ width: window.width, height: window.height });
        };

        const dimensionsHandler = Dimensions.addEventListener('change', handleDimensionsChange);

        return () => {
            dimensionsHandler.remove();
        };
    }, []);

    // Mettre à jour les positions absolues quand les dimensions changent
    useEffect(() => {
        updateAbsolutePositions();
    }, [screenDimensions, updateAbsolutePositions]);

    // Réinitialiser l'état du joystick lorsque l'écran reprend le focus
    useFocusEffect(
        useCallback(() => {
            // Réinitialiser les états quand on revient sur l'écran du lobby
            setIsAnyModalOpen(false);
            setModalCancelled(false);
            setJoystickData({ angle: 0, distance: 0 });

            return () => {
                // Cleanup si nécessaire
            };
        }, [])
    );

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
        // measurePortal(portalRefs.createParty, 'portal-create-party', "Create Party", () => setModalCreatePartyVisible(true));
        measurePortal(portalRefs.createParty, 'portal-create-party', "Create Party", () => Alert.alert('Coming soon!', 'be patient...'));
        // measurePortal(portalRefs.joinParty, 'portal-join-party', "Join Party", () => setModalJoinPartyVisible(true));
        measurePortal(portalRefs.joinParty, 'portal-join-party', "Join Party", () => handleJoinRandomRoom());

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

    // useEffect(() => {
    // }, [user]);

    useEffect(() => {
        const startAnimations = () => {
            Object.keys(portalScales).forEach(portalId => {
                const delay = Math.random() * 1000;
                setTimeout(() => {
                    pulsePortal(portalId);
                }, delay);
            });
        };


        startAnimations();

        (async () => {
            socket.current = await connectSocket();

            if (!socket.current) return;

            // Récupérer les joueurs déjà connectés
            socket.current.emit("requestPlayers", { username: user?.username, avatar: user?.selected_character?.avatar });

            // Écouter les mises à jour de positions
            socket.current.on("playersPositions", (usersPositions) => {
                // Pour chaque joueur, créer des valeurs d'animation si elles n'existent pas
                Object.keys(usersPositions).forEach(playerId => {
                    if (!playerAnimatedValues.current[playerId]) {
                        playerAnimatedValues.current[playerId] = {
                            x: new Animated.Value(usersPositions[playerId].x * width),
                            y: new Animated.Value(usersPositions[playerId].y * height)
                        };
                    } else {
                        // Animer vers la nouvelle position
                        Animated.timing(playerAnimatedValues.current[playerId].x, {
                            toValue: usersPositions[playerId].x * width,
                            duration: 200,
                            useNativeDriver: true
                        }).start();

                        Animated.timing(playerAnimatedValues.current[playerId].y, {
                            toValue: usersPositions[playerId].y * height,
                            duration: 200,
                            useNativeDriver: true
                        }).start();
                    }
                });

                setPlayers(usersPositions);
            });

            return () => {
                socket.current.disconnect();
            };
        })();
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
            // Si une modale est ouverte, ne pas mettre à jour la position
            if (isAnyModalOpen) {
                animationRef.current = requestAnimationFrame(updatePosition);
                return;
            }

            // Si la distance du joystick est 0, il n'y a pas de mouvement
            if (joystickData.distance === 0) {
                animationRef.current = requestAnimationFrame(updatePosition);
                return;
            }

            const { width, height } = screenDimensions;
            const joystickX = Math.cos(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;
            const joystickY = Math.sin(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;

            // Les nouvelles positions absolues
            let newX = characterPosition.x + joystickX;
            let newY = characterPosition.y + joystickY;

            // Limites en pourcentage de l'écran (5% des bords)
            const boundaryPercent = 0.05;
            newX = Math.max(width * boundaryPercent, Math.min(width * (1 - boundaryPercent), newX));
            newY = Math.max(height * boundaryPercent, Math.min(height * (1 - boundaryPercent), newY));

            // Vérifier si la position a réellement changé avant d'envoyer
            const positionChanged =
                Math.abs(newX - characterPosition.x) > 0.1 ||
                Math.abs(newY - characterPosition.y) > 0.1;

            if (positionChanged) {
                // Mettre à jour la position absolue
                setCharacterPosition({ x: newX, y: newY });

                // Mettre à jour la position relative
                const newRelativeX = newX / width;
                const newRelativeY = newY / height;
                setRelativePosition({ x: newRelativeX, y: newRelativeY });

                // Throttle des émissions socket
                const now = Date.now();
                if (socket.current && (now - lastEmitTime.current > EMIT_INTERVAL)) {
                    lastEmitTime.current = now;

                    socket.current.emit("updatePosition", {
                        x: newRelativeX,
                        y: newRelativeY,
                        username: user?.username,
                        avatar: user?.selected_character?.avatar
                    });
                }
            }

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
                        console.log('portal.action()', portal.id);
                        // Au lieu d'appeler directement portal.action()
                        // on va arrêter le joystick puis appeler l'action
                        if (portal.id !== 'portal-create-party' && portal.id !== 'portal-join-party') {
                            setIsAnyModalOpen(true);
                        }

                        setJoystickData({ angle: 0, distance: 0 });
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


        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [joystickData, portals, modalCancelled, activePortal, characterPosition, isAnyModalOpen, screenDimensions])

    const handleCreateRoom = async (roomData) => {
        try {
            const response = await axiosInstance.post(`/rooms/create`, {
                room_socket_id: 'a',
                name: roomData.roomname,
                tags: roomData.tag,
                settings: { max: roomData.capacityValue, is_private: roomData.isPrivate, is_safe: roomData.isSafe, is_: roomData.is_, password: roomData.password }
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
                console.log("Error with room joining =>", error.response.data.message);
        } finally {
            console.log('In finally =>');
        }
    }

    const handleJoinRandomRoom = async () => {
        try {
            const roomToJoin = await axiosInstance.get(`/rooms/join-by-random`);
            navigation.navigate('Room', { roomId: roomToJoin.data.room._id });
        } catch (error) {
            if (!error.response.data.success) console.error("Error with room joining =>", error.response.data.message);
        } finally {
            console.log('In finally =>');
        }
    }

    const handleCreateParty = async ({ partyName, game = "WordToWord" }) => {
        try {
            if (partyName === '') return;

            const response = await axiosInstance.post(`/parties/create`, {
                name: partyName,
                game: game,
            });

            const data = response.data;

            if (data) {
                setModalCreatePartyVisible(!modalCreatePartyVisible);
                navigation.navigate('Partyloading', { party_id: data.party._id });
            }
        } catch (error) {
            console.error("Error with party creation real error:", error.response.data);
            console.error("Error with party creation :", error);
        }
    }

    const handleJoinParty = async ({ join_id, password }) => {
        Alert.alert('Coming soon!', 'be patient...');
        return;
        try {
            const response = await axiosInstance.put(`/parties/join-by-id`, { join_id, password });

            const data = response.data;

            if (data) {
                setModalJoinPartyVisible(!modalJoinPartyVisible);
                navigation.navigate('Party', { party_id: data.party._id });
            }
        } catch (error) {
            console.error('Error joining party:', error.message);
        }
    }

    // const handleRandomJoinParty = async () => {
    //     try {
    //         const response = await axiosInstance.put(`/parties/join-by-id`, { games: ['67d149bfe1078aeb70a3d7d8'] });

    //         const data = response.data;

    //         if (data) {
    //             setPartyName('');
    //             setModalJoinPartyVisible(!modalJoinPartyVisible);
    //             navigation.navigate('Party', { party_id: data.party._id });
    //         }

    //         console.log('Party joined successfully:', data);
    //     } catch (error) {
    //         console.error('Error joining party:', error.message);
    //     }
    // }

    const handleHazardParty = async () => {
        console.log('In handleHazardParty =>');
    }

    const handleLogout = async () => {
        try {
            if (socket.current) {
                socket.current.disconnect(); // Déconnecte du serveur WebSocket
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

    // handleLogout();

    // Fonction pour ouvrir une modale et stopper le joystick
    const openModal = (modalSetter, value) => {
        // Réinitialiser le joystick
        setJoystickData({ angle: 0, distance: 0 });
        // Marquer qu'une modale est ouverte
        setIsAnyModalOpen(true);
        // Ouvrir la modale
        modalSetter(value);
    };

    // Fonction pour fermer une modale
    const closeModal = (modalSetter, value) => {
        setIsAnyModalOpen(false);
        modalSetter(value);
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
                            {/* <TouchableOpacity onPress={() => openModal(setModalJoinPartyVisible, true)}> */}
                            <TouchableOpacity onPress={() => handleJoinRandomRoom()}>
                                <Image source={require('@assets/portals/portal-4.png')} style={styles.portalCenter} />
                                {/* <Text style={styles.portalText}>Join Party</Text> */}
                                <Text style={styles.portalText}>Hazard Room</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={[styles.portalMiddleBox, { top: -100, zIndex: 1000 }]}>
                        <Animated.View
                            ref={portalRefs.createParty}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-create-party'] }] }}
                        >

                            <TouchableOpacity onPress={() => Alert.alert('Coming soon!', 'be patient...')}>
                                {/* <TouchableOpacity onPress={() => openModal(setModalCreatePartyVisible, true)}> */}
                                <Image source={require('@assets/portals/portal-3.png')} style={styles.portalCenter} />
                                <Text style={styles.portalText}>Create Party</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={styles.portalCenterBox}>
                        <Animated.View
                            ref={portalRefs.createRoom}
                            onLayout={updatePortalPositions}
                            style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', transform: [{ scale: portalScales['portal-create-room'] }], }}
                        >
                            <TouchableOpacity onPress={() => openModal(setModalCreateRoomVisible, true)}>
                                <Image source={require('@assets/portals/portal-5.png')} style={[styles.portalCenter, {
                                    // width: 220,
                                    // height: 220
                                }]} />
                            </TouchableOpacity>
                            <View style={styles.portalCreateRTextContainer
                            } >
                                <Text style={styles.portalCreateRText} onPress={() => openModal(setModalCreateRoomVisible, true)}>Create Room</Text>
                            </View>

                        </Animated.View>
                    </View>
                    <View style={styles.portalBottomBox}>
                        <Animated.View
                            ref={portalRefs.joinRoom}
                            onLayout={updatePortalPositions}
                            style={{ transform: [{ scale: portalScales['portal-join-room'] }] }}
                        >
                            <TouchableOpacity onPress={() => openModal(setModalJoinRoomVisible, true)}>
                                <Image source={require('@assets/portals/portal-1.png')} style={styles.portalCenter} />
                                <Text style={styles.portalText}>Join Room</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>


                    <View style={[styles.character, { left: characterPosition.x - 20, top: characterPosition.y - 20, zIndex: 1001 }]}>
                        <Text style={styles.characterText}>{user.username}</Text>
                        <Image source={avatars[user?.selected_character?.avatar]} style={styles.characterImage} />
                    </View>

                    {Object.keys(players).map((playerId) => {
                        const player = players[playerId];

                        if (playerId !== user._id) {
                            // Initialiser les valeurs animées si nécessaire
                            if (!playerAnimatedValues.current[playerId]) {
                                const absoluteX = player.x * width;
                                const absoluteY = player.y * height;
                                playerAnimatedValues.current[playerId] = {
                                    x: new Animated.Value(absoluteX),
                                    y: new Animated.Value(absoluteY)
                                };
                            }

                            return (
                                <Animated.View
                                    key={playerId}
                                    style={{
                                        position: "absolute",
                                        zIndex: 1002,
                                        transform: [
                                            { translateX: playerAnimatedValues.current[playerId].x },
                                            { translateY: playerAnimatedValues.current[playerId].y }
                                        ],
                                    }}
                                >
                                    <Text style={styles.characterText}>{player.username}</Text>
                                    <Image source={avatars[player.avatar]} style={{ width: 50, height: 50 }} />
                                </Animated.View>
                            );
                        }
                    })}

                    <View style={styles.joystickContainer}>
                        <CustomJoystick onMove={setJoystickData} disabled={isAnyModalOpen} />
                    </View>

                    <CreateRoomModal
                        visible={modalCreateRoomVisible}
                        onClose={() => closeModal(setModalCreateRoomVisible, false)}
                        onConfirm={handleCreateRoom}
                    />
                    <JoinRoomModal
                        visible={modalJoinRoomVisible}
                        onClose={() => closeModal(setModalJoinRoomVisible, false)}
                        onConfirm={handleJoinRoom}
                    />
                    <HazardPartyModal
                        visible={modalHazardPartyVisible}
                        onClose={() => closeModal(setModalHazardPartyVisible, false)}
                        onConfirm={handleHazardParty}
                    />
                    <CreatePartyModal
                        visible={modalCreatePartyVisible}
                        onClose={() => closeModal(setModalCreatePartyVisible, false)}
                        onConfirm={handleCreateParty}
                    />
                    <JoinPartyModal
                        visible={modalJoinPartyVisible}
                        onClose={() => closeModal(setModalJoinPartyVisible, false)}
                        onConfirm={handleJoinParty}
                    />
                </SafeAreaView>
            </SafeAreaProvider >
        </ImageBackground >
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
        width: '30%',
        top: '4%',
        zIndex: 1000,
        marginTop: '5%',
        left: '65%',
        alignItems: 'center',

    },
    portalMiddleBox: {
        width: '30%',
        bottom: '2',
        left: '10%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    portalCenterBox: {
        position: 'absolute',
        top: 40,
        flex: 1,
        height: '100%',
        width: '100%',
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
        bottom: 60,
        left: '10%',
    },
    textCreateBtn: {
        color: 'white',

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
        zIndex: 1002,
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
        backgroundColor: '#55453F',
        position: 'absolute',
        zIndex: 1,
    },
    portalCreateRTextContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        // position: 'absolute',
        // left: Dimensions.get('window').width / 11,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(248, 238, 238, 0.7)',
    },
    portalCreateRText: {
        // width: '100%',
        fontWeight: 'bold',
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(248, 238, 238, 0.7)',
        borderRadius: 90,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    portalText: {
        color: 'green',
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'rgba(248, 238, 238, 0.8)',
        borderRadius: 4,
    },
    joystickDisabled: {
        opacity: 0.5,
        backgroundColor: 'rgba(200,200,200,0.2)',
    },
    joystickStickDisabled: {
        backgroundColor: '#888',
    },
});

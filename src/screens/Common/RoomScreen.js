// Import Components
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert, KeyboardAvoidingView, TextInput, FlatList } from "react-native"
import { Modal, SlideAnimation, ModalContent } from 'react-native-modals'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// import { uid2 } from 'uid2';

// Import Services
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

import axiosInstance from "@utils/axiosInstance";

// Import Components
import UsersModal from '@components/modals/UsersModal';

// Import Services
import { getSocket } from "@services/socketService";
import theme from '@theme';
import { spells } from '@configs/spells';
import { slugify } from '@utils/slugify';

const randomString = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export default function RoomScreen({ navigation, route }) {
    const [modalUserRoomVisible, setModalUserRoomVisible] = useState(false);
    const [modalSpellVisible, setModalSpellVisible] = useState(false);
    const { roomId } = route.params;
    const { user } = useSelector(state => state.auth);
    const [content, setContent] = useState('');
    const [roomInfo, setRoomInfo] = useState([]);
    const [messages, setMessages] = useState([]);
    const [modalUserListVisible, setModalUserListVisible] = useState(false);
    const [spelled, setSpelled] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState(null);

    const socket = getSocket();

    useFocusEffect(
        useCallback(() => {
            try {
                socket.emit("joinRoom", { roomId, username: user.username }, (response) => {
                    if (!response.success) {
                        console.error("Erreur de connexion à la room :", response.error);
                    }
                });
            } catch (error) {
                console.error("Erreur de connexion à la room :", error);
            }

            (async () => {
                try {
                    // if (messages.length === 0) {
                    const loadedMessages = await axiosInstance.get(`/messages-rooms/get-all-by-room/${roomId}`);
                    setMessages(loadedMessages.data.messages);

                    // } else {
                    //     const lastMessage = messages[0];
                    //     const loadedMessages = await axiosInstance.get(`/messages-rooms/get-by-last-message/${roomId}/${lastMessage._id}`);
                    //     setMessages(prev => [...loadedMessages.data.messages, ...prev]);
                    // }
                } catch (error) {
                    console.error("Erreur lors du chargement des messages :", error);
                }
            })();

            socket.on("roomInfo", (data) => {
                setRoomInfo(data.room);
            });
            socket.on("roomMessage", (response) => {
                setMessages(prev => [response.message, ...prev]);
            });
            socket.on("spelledInRoom", (response) => {
                console.log('spelledInRoom =>', response);
                // setSpelled(true);
            });

            socket.on("userJoined", (response) => {
                setMessages(prev => [{ content: `${response.username} has joined the room!`, has_joined: true, is_info: true, _id: randomString() }, ...prev]);
            });
            socket.on("userLeft", (response) => {
                console.log('userLeft =>', response);
                setMessages(prev => [{ content: `${response.username} has left the room!`, has_left: true, is_info: true, _id: randomString() }, ...prev]);
            });

            // Utile par exemple pour mettre a jour un statut utilisateur genre afk
            // const handleAppStateChange = (nextAppState) => {
            //     console.log('nextAppState =>', nextAppState);
            //     if (nextAppState === "background") {
            //         console.log(`❌ L'utilisateur a mis l'app en arrière-plan, leaveRoom envoyé.`);
            //         socket.emit("leaveRoom", { roomId, username: user.username });
            //     } else if (nextAppState === "active") {
            //         console.log(`✅ L'utilisateur a remis l'app en avant-plan, joinRoom envoyé.`);
            //         socket.emit("joinRoom", { roomId, username: user.username }, (response) => {
            //             if (!response.success) {
            //                 console.error("Erreur de connexion à la room :", response.error);
            //             }
            //         });
            //     }
            // };

            // const subscription = AppState.addEventListener("change", handleAppStateChange);
            const interval = setInterval(() => {
                socket.emit("reconnectToRoom", { roomId, userId: user._id }, (response) => {
                    // console.log(`response ${user.username} =>`, response);
                });
            }, 5000);

            return () => {
                // subscription.remove();

                clearInterval(interval);

                if (socket) {
                    socket.emit("leaveRoom", { roomId, username: user.username }, (response) => {
                        console.log(`User ${user.username} leaved room`);
                    });
                    socket.off("roomInfo");
                    socket.off("roomMessage");
                    socket.off("userJoined");
                    socket.off("userLeft");
                }
            };
        }, [roomId])
    );

    const handleMessage = async () => {
        if (content.trim() === '') {
            Alert.alert('Please enter a message');
        }

        try {
            // await axiosInstance.post(`/messages-rooms/create/${roomId}`, { content, spelled });
            setContent('');
            socket.emit("sendMessage", { roomId, content, username: user?.username, spelled: spelled }, (response) => {
                setSpelled(false);
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }

    const handleSpell = (targetId) => {
        socket.emit("launchSpell", { targetId, roomId, spell: selectedSpell }, (response) => {
            setModalSpellVisible(false);
            setModalUserListVisible(false);
            console.log('I have spell some magic', response, user.username);
        });
    }

    const handleSelectSpell = (spell) => {
        setSelectedSpell(spell);
        setModalUserListVisible(true);
    }

    const renderMessage = ({ item }) => {
        const isMyMessage = !item.is_info && item.user._id === user._id;
        const hasBeenSpelled = !item.is_info && item.spells.length > 0;
        return (
            <>
                {!item.is_info && (<View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage, hasBeenSpelled && { borderWidth: 3, borderColor: theme.colors.red, overflow: 'visible' }]}>
                    <Text style={[styles.messageSender, isMyMessage && { color: theme.colors.darkBrown }]}>{isMyMessage ? "Moi" : item.user.username}</Text>
                    <Text style={[styles.messageText, isMyMessage && { color: theme.colors.darkBrown }]}>{item.content}</Text>
                    {hasBeenSpelled && (
                        <>
                            <View style={[styles.spellContainer, { position: 'absolute', bottom: -12, left: 10, zIndex: 1000 }]}>
                                {item.spells.map((spell, index) => (
                                    <Image key={spell._id} source={spells[slugify(spell.spell.name, true)]} style={[styles.spellImageMessage, { tintColor: theme.colors.red }]} />
                                ))}
                            </View>
                        </>
                    )}
                </View >)}
                {(item.is_info && item.has_joined) && (
                    <Text style={{ color: theme.colors.green, fontSize: 12, textAlign: 'center' }}>{item.content}</Text>
                )}
                {(item.is_info && item.has_left) && (
                    <Text style={{ color: theme.colors.red, fontSize: 12, textAlign: 'center' }}>{item.content}</Text>
                )}
            </>
        );
    };

    return (
        <>
            <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        <KeyboardAvoidingView behavior="padding" style={styles.container}>

                            {/* HEADER */}
                            <View style={styles.underheaderContainer}>
                                <TouchableOpacity style={[styles.roomSettings]} onPress={() => navigation.goBack()}>
                                    <FontAwesome name='chevron-left' size={20} color={theme.colors.darkBrown} />
                                </TouchableOpacity>
                                <View style={styles.roomInfos}>
                                    {/* {roomInfo.admin && <Text style={styles.creatorRoomName}>{roomInfo.admin?.username}</Text>} */}
                                    <Text style={[styles.roomName]}>{roomInfo.name}</Text>
                                    {/* <Text style={styles.numberOfParticipants}>
                                        {roomInfo.participants?.length} participant{roomInfo.participants?.length > 1 && `s`}
                                    </Text> */}
                                </View>

                                <TouchableOpacity style={styles.playerList} onPress={() => setModalUserRoomVisible(true)}>
                                    <FontAwesome name='users' size={20} color={theme.colors.darkBrown} />
                                    {/* Number of participants in the room */}
                                    <View style={{ fontSize: 10, position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.green, height: 20, width: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 10, color: theme.colors.white }}>{roomInfo.participants?.length > 99 ? '99+' : roomInfo.participants?.length}</Text></View>
                                </TouchableOpacity>
                            </View>

                            {/* MESSAGE BOX */}
                            <View style={styles.messageBox}>
                                <FlatList
                                    data={messages}
                                    renderItem={renderMessage}
                                    keyExtractor={(item) => item._id.toString()}
                                    contentContainerStyle={styles.messageList}
                                    inverted
                                // onEndReached={ } // Charge plus de rooms quand on atteint la fin
                                // onEndReachedThreshold={0.5} // Déclenche le chargement quand on est à 50% du bas
                                // ListFooterComponent={loading && <ActivityIndicator size="small" color="white" />} // Affiche un loader en bas de la liste
                                />
                            </View>

                            {/* MESSAGE INPUT */}
                            <View style={styles.underMessageBox}>
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Tape ton message ici !"
                                    placeholderTextColor="gray"
                                    multiline={true}
                                    style={styles.input}
                                />
                                <View style={styles.buttons}>
                                    <TouchableOpacity style={styles.sendButton} onPress={handleMessage}>
                                        <FontAwesome name='send' size={12} color='white' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.spellButton} onPress={() => setModalSpellVisible(true)}>
                                        <FontAwesome name='fire' size={15} color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ImageBackground>

            {/* USERS MODAL */}
            {roomInfo.participants && <UsersModal
                modalUserRoomVisible={modalUserRoomVisible}
                setModalUserRoomVisible={setModalUserRoomVisible}
                participants={roomInfo.participants}
            />}

            {/* MODAL SPELL */}
            <Modal
                height={0.9}
                width={0.9}
                margin={0}
                padding={0}
                style={{ width: '100%' }}
                modalAnimation={new SlideAnimation({
                    intialValue: 0,
                    slideFrom: 'right',
                    useNativeDriver: true,
                })}
                transparent={true}
                visible={modalUserListVisible}
            >
                <ModalContent style={[styles.modalContent, { backgroundColor: theme.colors.lightBrown02, width: '100%' }]}>
                    <Text style={[styles.modalTitle, { marginBottom: 5 }]}>{selectedSpell?.spell.name}</Text>
                    <Text style={{ textAlign: 'center', marginBottom: 10 }}>{selectedSpell?.spell.description}</Text>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Choose a target</Text>
                    <FlatList
                        contentContainerStyle={{ gap: 10, alignItems: 'center', marginBottom: 10, justifyContent: 'center' }}
                        data={roomInfo.participants}
                        numColumns={2}
                        columnWrapperStyle={{ gap: 10 }}
                        renderItem={({ item, index }) => {
                            return item.user._id !== user._id && <Text style={{ width: 120, backgroundColor: theme.colors.lightBrown05, padding: 10, borderRadius: 10 }} onPress={() => handleSpell(item.user._id)}>{item.user.username}</Text>
                        }}
                        keyExtractor={(item) => item._id}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalUserListVisible(false)}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </ModalContent>
            </Modal>

            <Modal
                height={0.3}
                width={0.8}
                visible={modalSpellVisible}
                // isVisible={modalSpellVisible}
                modalAnimation={new SlideAnimation({
                    slideFrom: 'left',
                    useNativeDriver: true,
                })}
                backgroundColor={theme.colors.darkBrown08}
                // swipeDirection="left"
                // onSwipeComplete={() => setModalSpellVisible(false)}
                style={styles.modalSpell}
                onRequestClose={() => setModalSpellVisible(false)}
            >
                <ModalContent style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose a spell</Text>
                    {/* <ModalTitle style={{ backgroundColor: theme.colors.darkBrown }} title={'Choisissez un sort'}></ModalTitle> */}
                    <View style={styles.spellContainer}>
                        {user.selected_character.spells.filter(spells => spells.spell.category === 'active').map((spell, index) => (
                            <TouchableOpacity key={spell._id} onPress={() => handleSelectSpell(spell)} style={styles.spell}><Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={spells[slugify(spell.spell.name, true)]} /></TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalSpellVisible(false)}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </ModalContent>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

    /* HEADER */
    underheaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    roomSettings: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.lightBrown02,
    },
    roomInfos: {
        alignItems: 'center',
    },
    creatorRoomName: {
        color: theme.colors.darkBrown,
    },
    roomName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.darkBrown,
    },
    numberOfParticipants: {
        color: theme.colors.darkBrown,
    },
    playerList: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.lightBrown02,
    },

    /* MESSAGE BOX */
    messageBox: {
        flexDirection: 'row',
        flex: 3,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 10,
        minWidth: '50%',
        maxWidth: "65%",
    },
    myMessage: {
        width: '100%',
        alignSelf: "flex-end",
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.lightBrown02,
    },
    otherMessage: {
        maxWidh: '50%',
        minWidth: '50%',
        alignSelf: "flex-start",
        backgroundColor: theme.colors.darkBrown08,
    },
    messageSender: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 2,
    },
    messageText: {
        fontSize: 14,
        color: "#fff",
    },
    spellImageMessage: {
        width: 20,
        height: 20,
    },

    /* MESSAGE INPUT */
    underMessageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        minHeight: 60,
    },
    input: {
        height: 40,
        flex: 1,
        backgroundColor: theme.colors.lightBrown02,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 14,
        color: theme.colors.darkBrown,
    },
    buttons: {
        flexDirection: 'row',
        gap: 5,
        paddingLeft: 5,
    },
    sendButton: {
        width: 30,
        height: 30,
        backgroundColor: 'rgb(195, 157, 136)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    spellButton: {
        width: 30,
        height: 30,
        backgroundColor: theme.colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    /* MODAL */
    modalSpell: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 30,
    },
    modalContent: {
        height: '100%',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.lightBrown05,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.darkBrown,
        marginBottom: 20,
    },
    spellContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    spell: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.veryLightBrown,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'rgb(246, 89, 89)',
        padding: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
    },

    spellImage: {
        width: 25,
        height: 25,
    },
});
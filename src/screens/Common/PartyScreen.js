import {
    StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity,
    KeyboardAvoidingView, FlatList, Image, Pressable
} from "react-native";
import { Modal, ModalContent, SlideAnimation } from 'react-native-modals';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axiosInstance from '@utils/axiosInstance';
import { Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import UsersModal from '@components/modals/UsersModal'
import { AppState, Alert } from "react-native";

import { getSocket } from "@services/socketService";
import theme from '@theme';
import { spells } from '@configs/spells';
import { slugify } from '@utils/slugify';

const spellImages = [
    require('@assets/spells/spell-1.png'),
    require('@assets/spells/spell-2.png'),
    require('@assets/spells/spell-3.png'),
];

export default function PartyScreen({ navigation, route }) {
    ;
    // const isFocused = useIsFocused();
    const socket = getSocket();

    const [visible, setVisible] = useState(false);
    const [modalUserRoomVisible, setModalUserRoomVisible] = useState(false);
    const [modalSpellVisible, setModalSpellVisible] = useState(false);
    const { party_id } = route.params || {};
    const [partyInfo, setPartyInfo] = useState([])
    console.log('partyInfo :', partyInfo)
    const { user } = useSelector(state => state.auth);
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [modalUserListVisible, setModalUserListVisible] = useState(false);
    const [spelled, setSpelled] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState(null);


    // First word
    const [startingWord, setStartingWord] = useState('');
    // //Last Word submitted
    const [lastWord, setLastWord] = useState('');

    useFocusEffect(
        useCallback(() => {
            try {
                socket.emit("joinParty", { party_id, username: user.username }, (response) => {
                    if (!response.success) {
                        console.error("Erreur de connexion à la party :", response.error);
                    }
                });
            } catch (error) {
                console.error("Erreur de connexion à la party :", error);
            }

            (async () => {
                try {

                    const loadedPartyInfo = await axiosInstance.get(`/parties/${party_id}`);
                    setPartyInfo(loadedPartyInfo.data.party)
                    // if (messages.length === 0) {
                } catch (error) {

                } try { //const loadedMessages = await axiosInstance.get(`/messages-parties/get-all-by-party/${party_id}`);
                    //setMessages(loadedMessages.data.messages);

                    // } else {
                    //     const lastMessage = messages[0];
                    //     const loadedMessages = await axiosInstance.get(`/messages-parties/get-by-last-message/${party_id}/${lastMessage._id}`);
                    //     setMessages(prev => [...loadedMessages.data.messages, ...prev]);
                    // }
                } catch (error) {
                    console.error("Erreur lors du chargement des messages :", error);
                }
            })();

            socket.on("partyInfo", (data) => {
                setPartyInfo(data.party);
            });
            socket.on("partyMessage", (response) => {
                setMessages(prev => [response.message, ...prev]);
            });
            socket.on("spelledInParty", (response) => {
                console.log('spelledInParty =>', response);
                // setSpelled(true);
            });

            // Utile par exemple pour mettre a jour un statut utilisateur genre afk
            // const handleAppStateChange = (nextAppState) => {
            //     console.log('nextAppState =>', nextAppState);
            //     if (nextAppState === "background") {
            //         console.log(`❌ L'utilisateur a mis l'app en arrière-plan, leaveParty envoyé.`);
            //         socket.emit("leaveParty", { party_id, username: user.username });
            //     } else if (nextAppState === "active") {
            //         console.log(`✅ L'utilisateur a remis l'app en avant-plan, joinParty envoyé.`);
            //         socket.emit("joinParty", { party_id, username: user.username }, (response) => {
            //             if (!response.success) {
            //                 console.error("Erreur de connexion à la party :", response.error);
            //             }
            //         });
            //     }
            // };

            // const subscription = AppState.addEventListener("change", handleAppStateChange);
            const interval = setInterval(() => {
                socket.emit("reconnectToParty", { party_id, userId: user._id }, (response) => {
                    // console.log(`response ${user.username} =>`, response);
                });
            }, 5000);

            return () => {
                // subscription.remove();

                clearInterval(interval);

                if (socket) {
                    socket.emit("leaveParty", { party_id, username: user.username }, (response) => {
                        console.log(`User ${user.username} leaved party`);
                    });
                    socket.off("partyInfo");
                    socket.off("partyMessage");
                }
            };
        }, [party_id])
    );

    const letStart = () => {
        if (user._id === partyInfo.admin?._id) {
            return <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewJoinParty}>
                        <Text style={styles.modalTitle}>Choose your words</Text>
                        <View style={styles.inputSection}>
                            <Text>Starting word</Text>
                            <TextInput autoCapitalize="none" style={styles.input} placeholder="Starting word" onChangeText={value => setStartingWord(value)} value={startingWord} />
                            <Text>Mystery word</Text>
                            <TextInput autoCapitalize="none" style={styles.input} placeholder="Ending word" onChangeText={value => setWordToBeFind(value)} value={wordToBeFind} />
                        </View>
                        <View style={styles.btnModalJoinParty}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonValidation]}
                                onPress={() => onConfirm({ startingWord, wordToBeFind })}>
                                <Text style={styles.textStyle}>Start</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        }

    }

    // //Word to be found
    const [wordToBeFind, setWordToBeFind] = useState('')

    const checkWin = () => {
        if (lastWord == wordToBeFind) {
            return true
        }
    };

    const handleMessage = () => {
        if (content.trim() === '') {
            Alert.alert('Please enter a message');
        }

        try {
            setLastWord(content)
            if (checkWin() === true) {
                return <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                >
                    <Text>Yep ! The mystery word was {wordToBeFind}, {user.username} has won !</Text>
                </Modal>
            }
            setContent('');
            socket.emit("sendMessage", { party_id, content, username: user?.username, spelled: spelled }, (response) => {
                setSpelled(false);
            });

        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }

    const handleSpell = (targetId) => {
        socket.emit("launchSpell", { targetId, party_id, spell: selectedSpell }, (response) => {
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
        const isMyMessage = item.user._id === user._id;
        const hasBeenSpelled = item.spells.length > 0;
        return (
            <>
                <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage, hasBeenSpelled && { borderWidth: 3, borderColor: theme.colors.red, overflow: 'visible' }]}>
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
                </View >

            </>
        );
    };

    //Timer
    const [isTimeStarting, setIsTimeStarting] = useState(false)


    const timeStart = () => {
        setIsTimeStarting(true)
    };

    const [turnCount, setTurnCount] = useState(0);

    const maxTurns = partyInfo.game.duration; // Définissez le nombre maximum de tours
    console.log("max turns :", partyInfo.game.duration);
    console.log(maxTurns)
    //const maxTurns = 5;

    const nextTurn = () => {
        if (turnCount < maxTurns) {
            setTurnCount(turnCount + 1);
            setIsTimeStarting(false);
            timeStart();
        } else {
            console.log("Maximum number of turns reached");
        }
    };


    letStart()

    return (
        <>
            <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        <KeyboardAvoidingView behavior="padding" style={styles.container}>

                            {/* HEADER */}
                            <View style={styles.underheaderContainer}>
                                <TouchableOpacity style={styles.partySettings}>
                                    <FontAwesome name='cog' size={20} color={theme.colors.darkBrown} />
                                </TouchableOpacity>
                                <View style={styles.partyInfos}>
                                    {partyInfo.admin && <Text style={styles.creatorPartyName}>{partyInfo.admin.username}</Text>}
                                    <Text style={styles.partyName}>{partyInfo.name}</Text>
                                    <Text style={styles.numberOfParticipants}>
                                        {partyInfo.participants?.length} participant{partyInfo.participants?.length > 1 && `s`}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.playerList}>
                                    <FontAwesome name='users' size={20} color={theme.colors.darkBrown} />
                                </TouchableOpacity>
                            </View>
                            {/* PARTY HEADER */}
                            <View style={styles.partyHeader}>
                                <Text>The last submitted word is : {lastWord} </Text>
                                <Text style={styles.turnText}>That's Bidule's Turn !</Text>
                                <CountdownCircleTimer
                                    isPlaying
                                    duration={7}
                                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[7, 5, 2, 0]}
                                    size={60}
                                    trailStrokeWidth={6}
                                    onComplete={nextTurn()}
                                >
                                    {({ remainingTime }) => <Text>{remainingTime}</Text>}
                                </CountdownCircleTimer>
                            </View>


                            {/* MESSAGE BOX */}
                            <View style={styles.messageBox}>
                                <FlatList
                                    data={messages}
                                    renderItem={renderMessage}
                                    keyExtractor={(item) => item._id.toString()}
                                    contentContainerStyle={styles.messageList}
                                    inverted
                                // onEndReached={ } // Charge plus de parties quand on atteint la fin
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
                                    <TouchableOpacity style={styles.sendButton}>
                                        <FontAwesome name='send' size={12} color='white' onPress={() => handleMessage} />
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
            <UsersModal
                modalUserRoomVisible={modalUserRoomVisible}
                setModalUserRoomVisible={setModalUserRoomVisible}
                participants={partyInfo.participants}
            >
            </UsersModal>
            {/* MODAL SPELL */}
            <Modal
                height={0.50}
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
                    <Text style={styles.modalTitle}>Choose a target</Text>
                    <FlatList
                        contentContainerStyle={{}}
                        data={partyInfo.participants}
                        renderItem={({ item }) => (item.user._id !== user._id && <Text style={{ width: '100%', backgroundColor: theme.colors.lightBrown05, padding: 10, marginBottom: 10, borderRadius: 10 }} onPress={() => handleSpell(item.user._id)}>{item.user.username}</Text>)}
                        keyExtractor={(item) => item._id.toString()}
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
                        <Text style={styles.closeButtonText}>cancel</Text>
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
        backgroundColor: 'red',
    },
    partySettings: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.lightBrown02,
    },
    partyInfos: {
        alignItems: 'center',
    },
    creatorPartyName: {
        color: theme.colors.darkBrown,
    },
    partyName: {
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
    /* PARTY HEADER */
    partyHeader: {
        backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },

    /* MESSAGE BOX */
    messageBox: {
        flex: 3, // Prend 3 fois plus de place que les autres
        width: '100%',
        backgroundColor: 'orange',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* MESSAGE INPUT */
    underMessageBox: {
        flexDirection: 'row',
        alignItems: 'center', // Centre verticalement
        justifyContent: 'space-between',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        minHeight: 60, // Hauteur fixe mais pas trop grande
    },
    input: {
        height: 40, // Hauteur réduite
        flex: 1, // Prend l'espace disponible sans dépasser
        backgroundColor: theme.colors.lightBrown02,
        borderRadius: 20,
        paddingHorizontal: 15, // Ajout de marge interne pour le texte
        fontSize: 14, // Taille du texte réduite si besoin
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
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(180, 157, 136)',
        padding: 20,
        borderRadius: 10,
    },
    spellContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    spell: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgb(246, 89, 89)',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'rgb(246, 89, 89)',
        padding: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
    },
});


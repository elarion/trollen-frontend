// Import Components
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert, KeyboardAvoidingView, TextInput, FlatList } from "react-native"
import { Modal, SlideAnimation, ModalContent, ModalTitle, ModalFooter } from 'react-native-modals'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import TopHeader from "@components/TopHeader";

// Import Services
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { connectSocket } from "@services/socketService";
import { loadUserData } from "@store/authSlice";
import { useDispatch } from "react-redux";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';

// Import Components
import UsersModal from '@components/modals/UsersModal';

// Import Services
import { getSocket } from "@services/socketService";
import theme from '@theme';

export default function RoomScreen({ navigation, route }) {
    // const [socket, setSocket] = useState(null);
    const { roomId } = route.params;
    const { user } = useSelector(state => state.auth);
    const [content, setContent] = useState('');
    const [roomInfo, setRoomInfo] = useState([]);
    const [messages, setMessages] = useState([]);
    const [modalUserListVisible, setModalUserListVisible] = useState(false);
    const [spelled, setSpelled] = useState(false);

    // const isFocused = useIsFocused();
    const socket = getSocket();

    useFocusEffect(
        useCallback(() => {

            // console.log(`✅ Rejoint la room ${roomId}`);
            // socket.emit("joinRoom", { roomId });

            socket.emit("joinRoom", { roomId, username: user.username }, (response) => {
                if (!response.success) {
                    console.error("Erreur de connexion à la room :", response.error);
                }
            });

            // // Charger les messages
            socket.emit("loadMessages", { roomId }, (loadedMessages) => {
                setMessages(loadedMessages);
            });

            socket.on("roomInfo", (data) => {
                // console.log('roomInfo =>', data.room.participants);
                setRoomInfo(data.room);
            });

            // // Écouter les nouveaux messages
            socket.on("roomMessage", (response) => {
                setMessages(prev => [response.message, ...prev]);
            })

            return () => {
                if (socket) {
                    socket.emit("leaveRoom", { roomId, username: user.username }, (response) => {
                        console.log('leaveRoom =>', response);
                    });
                    socket.off("roomInfo");
                    socket.off("roomMessage");
                }
            };
        }, [roomId])
    );

    // if (isFocused && socket) {
    //     socket.emit("joinRoom", { roomId, username: user.username }, (response) => {
    //         if (!response.success) {
    //             console.error("Erreur de connexion à la room :", response.error);
    //         }
    //     });
    // }

    const goToSettings = () => {
        navigation.navigate('Settings');
    }
    const goToNews = () => {
        navigation.navigate('News');

    }
    const goToProfile = () => {
        navigation.navigate('Profile');

    }
    const goToGrimoire = () => {
        navigation.navigate('Grimoire');
    }

    useEffect(() => {
        (async () => {

            const handleAppStateChange = (nextAppState) => {
                if (nextAppState === "background") {
                    console.log(`❌ L'utilisateur a mis l'app en arrière-plan, leaveRoom envoyé.`);
                    socket.emit("leaveRoom", { roomId });
                }
            };

            const subscription = AppState.addEventListener("change", handleAppStateChange);

            return () => {
                subscription.remove();
            };

            // const socket = getSocket();

            // socket.emit("joinRoom", { roomId, username: user.username }, (response) => {
            //     if (!response.success) {
            //         console.error("Erreur de connexion à la room :", response.error);
            //     }
            // });

            // const newSocket = await connectSocket();

            // if (!newSocket) {
            //     console.error("Impossible de se connecter à WebSocket");
            //     return;
            // }

            // setSocket(newSocket);

            // // Écouter les informations de la room
            // socket.on("roomInfo", (data) => {
            //     console.log('roomInfo =>', data.room.participants);
            //     setRoomInfo(data.room);
            // });

            // // // Charger les messages
            // socket.emit("loadMessages", { roomId }, (loadedMessages) => {
            //     setMessages(loadedMessages);
            // });

            // // // Écouter les nouveaux messages
            // socket.on("roomMessage", (response) => {
            //     setMessages(prev => [response.message, ...prev]);
            // })

            // return () => {
            //     console.log('🔄 Déconnexion du socket via la room =>', socket.id);
            //     if (socket) {
            //         socket.emit("leaveRoom", { roomId, username: user.username });
            //         socket.off("roomInfo");
            //         socket.off("roomMessage");
            //     }
            // };
        })()
    }, []);

    const handleMessage = () => {
        if (content.trim() === '') {
            Alert.alert('Please enter a message');
        }

        const socket = getSocket();

        try {
            setContent('');
            socket.emit("sendMessage", { roomId, content, username: user?.username, spelled: spelled }, (response) => {
                setSpelled(false);
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }

    const handleSpell = (targetId) => {
        const socket = getSocket();

        socket.emit("spelled", { targetId, roomId }, (response) => {
            setModalSpellVisible(false);
            setModalUserListVisible(false);
            console.log('spelled and I am =>', response, user.username);
        });
    }
    //modaluser
    const [modalUserRoomVisible, setModalUserRoomVisible] = useState(false);
    //MODALSPELL
    const [modalSpellVisible, setModalSpellVisible] = useState(false);

    const renderMessage = ({ item }) => {
        const isMyMessage = item.user._id === user._id;
        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
                <Text style={[styles.messageSender, isMyMessage && { color: theme.colors.darkBrown }]}>{isMyMessage ? "Moi" : item.user.username}</Text>
                <Text style={[styles.messageText, isMyMessage && { color: theme.colors.darkBrown }]}>{item.content}</Text>
            </View>
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
                                <TouchableOpacity style={styles.roomSettings}>
                                    <FontAwesome name='cog' size={20} color={theme.colors.darkBrown} />
                                </TouchableOpacity>
                                <View style={styles.roomInfos}>
                                    {roomInfo.admin && <Text style={styles.creatorRoomName}>{roomInfo.admin?.username}</Text>}
                                    <Text style={styles.roomName}>{roomInfo.name}</Text>
                                    <Text style={styles.numberOfParticipants}>
                                        {roomInfo.participants?.length} participant{roomInfo.participants?.length > 1 && `s`}
                                    </Text>
                                </View>

                                <TouchableOpacity style={styles.playerList} onPress={() => setModalUserRoomVisible(true)}>
                                    <FontAwesome name='users' size={20} color={theme.colors.darkBrown} />
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
            <UsersModal
                modalUserRoomVisible={modalUserRoomVisible}
                setModalUserRoomVisible={setModalUserRoomVisible}
                participants={roomInfo.participants}
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
                    <Text style={styles.modalTitle}>Choose a target</Text>
                    <FlatList
                        contentContainerStyle={{}}
                        data={roomInfo.participants}
                        renderItem={({ item }) => (item.user._id !== user._id && <Text style={{ width: '100%', backgroundColor: theme.colors.lightBrown05, padding: 10, marginBottom: 10, borderRadius: 10 }} onPress={() => handleSpell(item.user._id)}>{item.user.username}</Text>)}
                        keyExtractor={(item) => item._id.toString()}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalUserListVisible(false)}>
                        <Text style={styles.closeButtonText}>cancel</Text>
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
                        <TouchableOpacity onPress={() => setModalUserListVisible(true)} style={styles.spell}><Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={require('@assets/spells/spell-1.png')} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalUserListVisible(true)} style={styles.spell}><Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={require('@assets/spells/spell-2.png')} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalUserListVisible(true)} style={styles.spell}><Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={require('@assets/spells/spell-3.png')} /></TouchableOpacity>
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
        // backgroundColor: 'red',
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
    messageList: {
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
    },
    messageBox: {
        flexDirection: 'row',
        flex: 3, // Prend 3 fois plus de place que les autres
        width: '100%',
        // backgroundColor: 'orange',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
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

    /* MESSAGE INPUT */
    underMessageBox: {
        flexDirection: 'row',
        alignItems: 'center', // Centre verticalement
        justifyContent: 'space-between',
        padding: 10,
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
    modalSpell: {
        // width: '100%',
        flex: 1,
        // height: '100%',
        // width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 30,
        // backgroundColor: 'transparent',

    },
    modalContent: {
        height: '100%',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.lightBrown05,
        // padding: 20,
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
        // tintColor: 'white',
    },

    // spellModal: {
    //     height: 57,//'30%',//65px
    //     width: 57,//'18%',//65px
    //     backgroundColor: 'rgb(246, 89, 89)',
    //     marginBottom: '8.5%', //30px
    //     borderRadius: 57 / 2,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: '2%'
    // },
});
// const styles = StyleSheet.create({
//     //<FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
//     container: {
//         flex: 1,
//     },
//     backgroundImage: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     title: {
//         color: 'rgb(239, 233, 225)',
//         fontSize: 30,
//         fontWeight: 800,
//     },
//     messageList: {
//         // alignItems: 'flex-end',
//         // justifyContent: 'flex-end',
//         paddingHorizontal: 10,
//         paddingBottom: 10,
//     },
//     messageContainer: {
//         padding: 10,
//         borderRadius: 10,
//         marginVertical: 5,
//         // width: '100%',
//         maxWidth: "100%",
//     },
//     myMessage: {
//         alignSelf: "flex-end",
//         backgroundColor: "rgb(195, 157, 136)",
//     },
//     otherMessage: {
//         alignSelf: "flex-start",
//         backgroundColor: "rgb(180, 157, 136)",
//     },
//     messageSender: {
//         fontSize: 12,
//         fontWeight: "bold",
//         color: "#fff",
//         marginBottom: 2,
//     },
//     messageText: {
//         fontSize: 14,
//         color: "#fff",
//     },

//     //underheader
//     underheaderContainer: {
//         padding: 10,
//         //backgroundColor: "blue",
//         marginTop: 0,
//         //heigth:'100%',
//         flex: 1,
//         width: '100%',

//         alignItems: 'center',
//         //justifyContent: 'center',
//     },
//     upperMessageBox: {
//         //backgroundColor: 'grey',
//         height: '17%',
//         width: '100%',
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         alignItems: 'center'
//     },
//     roomSettings: {
//         //backgroundColor: 'green',
//         height: 45,//'30%',
//         width: '20%',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     roomInfos: {
//         //backgroundColor: 'red',
//         height: '80%',
//         width: '50%',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     creatorRoomName: {
//         color: 'rgb(195, 137, 156)',
//     },
//     roomName: {
//         fontSize: 23,
//         fontWeight: 'bold',
//         color: 'rgb(85,69,63)',
//     },
//     numberOfParticipants: {
//         color: 'rgb(195, 137, 156)',
//     },
//     playerList: {
//         //backgroundColor: 'yellow',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 45,//'30%',
//         width: '20%',
//     },
//     messageBox: {
//         //backgroundColor: 'orange',
//         height: '54%', //358 , //'50%',
//         width: '100%',
//         borderRadius: 10,
//         borderColor: 'maroon',
//         borderWidth: 2,
//         // justifyContent: 'center',
//         // alignItems: 'center',
//     },
//     underMessageBox: {
//         //backgroundColor: 'green', 
//         width: '100%',
//         flexDirection: 'column',
//         //alignItems: 'flex-end',
//         //justifyContent: 'space-around',
//         //marginBottom: 15,
//         marginTop: '2%'
//     },
//     placeholder: {
//         height: 88,
//         //backgroundColor: 'purple',
//         width: '100%',
//         borderRadius: 10,
//         borderColor: 'grey',
//         borderWidth: 2,
//         color: 'black',
//         //opacity:0.1,
//     },
//     placeholderText: {
//         height: '100%',//84px
//         marginBottom: '1%',
//         //backgroundColor: 'yellow'
//         //opacity:0.1,
//     },
//     /*backgroundPlaceholder: {
//         backgroundColor: 'grey',
//         borderRadius: 10,
//         //borderBottom: 2,
//         opacity: 0.1,
//     },*/
//     buttons: {
//         //backgroundColor: 'blue',
//         flexDirection: 'row',
//         width: '100%',
//         justifyContent: 'space-evenly',


//     },
//     placeholderButton: {
//         flexDirection: 'row',
//         borderRadius: 30,
//         width: '75%',
//         height: 57,//'65%',//50px
//         backgroundColor: 'rgb(195, 157, 136)',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         fontweight: 'bold',
//         marginTop: '2%'
//     },
//     placeholderButtonText: {
//         color: 'rgb(239, 233, 225)',
//     },
// spellModal: {
//     height: 57,//'30%',//65px
//     width: 57,//'18%',//65px
//     backgroundColor: 'rgb(246, 89, 89)',
//     marginBottom: '8.5%', //30px
//     borderRadius: 57 / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: '2%'
// },


//     //MODAL
//     //Modal classico
//     /*centeredView: {
//         height: '35%',
//         flexDirection: 'row',
//         justifyContent: 'left',
//         alignItems:'flex-end',
//         borderRadius: 15,
//     },
//     modalView: {
//         margin: 0,
//         //marginTop: '55%',
//         //backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 15,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//         width: '70%',
//         height: '60%'
//     },
//     backgroundImageModal: {
//         //flex: 1,
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//         borderRadius:20,
//     },
//     button: {
//         borderRadius: 20,
//         padding: 10,
//         elevation: 2,
//     },
//     btnModal: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: '30%',
//         width: '100%'
//     },
//     buttonClose: {
//         backgroundColor: 'red',
//         width: '45%',
//         height: 50,//'50%',
//         alignItems: 'center',
//     },
//     openedModal: {

//     },
//     spell: {

//     }
// */

//     //Modal NativeModal
//     modal: {
//         justifyContent: 'flex-end',
//         borderRadius: 20,
//     },
//     /*backgroundImageModal: {
//         //flex: 1,
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//         borderRadius: 20,
//         backgroundColor:'green'
//     },*/
//     buttonContainer: {

//         height: '100%',
//         width: "100%",
//         justifyContent: 'left',
//         flexDirection: 'row',
//         backgroundColor: 'rgb(180, 157, 136)',
//         borderRadius: 7,
//         borderColor: 'rgb(85,69,63)',
//         borderWidth: 5,
//     },
//     btnModal: {
//         //backgroundColor:'yellow',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '30%',
//         borderRadius: 20,
//     },
//     buttonClose: {

//         height: 57,//'30%',//65px
//         width: 57,//'18%',//65px
//         borderRadius: 57 / 2,
//         backgroundColor: 'rgb(246, 89, 89)',
//         //marginBottom: '8.5%', //30px
//         justifyContent: 'center',
//         alignItems: 'center',
//         //marginTop: '2%'
//         borderWidth: 3,
//     },
//     spellContainer: {
//         height: "100%",
//         width: '70%',
//         justifyContent: 'center',
//         //backgroundColor:'orange',
//         borderRadius: 20,
//     },
//     spellContainerThreeMax: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         //backgroundColor:'purple',


//     },
//     spellContainerTwoMax: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         //backgroundColor:'blue',


//     },
//     spell: {
//         alignItems: 'center',
//         height: 57,//'30%',//65px
//         width: 57,//'18%',//65px
//         borderRadius: 57 / 2,
//         backgroundColor: 'rgb(246, 89, 89)',
//         //marginBottom: '8.5%', //30px
//         justifyContent: 'center',
//         alignItems: 'center',
//         //marginTop: '2%'
//         marginInline: '4%',
//         borderWidth: 3,
//     }

// })


// (
//     <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
//         <SafeAreaProvider>
//             <SafeAreaView style={styles.container} edges={['left', 'top']}>
//                 {/* <TopHeader /> */}

//                 <View style={styles.underheaderContainer}>
//                     <View style={styles.upperMessageBox} key={roomInfo._id}>
//                         <TouchableOpacity style={styles.roomSettings}>
//                             <FontAwesome name='cog' size={40} color='rgb(195, 157, 136)'/*'rgb(85,69,63)'*/ />
//                         </TouchableOpacity>
//                         <View style={styles.roomInfos}>
//                             <Text style={styles.creatorRoomName}>créateur: {roomInfo.admin?.username}</Text>
//                             <Text style={styles.creatorRoomName}>moi : {user?.username}</Text>
//                             <Text style={styles.roomName}>{roomInfo.name}</Text>
//                             <Text style={styles.numberOfParticipants}>{roomInfo.participants?.length} participant{roomInfo.participants?.length > 1 && `s`}</Text>
//                         </View>
//                         <UsersModal
//                             modalUserRoomVisible={modalUserRoomVisible}
//                             setModalUserRoomVisible={setModalUserRoomVisible}
//                             participants={roomInfo.participants}
//                         >
//                         </UsersModal>

//                         <TouchableOpacity style={styles.playerList} onPress={() => setModalUserRoomVisible(true)}>
//                             <FontAwesome name='users' size={30} color='rgb(195, 157, 136)'/* 'rgb(85,69,63)'*/ />
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.messageBox}>
//                         <FlatList
//                             data={messages}
//                             renderItem={renderMessage}
//                             keyExtractor={(item) => item._id.toString()}
//                             contentContainerStyle={styles.messageList}
//                             inverted
//                         // onEndReached={ } // Charge plus de rooms quand on atteint la fin
//                         // onEndReachedThreshold={0.5} // Déclenche le chargement quand on est à 50% du bas
//                         // ListFooterComponent={loading && <ActivityIndicator size="small" color="white" />} // Affiche un loader en bas de la liste
//                         />
//                         {/* <Text>Messages are coming</Text> */}
//                     </View>

//                     <View style={styles.underMessageBox}>
//                         <View style={styles.placeholder}>
//                             <View style={styles.backgroundPlaceholder}>
//                                 <TextInput
//                                     placeholder="Tape ton message ici !"
//                                     placeholderTextColor="gray"
//                                     value={content}
//                                     onChangeText={value => setContent(value)}
//                                     style={styles.placeholderText}>
//                                 </TextInput>
//                             </View>
//                         </View>
//                     </View>
//                     <View style={styles.buttons}>
//                         <TouchableOpacity style={styles.placeholderButton} onPress={handleMessage}>
//                             <Text style={styles.placeholderButtonText}>Envoyer message</Text>
//                             <FontAwesome name='send-o' size={15} color='rgb(239, 233, 225)' marginHorizontal={'13%'} />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.spellModal} onPress={() => setModalSpellVisible(true)} >
//                             <FontAwesome name='fire' size={30} color='rgb(239, 233, 225)' />
//                         </TouchableOpacity>
//                     </View>
//                     <Modal
//                         height={0.2}
//                         width={1}
//                         margin={0}
//                         padding={0}

//                         modalAnimation={new SlideAnimation({
//                             intialValue: 0,
//                             slideFrom: 'left',
//                             useNativeDriver: true,
//                         })}
//                         transparent={true}
//                         visible={modalUserListVisible}

//                     >
//                         <View>
//                             <Text>User List</Text>
//                             <FlatList
//                                 data={roomInfo.participants}
//                                 renderItem={({ item }) => <Text onPress={() => handleSpell(item.user._id)}>{item.user.username}</Text>}
//                                 keyExtractor={(item) => item._id.toString()}
//                             />
//                         </View>
//                     </Modal>
//                     <Modal
//                         height={0.2}
//                         width={1}
//                         margin={0}
//                         padding={0}
//                         style={styles.modal}

//                         modalAnimation={new SlideAnimation({
//                             intialValue: 0,
//                             slideFrom: 'left',
//                             useNativeDriver: true,
//                         })}
//                         //animationType="slide"
//                         transparent={true}
//                         visible={modalSpellVisible}
//                         //onToucheOutside={() => setModalSpellVisible(visible=false)}
//                         onRequestClose={() => {
//                             setModalSpellVisible(visible = false);
//                         }}>
//                         <View style={styles.buttonContainer}>
//                             {/*<ImageBackground
//                                         source={require('../../assets/background/background.png')}
//                                         style={styles.backgroundImageModal}>*/}
//                             <View style={styles.spellContainer}>
//                                 <View style={styles.spellContainerThreeMax}>
//                                     <TouchableOpacity style={styles.spell} onPress={() => setModalUserListVisible(true)}><FontAwesome name='firefox' size={30} color='rgb(239, 233, 225)' /></TouchableOpacity>
//                                     <TouchableOpacity style={styles.spell} ></TouchableOpacity>
//                                     <TouchableOpacity style={styles.spell} ></TouchableOpacity>
//                                 </View>
//                                 <View style={styles.spellContainerTwoMax}>
//                                     <TouchableOpacity style={styles.spell} ></TouchableOpacity>
//                                     <TouchableOpacity style={styles.spell} ></TouchableOpacity>
//                                 </View>
//                             </View>
//                             <View style={styles.btnModal}>
//                                 <TouchableOpacity
//                                     style={[styles.button, styles.buttonClose]}
//                                     onPress={() => setModalSpellVisible(!modalSpellVisible)}>
//                                     <Text style={styles.textStyle}>Retour</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/*</ImageBackground>*/}
//                         </View>
//                     </Modal>
//                     {/*MODAL SPELL <Pressable style={styles.spellModal} onPress={setModalSpellVisible(!modalSpellVisible)} >
//                         </Pressable>*/ }

//                 </View>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     </ImageBackground>
// )
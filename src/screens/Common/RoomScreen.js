import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList } from "react-native"
import { Modal, SlideAnimation } from 'react-native-modals'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { connectSocket } from "@services/socketService";


export default function RoomScreen({ navigation, route }) {
    const [socket, setSocket] = useState(null);
    const { roomId } = route.params;
    const user = useSelector(state => state.auth);
    const [content, setContent] = useState([]);
    const [roomInfo, setRoomInfo] = useState([]);
    const [messages, setMessages] = useState([]);

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
            const newSocket = await connectSocket();

            if (!newSocket) {
                console.error("Impossible de se connecter à WebSocket");
                return;
            }

            setSocket(newSocket);

            // Écouter les informations de la room
            newSocket.on("roomInfo", (data) => {
                setRoomInfo(data.room);
            });

            // Charger les messages
            newSocket.emit("loadMessages", { roomId }, (loadedMessages) => {
                setMessages(loadedMessages);
            });

            // Écouter les nouveaux messages
            newSocket.on("roomMessage", (response) => {
                setMessages(prev => [response.message, ...prev]);
            })

            // Rejoindre la room
            newSocket.emit("joinRoom", { roomId, username: user.user.username }, (response) => {
                if (!response.success) {
                    console.error("Erreur de connexion à la room :", response.error);
                }
            });

            return () => {
                if (socket) {
                    socket.emit("leaveRoom", { roomId, username: user.user.username });
                    socket.off("roomInfo");
                    socket.off("roomMessage");
                }
            };
        })()
    }, []);

    const handleMessage = () => {
        try {
            setContent('');
            socket.emit("sendMessage", { roomId, content, username: user.user.username }, (response) => {
                console.log(response)
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }

    //MODALSPELL
    const [modalSpellVisible, setModalSpellVisible] = useState(false);

    const renderMessage = ({ item }) => {
        const isMyMessage = item.user._id === user.user._id;
        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
                <Text style={styles.messageSender}>{isMyMessage ? "Moi" : item.user.username}</Text>
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
                    <Header
                        containerStyle={styles.header}
                        leftComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToSettings}>
                                    <FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToNews}>
                                    <FontAwesome name='newspaper-o' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
                        centerComponent={
                            <View>
                                <Text style={styles.title}>Trollen</Text>
                            </View>
                        }
                        rightComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToProfile}>
                                    <FontAwesome name='user' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToGrimoire}>
                                    <FontAwesome name='book' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
                    />
                    <View style={styles.underheaderContainer}>
                        <View style={styles.upperMessageBox} key={roomInfo._id}>
                            <TouchableOpacity style={styles.roomSettings}>
                                <FontAwesome name='cog' size={40} color='rgb(195, 157, 136)'/*'rgb(85,69,63)'*/ />
                            </TouchableOpacity>
                            <View style={styles.roomInfos}>
                                <Text style={styles.creatorRoomName}>{roomInfo.admin?.username}</Text>
                                <Text style={styles.roomName}>{roomInfo.name}</Text>
                                <Text style={styles.roomName}>{user.user.username}</Text>
                                <Text style={styles.numberOfParticipants}>{roomInfo.participants?.length} participant{roomInfo.participants?.length > 1 && `s`}</Text>
                            </View>
                            <TouchableOpacity style={styles.playerList}>
                                <FontAwesome name='users' size={30} color='rgb(195, 157, 136)'/* 'rgb(85,69,63)'*/ />
                            </TouchableOpacity>
                        </View>

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
                            {/* <Text>Messages are coming</Text> */}
                        </View>

                        <View style={styles.underMessageBox}>
                            <View style={styles.placeholder}>
                                <View style={styles.backgroundPlaceholder}>
                                    <TextInput
                                        placeholder="Tape ton message ici !"
                                        placeholderTextColor="gray"
                                        value={content}
                                        onChangeText={value => setContent(value)}
                                        style={styles.placeholderText}>
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.placeholderButton} onPress={handleMessage}>
                                <Text style={styles.placeholderButtonText}>Envoyer message</Text>
                                <FontAwesome name='send-o' size={15} color='rgb(239, 233, 225)' marginHorizontal={'13%'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.spellModal} onPress={() => setModalSpellVisible(true)} >
                                <FontAwesome name='fire' size={30} color='rgb(239, 233, 225)' />
                            </TouchableOpacity>
                        </View>
                        <Modal
                            height={0.2}
                            width={1}
                            margin={0}
                            padding={0}
                            style={styles.modal}

                            modalAnimation={new SlideAnimation({
                                intialValue: 0,
                                slideFrom: 'left',
                                useNativeDriver: true,
                            })}
                            //animationType="slide"
                            transparent={true}
                            visible={modalSpellVisible}
                            //onToucheOutside={() => setModalSpellVisible(visible=false)}
                            onRequestClose={() => {
                                setModalSpellVisible(visible = false);
                            }}>
                            <View style={styles.buttonContainer}>
                                {/*<ImageBackground
                                            source={require('../../assets/background/background.png')}
                                            style={styles.backgroundImageModal}>*/}
                                <View style={styles.spellContainer}>
                                    <View style={styles.spellContainerThreeMax}>
                                        <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                        <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                        <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                    </View>
                                    <View style={styles.spellContainerTwoMax}>
                                        <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                        <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.btnModal}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalSpellVisible(!modalSpellVisible)}>
                                        <Text style={styles.textStyle}>Retour</Text>
                                    </TouchableOpacity>
                                </View>

                                {/*</ImageBackground>*/}
                            </View>
                        </Modal>
                        {/*MODAL SPELL <Pressable style={styles.spellModal} onPress={setModalSpellVisible(!modalSpellVisible)} >
                            </Pressable>*/ }

                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    //<FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'rgb(74, 52, 57)',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        color: 'rgb(239, 233, 225)',
        fontSize: 30,
        fontWeight: 800,
    },
    messageList: {
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        // width: '100%',
        maxWidth: "100%",
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "rgb(195, 157, 136)",
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "rgb(180, 157, 136)",
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

    //underheader
    underheaderContainer: {
        padding: 10,
        //backgroundColor: "blue",
        marginTop: 0,
        //heigth:'100%',
        flex: 1,
        width: '100%',

        alignItems: 'center',
        //justifyContent: 'center',
    },
    upperMessageBox: {
        //backgroundColor: 'grey',
        height: '17%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    roomSettings: {
        //backgroundColor: 'green',
        height: 45,//'30%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomInfos: {
        //backgroundColor: 'red',
        height: '80%',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorRoomName: {
        color: 'rgb(195, 137, 156)',
    },
    roomName: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'rgb(85,69,63)',
    },
    numberOfParticipants: {
        color: 'rgb(195, 137, 156)',
    },
    playerList: {
        //backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,//'30%',
        width: '20%',
    },
    messageBox: {
        //backgroundColor: 'orange',
        height: '54%', //358 , //'50%',
        width: '100%',
        borderRadius: 10,
        borderColor: 'maroon',
        borderWidth: 2,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    underMessageBox: {
        //backgroundColor: 'green', 
        width: '100%',
        flexDirection: 'column',
        //alignItems: 'flex-end',
        //justifyContent: 'space-around',
        //marginBottom: 15,
        marginTop: '2%'
    },
    placeholder: {
        height: 88,
        //backgroundColor: 'purple',
        width: '100%',
        borderRadius: 10,
        borderColor: 'grey',
        borderWidth: 2,
        color: 'black',
        //opacity:0.1,
    },
    placeholderText: {
        height: '100%',//84px
        marginBottom: '1%',
        //backgroundColor: 'yellow'
        //opacity:0.1,
    },
    /*backgroundPlaceholder: {
        backgroundColor: 'grey',
        borderRadius: 10,
        //borderBottom: 2,
        opacity: 0.1,
    },*/
    buttons: {
        //backgroundColor: 'blue',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',


    },
    placeholderButton: {
        flexDirection: 'row',
        borderRadius: 30,
        width: '75%',
        height: 57,//'65%',//50px
        backgroundColor: 'rgb(195, 157, 136)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontweight: 'bold',
        marginTop: '2%'
    },
    placeholderButtonText: {
        color: 'rgb(239, 233, 225)',
    },
    spellModal: {
        height: 57,//'30%',//65px
        width: 57,//'18%',//65px
        backgroundColor: 'rgb(246, 89, 89)',
        marginBottom: '8.5%', //30px
        borderRadius: 57 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%'
    },


    //MODAL
    //Modal classico
    /*centeredView: {
        height: '35%',
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems:'flex-end',
        borderRadius: 15,
    },
    modalView: {
        margin: 0,
        //marginTop: '55%',
        //backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '70%',
        height: '60%'
    },
    backgroundImageModal: {
        //flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius:20,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '30%',
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'red',
        width: '45%',
        height: 50,//'50%',
        alignItems: 'center',
    },
    openedModal: {

    },
    spell: {

    }
*/

    //Modal NativeModal
    modal: {
        justifyContent: 'flex-end',
        borderRadius: 20,
    },
    /*backgroundImageModal: {
        //flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20,
        backgroundColor:'green'
    },*/
    buttonContainer: {

        height: '100%',
        width: "100%",
        justifyContent: 'left',
        flexDirection: 'row',
        backgroundColor: 'rgb(180, 157, 136)',
        borderRadius: 7,
        borderColor: 'rgb(85,69,63)',
        borderWidth: 5,
    },
    btnModal: {
        //backgroundColor:'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
        borderRadius: 20,
    },
    buttonClose: {

        height: 57,//'30%',//65px
        width: 57,//'18%',//65px
        borderRadius: 57 / 2,
        backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'
        borderWidth: 3,
    },
    spellContainer: {
        height: "100%",
        width: '70%',
        justifyContent: 'center',
        //backgroundColor:'orange',
        borderRadius: 20,
    },
    spellContainerThreeMax: {
        flexDirection: 'row',
        justifyContent: 'center',
        //backgroundColor:'purple',


    },
    spellContainerTwoMax: {
        flexDirection: 'row',
        justifyContent: 'center',
        //backgroundColor:'blue',


    },
    spell: {
        alignItems: 'center',
        height: 57,//'30%',//65px
        width: 57,//'18%',//65px
        borderRadius: 57 / 2,
        backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'
        marginInline: '4%',
        borderWidth: 3,
    }

}) 
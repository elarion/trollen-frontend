import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput, Pressable } from "react-native"
import { Modal, ModalContent } from 'react-native-modals'
import axiosInstance from '../utils/axiosInstance';
//import { Modal } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import { useSelector } from "react-native"




export default function RoomScreen({ navigation, route }) {
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

    const { room_id } = route.params;
    const [roomInfo, setRoomInfo] = useState([]);
    console.log(room_id);
    console.log(roomInfo)

    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/rooms/by-id/${room_id}`)
            setRoomInfo(response.data.room)

        })()

    }, [])

    //MODALSPELL
    const [modalSpellVisible, setModalSpellVisible] = useState(false);


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
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
                                <Text style={styles.numberOfParticipants}>{roomInfo.participants?.length} participant{roomInfo.participants?.length > 1 && `s`}</Text>
                            </View>
                            <TouchableOpacity style={styles.playerList}>
                                <FontAwesome name='users' size={30} color='rgb(195, 157, 136)'/* 'rgb(85,69,63)'*/ />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.messageBox}>
                            <Text>Messages are coming</Text>
                        </View>

                        <View style={styles.underMessageBox}>
                            <View style={styles.placeholder}>
                                <View style={styles.backgroundPlaceholder}>
                                    <TextInput
                                        placeholder="Tape ton message ici !"
                                        placeholderTextColor="gray"
                                        style={styles.placeholderText}>
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.placeholderButton}>
                                <Text style={styles.placeholderButtonText}>Envoyer message</Text>
                                <FontAwesome name='send-o' size={15} color='rgb(239, 233, 225)' marginHorizontal={'13%'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.spellModal} onPress={() => setModalSpellVisible(true)} >
                                <FontAwesome name='fire' size={30} color='rgb(239, 233, 225)' />
                            </TouchableOpacity>
                        </View>
                        <Modal
                            animationIn="slideInRight"
                            animationOut="slideOutLeft"
                            //animationType="slide"
                            transparent={true}
                            visible={modalSpellVisible}
                            onToucheOutside={() => setModalSpellVisible(!modalSpellVisible)}
                            onRequestClose={() => {
                                //Alert.alert('Modal has been closed.');
                                setModalSpellVisible(!modalSpellVisible);
                            }}>
                            <ModalContent>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <ImageBackground
                                            source={require('../../assets/background/background.png')}
                                            style={styles.backgroundImageModal}>
                                            <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                            <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                            <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                            <TouchableOpacity style={styles.spell} ></TouchableOpacity>
                                            <View style={styles.btnModal}>
                                                <Pressable
                                                    style={[styles.button, styles.buttonClose]}
                                                    onPress={() => setModalSpellVisible(!modalSpellVisible)}>
                                                    <Text style={styles.textStyle}>Retour</Text>
                                                </Pressable>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </View>
                            </ModalContent>
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


    //underheader
    underheaderContainer: {
        //backgroundColor: "blue",
        marginTop: 0,
        //heigth:'100%',
        flex: 1,
        width: '96%',

        alignItems: 'center',
        //justifyContent: 'center',
        margin: '2%',
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
        justifyContent: 'center',
        alignItems: 'center',
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
    centeredView: {
        height: '35%',
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'flex-end',
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
        borderRadius: 20,
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

}) 
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput, Pressable } from "react-native"
import { Modal, SlideAnimation } from 'react-native-modals'
import axiosInstance from '../utils/axiosInstance';
//import { Modal } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import CustomHeader from "../components/CustomHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import { useSelector } from "react-native"

export default function RoomScreen({ navigation, route }) {

    const { room_id } = route.params;
    const [roomInfo, setRoomInfo] = useState([]);
    /* console.log(room_id);
    console.log(roomInfo) */

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
                    <CustomHeader navigation={navigation} />
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
                                        placeholder="Tape ton message ici !" //onChangeText={value => setMot(value)} value={mot}
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
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
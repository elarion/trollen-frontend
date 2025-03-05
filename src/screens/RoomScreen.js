import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, ImageBackground, TextInput, Pressable } from "react-native"
//import {Modal} from 'react-native-modal'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState } from "react";
import { useSelector } from "react-native"
export default function RoomScreen({ navigation }) {
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
    /*const goToRoom = () => {
        navigation.navigate('Room');
    }*/


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
                        <View style={styles.upperMessageBox}>
                            <TouchableOpacity style={styles.roomSettings}>
                                <FontAwesome name='cog' size={40} color= 'rgb(195, 157, 136)'/*'rgb(85,69,63)'*/ />
                           </TouchableOpacity> 
                           <View style={styles.roomInfos}>
                                <Text style={styles.creatorRoomName}>zozo@2432</Text>
                                <Text style={styles.roomName}>Bond, Troll Bond</Text>
                                <Text style={styles.numberOfParticipants}>101 Participants</Text>
                            </View>
                            <TouchableOpacity style={styles.playerList}>
                                <FontAwesome name='users' size={30} color= 'rgb(195, 157, 136)'/* 'rgb(85,69,63)'*//>
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
                                <TouchableOpacity style={styles.placeholderButton}>
                                    <Text >Envoyer message</Text>
                                </TouchableOpacity>
                            </View>
                            <Pressable style={styles.spellModal} onPress={() => setModalSpellVisible(true)} >
                            </Pressable>

                            {/*MODAL SPELL <Pressable style={styles.spellModal} onPress={setModalSpellVisible(!modalSpellVisible)} >
                            </Pressable>*/ }
                            <Modal 
                               /* animationIn="slideInRight"
                                animationOut="slideOutLeft"*/
                                animationType="slide"
                                transparent={true}
                                visible={modalSpellVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalSpellVisible(!modalSpellVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <TouchableOpacity style={styles.spell} ><Text>taha</Text></TouchableOpacity>
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
                                    </View>
                                    
                                </View>


                            </Modal>


                        </View>

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
        flex: 1,
        width: '96%',
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2%',
    },
    upperMessageBox: {
        //backgroundColor: 'grey',
        height: '20%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    roomSettings: {
        //backgroundColor: 'green',
        height: '30%',
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
        justifyContent:'center',
        alignItems: 'center',
        height: '30%',
        width: '20%',
    },
    messageBox: {
        //backgroundColor: 'orange',
        height: '50%',
        width: '100%',
        borderRadius: 10,
        borderColor: 'maroon',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    underMessageBox: {
        //backgroundColor: 'green',
        height: '28%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    placeholder: {
        height: 80,
        //backgroundColor: 'purple',
        marginBottom: 85,
        width: '70%',
        borderRadius: 10,
        borderColor: 'grey',
        borderWidth: 2,
        //backgroundColor:'grey',
        color: 'black',
        //opacity:0.1,
    },
    placeholderText: {
        height: 84,

        //opacity:0.1,
    },
    /*backgroundPlaceholder:{
         backgroundColor: 'grey',
         borderRadius: 10 ,
         borderBottom: 2,
         opacity: 0.1,   
     },*/
    placeholderButton: {
        borderRadius: 30,
        width: '100%',
        height: 50,
        backgroundColor: 'rgb(195, 157, 136)',
        justifyContent: 'center',
        alignItems: 'center',
        fontweight: 'bold',
    },
    spellModal: {
        height: 66,
        width: 66,
        backgroundColor: 'rgb(246, 89, 89)',
        marginBottom: 30,
        borderRadius: 20,
    },


    //MODAL

    centeredView: {
        height: '120%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        height: '60%'
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
        alignItems: 'center',
    },
    openedModal: {

    },
    spell: {

    }

})
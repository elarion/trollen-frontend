import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Modal, Pressable, TextInput, } from "react-native"
import Checkbox from 'expo-checkbox';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeader from "../components/CustomHeader";
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from "../utils/axiosInstance";

export default function LobbyScreen({ navigation }) {
    //Party
    const [partyName, setPartyName] = useState("");
    const [partyNameCreate, setPartyNameCreate] = useState("")
    const [modalJoinPartyVisible, setModalJoinPartyVisible] = useState(false);
    const [modalHazardPartyVisible, setModalHazardPartyVisible] = useState(false);
    const [modalCreatePartyVisible, setModalCreatePartyVisible] = useState(false);
    const [selectedCheckBoxGame, setSelectedCheckBoxGame] = useState(null);
    const handleCheckBoxChangeCreateParty = (gameName) => {
        setSelectedCheckBoxGame(prev => (prev === gameName ? null : gameName));
    };
    
    //MODAL CREATION DE ROOM INPUT DATA
    const [modalRoomCreationVisible, setModalRoomCreationVisible] = useState(false);
    const [modalJoinRoomVisible, setModalJoinRoomVisible] = useState(false);
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // const [roomList, setRoomList] = useState([]);
    const [roomname, setRoomname] = useState('');
    const [tag, setTag] = useState('');

    const [password, setPassword] = useState('');
    const [isSafe, setSafe] = useState(false);
    const [is, set] = useState(false);

    const [capacityValue, setCapacityValue] = useState('0');
    const [countIsFocus, setCountIsFocus] = useState(false);
    const dataCapacity = [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
        { label: '13', value: '13' },
        { label: '14', value: '14' },
        { label: '15', value: '15' },
        { label: '16', value: '16' },
        { label: '17', value: '17' },
        { label: '18', value: '18' },
        { label: '19', value: '19' },
        { label: '20', value: '20' },
    ];
    //console.log('user', user.tokenDecoded.id, 'room_socket_id', 'bojafo', 'name', roomname, 'tags', tag, 'settings', { max: capacityValue, is_safe: isSafe, is_: is, password: password });

    const goToCreateRoom = async () => {
        try {
            const response = await axiosInstance.post(`/rooms/create`, {
                user: user.tokenDecoded.id,
                room_socket_id: 'a',
                name: roomname,
                tags: tag,
                settings: { max: capacityValue, is_safe: isSafe, is_: is, password: password }
            });

            const data = response.data;

            if (data) {
                setRoomname('');
                setPassword('');
                setTag('');
                setCapacityValue(null);
                setSafe(false);
                set(false);
                setModalRoomCreationVisible(!modalRoomCreationVisible);
                navigation.navigate('Room', { roomId: data.room._id });
            }
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        }
    }

    // useEffect(() => {
    //     const getRoomList = async () => {
    //         try {
    //             const response = await axiosInstance.get(`/rooms`)

    //             const data = await response.data;

    //             if (data) {
    //                 setRoomList(data.rooms)
    //             }
    //         } catch (error) {
    //             console.error("Erreur lors du get :", error);
    //         }
    //     };
    //     getRoomList();
    // }, []);

    const goToRoom = async () => {

        try {
            const roomToJoin = await axiosInstance.put(`/rooms/join-by-name/${roomname}`, {
                password: password
            });

            if (!roomToJoin.data.success) return;

            setRoomname('');
            setPassword('');
            setModalJoinRoomVisible(!modalJoinRoomVisible);
            navigation.navigate('Room', { roomId: roomToJoin.data.room._id });
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    }
    const goToHazardRoom = () => {
        console.log('Go to Hazard Room');
    }
  
    const goToParty = async () => {
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
    };
    const goToHazardParty = () => {
        console.log('Go to Hazard Room');
    }
    const goToCreateParty = async () => {
        try {
            const response = await fetch(`${EXPO}/parties`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user.tokenDecoded.id, party_socket_id: '49994'/* A MODIFIER */, name: partyNameCreate, game:selectedCheckBoxGame })
            });

            const data = await response.json();
            console.log(data)
            if (data) {
                setPartyNameCreate('');
                setSelectedCheckBoxGame(false);
                setModalCreatePartyVisible(!modalCreatePartyVisible);
                navigation.navigate('Party', { party_id: data.party._id });
            }
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        }
        console.log("Selected game:", selectedCheckBoxGame);
    }


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>

                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>

                    {/* HEADER CONFIGURATION */}
                    <CustomHeader navigation={navigation} />

                    {/* PORTAL BOX CONTENT*/}
                    <View style={styles.portalBox}>
                        {/* MODALE CREATION DE ROOM */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalRoomCreationVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalRoomCreationVisible(!modalRoomCreationVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewCreationRoom}>
                                    <Text style={styles.modalTitle}>Create a room</Text>
                                    <View style={styles.inputSection}>
                                        <Text>Room name</Text>
                                        <TextInput style={styles.roomname} placeholder="Room name" onChangeText={value => setRoomname(value)} value={roomname} />
                                        <Text>Tags</Text>
                                        <TextInput style={styles.tag} placeholder="Tag1, Tag2, Tag3" onChangeText={value => setTag(value)} value={tag} />
                                        <Text>Password (Optionnel)</Text>
                                        <TextInput style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                                        <Text>Capacity</Text>
                                        <Dropdown
                                            style={[styles.capacityDropdown, countIsFocus && { borderColor: 'blue' }]}
                                            iconStyle={styles.iconStyle}
                                            data={dataCapacity}
                                            maxHeight={200}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!countIsFocus ? 'Capacity' : '...'}
                                            value={capacityValue}
                                            onFocus={() => setCountIsFocus(true)}
                                            onBlur={() => setCountIsFocus(false)}
                                            onChange={item => {
                                                setCapacityValue(item.value);
                                                setCountIsFocus(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <View style={styles.iconContainer}>
                                                    <AntDesign
                                                        style={styles.icon}
                                                        color={countIsFocus ? 'blue' : 'black'}
                                                        name="team"
                                                        size={25}
                                                    />
                                                </View>
                                            )}
                                        />
                                    </View>
                                    <View style={styles.sectionBox}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={isSafe}
                                            onValueChange={setSafe}
                                            color={isSafe ? '#4630EB' : undefined}
                                        />
                                        <Text style={styles.checkboxText}>Safe Room (no spell)</Text>
                                    </View>
                                    <View style={styles.sectionBox}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={is}
                                            onValueChange={set}
                                            color={is ? '#4630EB' : undefined}
                                        />
                                        <Text style={styles.checkboxText}> Room</Text>
                                    </View>
                                    <View style={styles.btnModal}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalRoomCreationVisible(!modalRoomCreationVisible)}>
                                            <Text style={styles.textStyle}>Retour</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonValidation]}
                                            onPress={() => goToCreateRoom()}>
                                            <Text style={styles.textStyle}>Valider</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Pressable
                            style={[styles.createRoomBtn, styles.buttonOpen]}
                            onPress={() => setModalRoomCreationVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </Pressable>

                        {/* MODALE JOIN  ROOM */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalJoinRoomVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalJoinRoomVisible(!modalJoinRoomVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewJoinRoom}>
                                    <Text style={styles.modalTitle}>Join room</Text>
                                    <View style={styles.inputSection}>
                                        <Text>Room name</Text>
                                        <TextInput style={styles.roomname} placeholder="Room name" onChangeText={value => setRoomname(value)} value={roomname} />
                                        <Text>Password (optionnel)</Text>
                                        <TextInput style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                                    </View>
                                    <View style={styles.btnModalJoinRoom}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalJoinRoomVisible(!modalJoinRoomVisible)}>
                                            <Text style={styles.textStyle}>Retour</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonValidation]}
                                            onPress={() => goToRoom()}>
                                            <Text style={styles.textStyle}>Valider</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Pressable
                            style={[styles.joinRoomBtn, styles.buttonOpen]}
                            onPress={() => setModalJoinRoomVisible(true)}>
                            <Text style={styles.textJoinRoomBtn}>JOIN ROOM</Text>
                        </Pressable>
                        {/* REJOINDRE HAZARD ROOM */}
                        <TouchableOpacity style={styles.joinHazardRoomBtn} onPress={() => goToHazardRoom()}>
                            <Text style={styles.textJoinHazardRoomBtn}>HAZARD ROOM</Text>
                        </TouchableOpacity>
                         {/* MODALE JOIN  PARTY */}
                         <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalJoinPartyVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalJoinPartyVisible(!modalJoinPartyVisible);
                            }}>
                            <View style={styles.centeredViewCreateParty}>
                                <View style={styles.modalViewCreateParty}>
                                    <Text style={styles.modalTitle}>Join party</Text>
                                    <View style={styles.inputSectionCreateParty}>
                                        <Text>Code d'accès :</Text>
                                        <TextInput style={styles.roomname} placeholder="Hulu#09876" onChangeText={value => setPartyName(value)} value={partyName} />
                                    </View>
                                    <View style={styles.btnModalJoinRoom}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalJoinPartyVisible(!modalJoinPartyVisible)}>
                                            <Text style={styles.textStyle}>Retour</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonValidation]}
                                            onPress={() => goToParty()}>
                                            <Text style={styles.textStyle}>Valider</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {/* REJOINDRE PARTY */}
                        <Pressable
                            style={[styles.joinRoomBtn, styles.buttonOpen]}
                            onPress={() => setModalJoinPartyVisible(true)}>
                            <Text style={styles.textJoinRoomBtn}>JOIN PARTY</Text>
                        </Pressable>
                          {/* MODALE HAZARD PARTY */}
                          <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalHazardPartyVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalHazardPartyVisible(!modalHazardPartyVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewHazardParty}>
                                    <Text style={styles.modalTitle}>Matchmaking</Text>
                                    <View style={styles.inputSectionHazardParty}>
                                        <Text>Choose game(s)</Text>
                                        <View style={styles.sectionBoxHazardParty}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={isSafe}
                                            onValueChange={setSafe}
                                            color={isSafe ? '#4630EB' : undefined}
                                        />
                                        <Text style={styles.checkboxTextHazardParty}>Dragon</Text>
                                    </View>
                                    <View style={styles.sectionBoxHazardParty}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={isSafe}
                                            onValueChange={setSafe}
                                            color={isSafe ? '#4630EB' : undefined}
                                        />
                                        <Text style={styles.checkboxTextHazardParty}>Dragon</Text>
                                    </View>
                                    </View>
                                    <View style={styles.btnModalJoinRoom}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalHazardPartyVisible(!modalHazardPartyVisible)}>
                                            <Text style={styles.textStyle}>Retour</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonValidation]}
                                            onPress={() => goToHazardParty()}>
                                            <Text style={styles.textStyle}>Rejoindre</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                          {/* REJOINDRE HAZARD PARTY */}
                          <TouchableOpacity style={styles.joinHazardRoomBtn} 
                          onPress={() => setModalHazardPartyVisible(true)}>
                            <Text style={styles.textJoinHazardRoomBtn}>HAZARD PARTY</Text>
                        </TouchableOpacity>
                             {/* MODALE CREATION DE PARTY */}
                            <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalCreatePartyVisible}
                            onRequestClose={() => setModalCreatePartyVisible(false)}
                            >
                            <View style={styles.centeredViewCreateParty}>
                                <View style={styles.modalViewCreateParty}>
                                <Text style={styles.modalTitle}>CREATE A PARTY</Text>

                               
                                <View style={styles.inputSectionCreateParty}>
                                    
                                    <TextInput
                                    style={styles.roomname}
                                    placeholder="Room name"
                                    onChangeText={setPartyNameCreate}
                                    value={partyNameCreate}
                                    />
                                </View>
                                <Text>Game:</Text>
                                <View style={styles.checkboxContainerCreateParty}>
                                    <View style={styles.checkboxWrapperCreateParty}>
                                    <Checkbox
                                         style={styles.checkbox}
                                         value={selectedCheckBoxGame === 'Motamaux'}
                                         onValueChange={() => handleCheckBoxChangeCreateParty('Motamaux')}
                                         color={selectedCheckBoxGame ? '#4630EB' : undefined}
                                    />
                                    <Text style={styles.checkboxTextCreateParty}>Motamaux</Text>
                                    </View>
                                    <View style={styles.checkboxWrapperCreateParty}>
                                    <Checkbox
                                         style={styles.checkbox}
                                         value={selectedCheckBoxGame === 'FTK'}
                                         onValueChange={() => handleCheckBoxChangeCreateParty('FTK')}
                                         color={selectedCheckBoxGame ? '#4630EB' : undefined}
                                    />
                                    <Text style={styles.checkboxTextCreateParty}>Ftk</Text>
                                    </View>
                                </View>

                                <View style={styles.btnModalCreateParty}>
                                    <Pressable
                                    style={[styles.button, styles.buttonCloseCreateParty]}
                                    onPress={() => setModalCreatePartyVisible(false)}
                                    >
                                    <Text style={styles.textStyleCreateParty}>Retour</Text>
                                    </Pressable>
                                    <Pressable
                                    style={[styles.button, styles.buttonValidationCreateParty]}
                                    onPress={goToCreateParty}
                                    >
                                    <Text style={styles.textStyleCreateParty}>Valider</Text>
                                    </Pressable>
                                </View>
                                </View>
                            </View>
                            </Modal>

                        {/* CREATE PARTY */}
                        <TouchableOpacity style={styles.joinHazardRoomBtn} 
                          onPress={() => setModalCreatePartyVisible(true)}>
                            <Text style={styles.textJoinHazardRoomBtn}>CREATE PARTY</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    //PORTAL BOX
    portalBox: {
        marginTop: '20%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '50%',
    },

    //BUTTON CREATE ROOM
    createRoomBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCreateBtn: {
        color: 'white',
    },

    //BUTTON JOIN  ROOM
    joinRoomBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textJoinRoomBtn: {
        color: 'white',
    },

    //BUTTON JOIN HAZARD ROOM
    joinHazardRoomBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textJoinHazardRoomBtn: {
        color: 'white',
    },

    //MODALE
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalViewCreationRoom: {
        margin: 20,
        backgroundColor: '#F0E9E0',
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
        height: '70%'
    },
    modalViewJoinRoom: {
        margin: 20,
        backgroundColor: '#F0E9E0',
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
        height: '40%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '20%',
        width: '100%'
    },
    btnModalJoinRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10%',
        width: '100%'
    },
    buttonClose: {
        backgroundColor: '#F65959',
        width: '45%',
        alignItems: 'center',
    },
    buttonValidation: {
        backgroundColor: '#899E6A',
        width: '45%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 800,
    },
    inputSection: {
        height: '60%',
        marginTop: '10%',
        alignItems: 'center',
        width: '100%',
        gap: 10
    },


    //INPUT STYLE CREATION ROOM MODAL
    roomname: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#F65959',
        borderRadius: 20,
        paddingLeft: 15,
    },
    tag: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#899E6A',
        borderRadius: 20,
        paddingLeft: 15,
    },
    password: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingLeft: 15,
    },
    //DROPDOWN
    capacityDropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 15,
        width: '80%',
    },
    icon: {
        marginRight: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    //CHECKBOX
    sectionBox: {
        gap: 10,
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'space-between',
        width: '100%',
        marginTop: '1%',
        marginLeft: '30%',
    },
    checkboxText: {
        fontSize: 15,
        marginLeft: 10,
    },

    hazardRoomBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textHazardRoomBtn: {
        color: 'white',
    },


    // Section hazard party

    modalViewHazardParty: {
        margin: 20,
        backgroundColor: '#F0E9E0',
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
        height: '40%'
    },

    sectionBoxHazardParty: {
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        marginTop: '1%',
        paddingVertical: 10, 
    },
    
    inputSectionHazardParty: {
        height: '60%',
        marginTop: '5%',
        justifyContent: 'flex-start',
        alignItems: 'center', 
        width: '100%',
        gap: 10,
    },
    checkboxTextHazardParty: {
        fontSize: 15,
        marginLeft: 10,
    },
// Section create Party

    
})
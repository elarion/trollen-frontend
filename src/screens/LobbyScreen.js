import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Modal, Pressable, TextInput, } from "react-native"
import Checkbox from 'expo-checkbox';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Header } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from "../utils/axiosInstance";

export default function LobbyScreen({ navigation }) {
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

    //REDIRECTION
    const handleLogout = async () => {
        await dispatch(logoutUser()).unwrap(); // Attendre la fin du logout

        // navigation.reset sert à réinitialiser la pile de navigation pour empêcher le retour en arrière du retour en arrière
        navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }], // Rediriger et empêcher le retour en arrière
        });
    };
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
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>

                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>

                    {/* HEADER CONFIGURATION */}
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
                        <Text onPress={handleLogout}>logout</Text>
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
    //HEADER
    header: {
        backgroundColor: 'rgb(74, 52, 57)',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
    },
    title: {
        color: 'rgb(239, 233, 225)',
        fontSize: 30,
        fontWeight: 800,
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
    },
    modalViewCreationRoom: {
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
        height: '70%'
    },
    modalViewJoinRoom: {
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
        backgroundColor: 'red',
        width: '45%',
        alignItems: 'center',
    },
    buttonValidation: {
        backgroundColor: 'green',
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
        borderColor: 'red',
        borderRadius: 20,
        paddingLeft: 15,
    },
    tag: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'green',
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
})
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axiosInstance from '../utils/axiosInstance';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import { useSelector } from "react-native"
export default function PortalScreen({ navigation }) {

    const EXPO = process.env.EXPO_PUBLIC_BACKEND_URL
    const [roomListFromData, setRoomListFromData] = useState([]);
    //console.log(roomListFromData);
    const [roomListFromTag, setRoomListFromTag] = useState([]);
    const [tag, setTag] = useState('');

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
    const goToRoom = (room_id) => {
        navigation.navigate('Room', {
            room_id: room_id,
        });
    }




    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/rooms`)
            setRoomListFromData(response.data.rooms)

        })()

    }, [])
    const roomListToShow = roomListFromData.map((data) => {
        //console.log(data._id)
        return (
            <View style={styles.room} key={data._id}>
                <View style={styles.inRoomLeft}>
                    <Text style={styles.roomName}>{data.name}</Text>
                    <Text style={styles.roomTag}>{data.tags?.map((data, i) => {
                        if (i === data.tags?.length - 1) {
                            return `#${data.name}`
                        } else {
                            return `#${data.name}` + ' '
                        }
                    })}</Text>
                    <Text style={styles.roomNumberOfParticipants}>{data.participants.length}</Text>
                </View>
                <View style={styles.inRoomRight}>
                    <View style={styles.leftFavButtonContainer}></View>
                    <View style={styles.rightUsernameAndJoin}>
                        <Text style={styles.username}>{data.admin.username}</Text>
                        <TouchableOpacity style={styles.join} onPress={() => goToRoom(data._id)}>
                            <Text style={styles.textButton}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    });


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
                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder="Enter a tag here..."
                            placeholderTextColor="gray"
                            style={styles.place}
                            onChangeText={value => setTag(value)} value={tag}>
                        </TextInput>
                        <TouchableOpacity style={styles.bouton} onPress={() => filteredRoomList()}>
                            <Text>Troll</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.roomBox}>
                        {roomListToShow}
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
    placeholder: {
        flexDirection: "row",
        height: 65,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    bouton: {
        borderRadius: 30,
        width: '20%',
        height: '60%',
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        fontweight: 'bold',
    },
    roomBox: {
        flex: 1,
        //backgroundColor: 'blue',
        justifyContent: 'top',
        alignItems: 'center',
        gap: '2%'
    },

    //STYLE DES CARTES ROOMS
    room: {
        flexDirection: 'row',
        justifyContent: "space-between",

        width: '90%',
        height: 120,
        borderRadius: 10,
        backgroundColor: "white"
    },
    inRoomLeft: {
        flexDirection: 'column',
        justifyContent: "space-around",
        marginLeft: '2%',
        //backgroundColor: 'blue',
        width: '50%',
    },
    roomName: {

    },
    roomTag: {

    },
    roomNumberOfParticipants: {

    },
    inRoomRight: {
        flexDirection: 'row',
        //backgroundColor: 'orange',
        width: '46%',
        height: '100%',
        marginRight: '2%',
    },
    leftFavButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
        width: '20%',
    },
    rightUsernameAndJoin: {
        flexDirection: 'column',
        //backgroundColor: 'green',
        width: '80%',
        alignItems: 'center',
    },
    username: {
        //backgroundColor:'orange',
        margin: 10,
    },
    join: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'brown',
        height: '30%',
        width: '70%',
        borderRadius: 30,
    },
    textButton: {
        color: 'white'

    }

})
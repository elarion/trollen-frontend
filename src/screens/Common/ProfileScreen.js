import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect, useReducer } from "react";
import { useSelector, useDispatch } from 'react-redux';
import TopHeader from "@components/TopHeader";
import { Avatar } from '@components/Avatar';
import axiosInstance from '@utils/axiosInstance';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import { logout } from "@store/authSlice";
import * as SecureStore from 'expo-secure-store';
import { setUser } from "../../store/authSlice";

export default function ProfileScreen({ navigation }) {
    const { user } = useSelector((state) => state.auth)
    const [username, setUsername] = useState(user.username);
    console.log('user', user)

    const initialState = {
        username: '',
    };

    const dispatch = useDispatch()

    const [characterData, setCharacterData] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/characters/${user._id}`)
            setCharacterData(response.data.character)
        })();
    }, [user])

    //Logout
    const handleLogout = async () => {
        try {
            dispatch(logout());

            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');

            // // navigation.reset sert à réinitialiser la pile de navigation pour empêcher le retour en arrière du retour en arrière
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }], // Rediriger et empêcher le retour en arrière
            });
        } catch (error) {
            console.error('Error with logout =>', error);
        }
    };

    //Modifier le username
    const updateUsername = async () => {
        try {
            // dispatch(setUpdatingUsername(updatingUsername))

            const response = await axiosInstance.put(`/users/modify-profile`, { username })

            const { user } = response.data;
            dispatch(setUser({ user }))

        } catch (error) {

            console.error('Error with the update of your username =>', error)
        }
    }

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['left', 'top']}>
                    <TopHeader />
                    <View style={styles.title}>
                        <View style={styles.titleLeft}></View>
                        <Text style={styles.subTitle}>PROFILE</Text>
                        <View style={styles.titleRight}>
                            <TouchableOpacity style={styles.logOutButton} onPress={() => handleLogout()}>
                                <FontAwesome name='sign-out-alt' size={25} color='rgb(188, 118, 26)' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.profileBox}>
                        <View style={styles.top}>
                            <View style={styles.topLeft}>
                                <Avatar avatar={characterData?.race?.avatar ?? 'defaultAvatar'} />
                            </View>
                            <View style={styles.topRight}>
                                <View style={styles.usernameButton}>
                                    <TouchableOpacity style={styles.renameButton} onPress={() => updateUsername()}>
                                        {/*<Text style={styles.renameTextButton}>Rename</Text>*/}
                                        <FontAwesome name='feather-alt' style={{ transform: [{ rotateY: '180deg' }] }} size={18} color='rgb(85,69,63)' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.username}>
                                    <TextInput
                                        style={styles.subtitle}
                                        value={username}
                                        onChangeText={setUsername}
                                    >
                                    </TextInput>
                                    <Text style={styles.subtitle}>{characterData.race?.name}</Text>
                                    <Text style={styles.subtitle} >LEVEL:</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.middle1}>
                            <Text style={styles.subtitle}>Classe description :</Text>
                            <Text>{characterData.race?.description}</Text>
                            <Text>{characterData.race?.tagline}</Text>
                        </View>
                        <View style={styles.middle2}>
                            <Text style={styles.subtitle}>Actif spells :</Text>
                            <Text>{characterData.race?.description}</Text>
                        </View>
                        <View style={styles.bot}>
                            <Text style={styles.subtitle}>Unlocked Spell:</Text>

                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',

    },
    //PROFILE TEXT STYLE
    title: {
        flexDirection: 'row',
        //backgroundColor: 'red',
        //width: '30%',
        marginTop:'5%',
        alignItems: 'center',
    },
    titleLeft: {
        width: '30%',
    },
    subTitle: {
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        textAlign: 'center',
        //marginTop: '5%',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRight: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        //height: '100%'
        //backgroundColor: 'pink',
    },
    logOutButton: {
        height: 30,//'30%',//65px
        width: 30,//'18%',//65px
        borderRadius: 30 / 2,
        //backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'

    },
    profileBox: {
        //marginTop: '5%',
        height: '82%',
        width: '95%',
        /* alignItems: 'center',
        justifyContent: 'center', */
        borderRadius: 45,
        padding: 12,
        gap: 10,
        //backgroundColor: 'rgb(188, 118, 26)'
    },
    top: {
        height: '25%',
        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: 5,
    },
    topLeft: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        // backgroundColor: 'rgb(239, 233, 225)'
    },
    topRight: {
        width: '58%',
        flexDirection: 'row',
        justifyContent: 'right',
        alignItems: 'center',
        marginLeft: "10%",
        gap: 10,
        borderRadius: 25,
        //backgroundColor: 'red',//'rgb(239, 233, 225)'
    },
    username: {
        //backgroundColor: 'pink',
        gap: 10,
    },
    usernameButton: {
        //backgroundColor: 'green',
        width: 25,
        height: '72%',
        justifyContent: 'top',
    },
    renameButton: {
        height: 37,//'30%',//65px
        width: 37,//'18%',//65px
        borderRadius: 20,
        //backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'
    },
    /*renameTextButton: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        //marginTop: '2%'
    },*/
    middle1: {
        height: '20%',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        //backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    middle2: {
        height: '23%',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        //backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    bot: {
        height: '27%',
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        borderRadius: 25,
        //backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    subtitle: {
        fontWeight: 800,
    }
})
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import TopHeader from "@components/TopHeader";
import { Avatar } from '@components/Avatar';
import axiosInstance from '@utils/axiosInstance';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { logout } from "@store/authSlice";

export default function ProfileScreen({ navigation }) {
    const user = useSelector((state) => state.auth)
    const user_id = user.user._id
    const dispatch = useDispatch()

    const [characterData, setCharacterData] = useState([]);
    console.log(characterData)
    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/characters/${user_id}`)
            setCharacterData(response.data.character)
        })()
    }, [])

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

    const updateUsername = async () => {
        try {
            const response = await axiosInstance.put(`/users` )
        } catch (error) {

            console.error('Error with the update of your username =>', error)
        }
    }

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['left', 'top']}>
                    <TopHeader />
                    <Text style={styles.subTitle}>PROFILE</Text>
                    <View style={styles.profileBox}>
                        <View style={styles.top}>
                            <View style={styles.topLeft}>
                            <Avatar avatar={characterData?.race?.avatar ?? 'defaultAvatar'} />
                            </View>
                            <View style={styles.topRight}>
                                <Text>{characterData.user?.username}</Text>
                                <Text>{characterData.race?.name}</Text>
                                <Text>LEVEL:</Text>
                            </View>
                        </View>
                        <View style={styles.middle1}>
                            <Text>Classe description :</Text>
                            <Text>{characterData.race?.description}</Text>
                            <Text>{characterData.race?.tagline}</Text>
                        </View>
                        <View style={styles.middle2}>
                            <Text>Actif spells :</Text>
                            <Text>{characterData.race?.description}</Text>
                        </View>
                        <View style={styles.bot}>
                            <Text>Unlocked Spell:</Text>
                            <TouchableOpacity style={styles.logOutButton} onPress={() => handleLogout()}>
                                <FontAwesome name='cog' size={40} color='rgb(195, 157, 136)'/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.renameButton} onPress={() => updateUsername()}>
                                <Text style={styles.renameTextButton}>Rename</Text>
                            </TouchableOpacity>     
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
    subTitle: {
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        textAlign: 'center',
        marginTop: '5%'
    },
    profileBox: {
        marginTop: '5%',
        height: '82%',
        width: '95%',
        /* alignItems: 'center',
        justifyContent: 'center', */
        borderRadius: 45,
        padding: 12,
        gap: 10,
        backgroundColor: 'rgb(188, 118, 26)'
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
        backgroundColor: 'rgb(239, 233, 225)'
    },
    topRight: {
        width: '58%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 25,
        backgroundColor: 'rgb(239, 233, 225)'
    },
    middle1: {
        height: '20%',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    middle2: {
        height: '23%',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    bot: {
        height: '27%',
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        borderRadius: 25,
        backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
    },
    logOutButton: {
        height: 57,//'30%',//65px
        width: 57,//'18%',//65px
        borderRadius: 57 / 2,
        backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'
    
    },
    renameButton: {
        height: 57,//'30%',//65px
        width: '28%',//'18%',//65px
        borderRadius: 20,
        backgroundColor: 'rgb(246, 89, 89)',
        //marginBottom: '8.5%', //30px
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: '2%'
    },
    renameTextButton: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        //marginTop: '2%'
    },
})
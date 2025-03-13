import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Modal, TextInput } from "react-native"
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

import theme from '@theme';
import { spells } from '@configs/spells';
import { slugify } from '@utils/slugify';

import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";


export default function ProfileScreen({ navigation }) {
    const { user } = useSelector((state) => state.auth)
    const [username, setUsername] = useState(user.username);
    // console.log('user', user)

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

    const [spellList, setSpellList] = useState([])
    //console.log('spells : ', spellList)

    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/spells`)
            setSpellList(response.data.spells)
        })();
    }, [])

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

    //Image des spells
    /* const [spells, setSpells] = useState([])
     useEffect(() => {
         (async () => {
 
             try {
                 // Promise.all pour les requêtes en parallèle
                 // Faire un fetch global pour les données
                 const [spell1Res, spell2Res, spell3Res] = await Promise.all([
 
                     axiosInstance.get(`/spells/67c6f3d337c666e9c7754125`),
                     axiosInstance.get(`/spells/67c7049375266cda5a3c15f0`),
                     axiosInstance.get(`/spells/67c7067a75266cda5a3c15f6`)
                 ]);
 
                 setSpells([
                     { spell1: spell1Res.data.spell },
                     { spell2: spell2Res.data.spell },
                     { spell3: spell3Res.data.spell }
                 ]);
             } catch (error) {
                 console.error("Erreur lors du chargement des données :", error);
             }
         })();
     }, []);
 */
    /*const spellButton = spells.map((data, i) => {
        <TouchableOpacity>

        </TouchableOpacity>
    })*/

    const [modalShowSpellsVisible, setModalShowSpellsVisible] = useState(false);


    const [selectedSpell, setSelectedSpell] = useState(null);
    console.log('ACTIIIIIIIIIIIIIIIIIIIVE:', selectedSpell)



    const handleModal = (data) => {
        setModalShowSpellsVisible(true);
        setSelectedSpell(data)
    }
    const activeSpell = spellList.filter(spells => spells.category === 'active')
    const basicSpell = user.selected_character.spells.filter(e => e.spell.category === 'active')
    //console.log('basicSpell :', basicSpell)
    const unlockedSpell = activeSpell.filter(spell => !basicSpell.some(e => e.spell.name === spell.name))


    //console.log('BOOOOOOOOOH', unlockedSpell)
    //{user.selected_character.spells.filter(spells => spells.spell.category === 'active').map((spell, index) => (
    return (
        <GestureHandlerRootView>
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
                                        <Text style={styles.subtitle} >LEVEL 1</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.middle1}>
                                <Text style={styles.subtitle}>Class description :</Text>
                                {/*<Text>{characterData.race?.description}</Text>*/}
                                <Text>{characterData.race?.tagline}</Text>
                            </View>
                            <View style={styles.middle2}>
                                <Text style={styles.subtitle}>Active spells :</Text>
                                <View style={styles.activeSpellsContainer}>
                                    {user.selected_character.spells.filter(spells => spells.spell.category === 'active').map((spell, index) => (
                                        <TouchableOpacity key={spell._id} onPress={() => handleModal(spell.spell)} style={styles.spell}>
                                            <Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={spells[slugify(spell.spell.name, true)]} />
                                        </TouchableOpacity>
                                    ))}</View>
                            </View>
                            <View style={styles.bot}>
                                <Text style={styles.subtitle}>Unlocked Spell:</Text>
                                <View style={styles.unlockedSpellsContainer}>
                                    <FlatList
                                        contentContainerStyle={{ flexDirection: 'row', gap: 10, marginBottom: 10 }} // du style
                                        horizontal={true} // pour que les items soient alignés horizontalement
                                        data={unlockedSpell} // les données à afficher
                                        keyExtractor={(item) => item._id} // la clé unique pour chaque item
                                        renderItem={({ item }) => ( // la fonction qui rend l'item
                                            <View style={styles.inputSection}>
                                                <TouchableOpacity key={item._id} onPress={() => handleModal(item)} style={styles.spell}>
                                                    <Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={spells[slugify(item.name, true)]} />
                                                    {console.log('ITEEEEM' + item)}
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    //columnWrapperStyle={{ gap: 10 }} // pour que les items aient un espace (peut etre pas utile en horizontal)
                                    />
                                    {/*user.selected_character.spells.filter(spells => spells.spell.category === 'active').map((spell, index) => (
                                <TouchableOpacity key={spell._id} onPress={() => handleSpell(spell)} style={styles.spell}>
                                    <Image style={[styles.spellImage, { tintColor: theme.colors.darkBrown }]} source={spells[slugify(spell.spell.name, true)]} />
                                </TouchableOpacity>
                            ))*/}
                                </View>

                            </View>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ImageBackground>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalShowSpellsVisible} //&& selectedSpell?._id === data._id}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalShowSpellsVisible(false);
                    setSelectedSpell(null);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {selectedSpell && (
                            <View style={styles.spellsCard}>
                                <View style={styles.left}>
                                    <Text style={styles.textName}>{selectedSpell.name}</Text>
                                    <View style={styles.cercle}>
                                        <Image style={{width: 40, height: 40, tintColor:theme.colors.darkBrown}} source={spells[slugify(selectedSpell.name, true)]}/>
                                    </View>
                                </View>
                                <View style={styles.rightSpells}>
                                    <View>
                                        <Text style={styles.textTitleDescription}>Description :</Text>
                                        <Text style={styles.textDescription}>{selectedSpell.description}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={styles.btnModal}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalShowSpellsVisible(false);
                                    setSelectedSpell(null);
                                }}>
                                <Text style={styles.textStyle}>Retour</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
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
        marginTop: '5%',
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
        //backgroundColor: 'green',
        alignItems: 'flex-center',
    },
    bot: {
        height: '27%',
        width: '100%',
        padding: 15,

        borderRadius: 25,
        //backgroundColor: 'rgb(239, 233, 225)',
        alignItems: 'flex-start',
        //backgroundColor : 'purple',
    },
    subtitle: {
        fontWeight: 800,
    },
    spellImageMessage: {
        width: 20,
        height: 20,
    },
    activeSpellsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,

    },
    spell: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: theme.colors.lightBrown02,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.lightBrown
    },
    spellImage: {
        width: 40,
        height: 40,
        //backgroundColor: 'red',
        //borderRadius : 25/2,
    },
    inputSection: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: theme.colors.lightBrown02,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.lightBrown,
        marginTop: 32,
    },
    unlockedSpellsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor : 'pink',
    },
    ///////////
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        //margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '95%',
        height: '40%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    //BOUTON RETOUR MODALE
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '7%',
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'rgb(74, 52, 57)',
        width: '45%',
        alignItems: 'center',
    },
    textStyle: {
        color: 'white'
    },
    // RACES AND SPELLS CARDS
    racesCard: {
        flexDirection: 'row',
        height: '75%',
        width: '100%',
        marginBottom: '1%',
        borderRadius: 45
    },
    spellsCard: {
        flexDirection: 'row',
        height: '75%',
    },
    left: {
        width: '40%',
        alignItems: 'center',
        paddingTop: '12%',
        paddingLeft: '5%',
        backgroundColor: 'rgb(239, 233, 225)',
        borderBottomLeftRadius: 45,
        borderTopLeftRadius: 45
    },
    textName: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 25,
        color: 'rgb(74, 52, 57)'
    },
    rightRaces: {
        paddingTop: '12%',
        width: '60%',
        paddingLeft: '10%',
        paddingRight: '5%',
        backgroundColor: 'rgb(239, 233, 225)',
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
        gap: '5%'
    },
    rightSpells: {
        paddingTop: '12%',
        width: '60%',
        paddingLeft: '10%',
        paddingRight: '5%',
        backgroundColor: 'rgb(239, 233, 225)',
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
    },
    cercle: {
        width: 85,
        height: 85,
        borderRadius: 85 / 2,
        backgroundColor: theme.colors.lightBrown02,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.lightBrown
    },
    passivSpell: {
        flexDirection: 'row'
    },
    textTitleDescription: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 2,
        color: 'rgb(74, 52, 57)',
        marginBottom: 12
    },
    textDescription: {
        color: 'rgb(74, 52, 57)'
    }
})
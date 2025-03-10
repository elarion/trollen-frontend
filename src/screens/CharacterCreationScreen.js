import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginData } from '../store/user';
import { signupUser, resetState } from '../store/authSlice';
import axiosInstance from "../utils/axiosInstance";

export default function CharactereCreationScreen({ navigation, route }) {
    const EXPO = process.env.EXPO_PUBLIC_BACKEND_URL
    // const user = useSelector((state) => state.auth);
    const user = route.params;
    const dispatch = useDispatch();
    //console.log(user);

    const [races, setRaces] = useState([]);
    const [raceCount, setRaceCount] = useState(0);
    const [spell1, setSpell1] = useState([]);
    const [spell2, setSpell2] = useState([]);
    const [spell3, setSpell3] = useState([]);
    //console.log(spell2);
    //console.log(races[raceCount]?.name)
    //console.log(races[raceCount]?.avatar)

    const { loading, error, success } = useSelector((state) => state.auth);

    const genres = [
        'male',
        'female',
        'non-Binary'
    ]
    const [genreCount, setGenreCount] = useState(0);
    //console.log(genres[genreCount]);

    useEffect(() => {
        const getDataRaces = async () => {
            try {
                const response = await fetch(`${EXPO}/races`, {
                });

                const data = await response.json();
                if (data) {
                    setRaces(data.races)
                    //console.log(data.races[0]);
                }
            } catch (error) {
                console.error("Erreur lors du get :", error);
            }
        };
        getDataRaces();
        const getSpell1 = async () => {
            try {
                const response = await fetch(`${EXPO}/spells/67c6f3d337c666e9c7754125`, {
                });

                const data = await response.json();
                if (data) {
                    setSpell1(data);
                    //console.log(data);
                }
            } catch (error) {
                console.error("Erreur lors du get :", error);
            }
        };
        getSpell1()
        const getSpell2 = async () => {
            try {
                const response = await fetch(`${EXPO}/spells/67c7049375266cda5a3c15f0`, {
                });

                const data = await response.json();
                if (data) {
                    setSpell2(data);
                    //console.log(data);
                }
            } catch (error) {
                console.error("Erreur lors du get :", error);
            }
        };
        getSpell2()
        const getSpell3 = async () => {
            try {
                const response = await fetch(`${EXPO}/spells/67c7067a75266cda5a3c15f6`, { // A MODIFIER
                });

                const data = await response.json();
                if (data) {
                    setSpell3(data);
                    //console.log(data);
                }
            } catch (error) {
                console.error("Erreur lors du get :", error);
            }
        };
        getSpell3()
    }, []);

    const goLeftRace = () => {
        setRaceCount(prev => prev > 0 ? prev - 1 : races.length - 1);
    }

    const goRightRace = () => {
        setRaceCount(prev => prev < races.length - 1 ? prev + 1 : 0);
    }

    const goLeftGenre = () => {
        setGenreCount(prev => prev > 0 ? prev - 1 : genres.length - 1);
    }

    const goRightGenre = () => {
        setGenreCount(prev => prev < genres.length - 1 ? prev + 1 : 0);
    }

    useEffect(() => {
        (async () => {
            dispatch(resetState());

            success && navigation.replace('TabNavigator')
        })();
    }, [success]);

    const goToLobby = async () => {
        try {
            const response = await fetch(`${EXPO}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    confirmPassword: user.confirmPassword,
                    has_consent: user.has_consent,
                    gender: genres[genreCount],
                    avatar: races[raceCount]?.avatar,
                    race: races[raceCount]?._id
                }),
            });


            const data = await response.json();
            //console.log(data);
            if (data) {
                //dispatch(loginData({ username: username, email: email }));
                navigation.navigate('TabNavigator')
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <View style={styles.characterBox}>

                        {/* SECTION LOGO */}

                        <View style={styles.logoSection}>
                            <Text style={styles.title}>TROLLEN</Text>
                            <Image style={styles.logo} source={require('../../assets/favicon.png')} />
                        </View>

                        {/* SECTION DESCRIPTION */}

                        <View style={styles.characterChoice}>
                            <View style={styles.raceChoice}>
                                <TouchableOpacity style={styles.leftBtn} onPress={() => goLeftRace()}>
                                    <FontAwesome name='chevron-left' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <View style={styles.middle}>
                                    {<Text style={styles.textRacesName}>{races[raceCount]?.name}</Text>}
                                </View>
                                <TouchableOpacity style={styles.rightBtn} onPress={() => goRightRace()}>
                                    <FontAwesome name='chevron-right' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.raceDescription}>
                                <Text style={styles.textRacesDescription}>{races[raceCount]?.description}</Text>
                            </View>

                            {/* SECTION SPELLS */}
                            <View style={styles.spells}>
                                <View style={styles.passifSpellBox}>
                                    <Text style={styles.passifSpellText}>Sort Passif</Text>
                                    <Text style={styles.spellText}>{races[raceCount]?.spells[0]?.name}</Text>
                                    <View style={styles.passifSpellDescription}>
                                        <Image style={styles.spellImg} source={races[raceCount]?.spells[0]?.image} />
                                        <Text style={styles.spellText}>{races[raceCount]?.spells[0]?.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.actifSpellBox}>
                                    <Text style={styles.actifSpellText}>Sorts Actifs</Text>
                                    <View style={styles.actifSpell}>
                                        <View style={styles.spell}>
                                            <Image style={styles.spellImg} source={spell1.spell?.image} />
                                            <Text style={styles.spellText}>{spell1.spell?.name}</Text>
                                        </View>
                                        <View style={styles.spell}>
                                            <Image style={styles.spellImg} source={spell2.spell?.image} />
                                            <Text style={styles.spellText}>{spell2.spell?.name}</Text>
                                        </View>
                                        <View style={styles.spell}>
                                            <Image style={styles.spellImg} source={spell3.spell?.image} />
                                            <Text style={styles.spellText}>{spell3.spell?.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* SECTION MSIEUR/DAME */}

                        <View style={styles.genreChoise}>
                            <TouchableOpacity style={styles.leftBtn} onPress={() => goLeftGenre()}>
                                <FontAwesome name='chevron-left' size={30} color='rgb(239, 233, 225)' />
                            </TouchableOpacity>
                            <Text style={styles.textGenreChoice}>{genres[genreCount]}</Text>
                            <TouchableOpacity style={styles.rightBtn} onPress={() => goRightGenre()} >
                                <FontAwesome name='chevron-right' size={30} color='rgb(239, 233, 225)' />
                            </TouchableOpacity>
                        </View>

                        {/* SECTION AVATAR */}

                        <View style={styles.avatarChoise}>
                            <Image style={styles.avatarImg} source={races[raceCount]?.avatar} />
                        </View>


                        {/* SECTION TIME TO TROLL */}
                        <View style={styles.validationSection}>
                            <TouchableOpacity style={styles.validationBtn} onPress={() => goToLobby()}>
                                <Text style={styles.textBtn}>TIME TO TROLL !</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView >
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover',
    },
    characterBox: {
        flex: 1,
        alignItems: 'center',
    },

    /* SECTION LOGO */
    logoSection: {
        alignItems: 'center',
        marginTop: '9%'
    },
    title: {
        color: 'rgb(121, 102, 91)',
        fontSize: 30,
        fontWeight: 800,
        textShadowColor: 'black', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 2,
    },
    logo: {
        width: 50,
        height: 50
    },

    /* CHARACTER CHOICE */
    characterChoice: {
        marginTop: '5%',
        backgroundColor: 'rgb(189, 159, 138)',
        width: '97%',
        height: '55%',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    raceChoice: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '10%',
        position: 'relative'
    },
    leftBtn: {
        left: '5',
        position: 'absolute',
        padding:5
    },
    rightBtn: {
        right: '5',
        position: 'absolute',
        padding:5
    },
    middle: {
        alignItems: 'center',
        width: '55%',
    },
    textRacesName: {
        color: 'rgb(121, 102, 91)',
        fontSize: 20,
        fontWeight: 900,
    },
    textRacesDescription: {
        color: 'rgb(226, 215, 204)',
        fontSize: 15,
        fontWeight: 900,
    },
    raceDescription: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        width: '95%',
        padding: '5%'
    },

    /* BIG SPELL BOX*/
    spells: {
        backgroundColor: 'rgb(121, 102, 91)',
        alignItems: 'center',
        width: '95%',
        borderRadius: 47,
        height: '65%'
    },

    /* PASSIF SPELL BOX*/
    passifSpellBox: {
        backgroundColor: 'rgb(189, 159, 138)',
        borderRadius: 40,
        height: '40%',
        width: '96%',
        marginTop: '2%',
        alignItems: 'center',
    },
    passifSpellText: {
        marginTop: '2%',
        color: 'rgb(239, 233, 225)',
        fontSize: 18,
        fontWeight: 800,
    },
    passifSpellDescription: {
        marginTop: '3%',
        alignItems: 'center',
        width: '80%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    spellText: {
        marginLeft: '5%',
        color: 'rgb(226, 215, 204)',
        fontSize: 15,
        fontWeight: 400,

    },
    /* SPELL IMAGE */
    spellImg: {
        width: 35,
        height: 35
    },

    /* ACTIF SPELL TEXT*/
    actifSpellText: {
        marginTop: '5%',
        color: 'rgb(239, 233, 225)',
        fontSize: 18,
        fontWeight: 800,
    },

    /* ACTIF SPELL BOX*/
    actifSpellBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        gap: 10
    },
    actifSpell: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12
    },
    spell: {
        flexDirection: 'row',
        width: '48%',
        height: '65%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'rgb(189, 159, 138)',
        borderRadius: 40,
    },

    /* GENRE CHOICE BOX*/
    genreChoise: {
        flexDirection: 'row',
        marginTop: '2%',
        height: '5%',
        width: '55%',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgb(121, 144, 197)',
        borderRadius: 40,
    },
    textGenreChoice: {
        color: 'rgb(239, 233, 225)',
        fontSize: 18,
        fontWeight: 800,
    },

    /* AVATAR CHOICE BOX*/
    avatarChoise: {
        marginTop: '1%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* VALIDATION SECTION BOX*/
    validationSection: {
        marginTop: '1%',
        width: '55%',
        height: '5%',
        backgroundColor: 'rgb(83, 70, 64)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImg: {
        height: 90,
        width: 90
    },
    textBtn: {
        color: 'rgb(239, 233, 225)',
        fontSize: 20,
        fontWeight: 800,
        textShadowColor: 'black', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 1,
    }
})
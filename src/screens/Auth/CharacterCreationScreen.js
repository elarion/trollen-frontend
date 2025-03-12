/** Imports Hooks */
import React, { useState, useEffect, useCallback, useMemo } from "react";

/** Imports components */
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
    StyleSheet, Text, View, Image, TouchableOpacity,
    ImageBackground, Platform, ActivityIndicator, ScrollView
} from "react-native";
import { Avatar } from '@components/Avatar';

/** Imports SecureStore */
import * as SecureStore from 'expo-secure-store';

/** Imports icons */
import FontAwesome from 'react-native-vector-icons/FontAwesome';

/** Imports store */
import { useDispatch, useSelector } from 'react-redux';
import { setUserSignup } from '@store/authSlice';

/** Imports axios */
import axiosInstance from '@utils/axiosInstance';

/** Imports theme */
import theme from '@theme';

export default function CharactereCreationScreen({ navigation }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // États pour stocker les données
    const [races, setRaces] = useState([]);
    const [raceIndex, setRaceIndex] = useState(0);
    const [spells, setSpells] = useState({});
    const [genreIndex, setGenreIndex] = useState(0);
    const [error, setError] = useState(null);

    // const { success } = useSelector((state) => state.auth);

    // useMemo pour les genres car pas de changement
    // donc pas besoin de re-rendre
    const genres = useMemo(() => ['male', 'female', 'non-binary'], []);

    // Fetch des données races et sorts
    useEffect(() => {
        (async () => {

            try {
                // Promise.all pour les requêtes en parallèle
                // Faire un fetch global pour les données
                const [racesRes, spell1Res, spell2Res, spell3Res] = await Promise.all([
                    axiosInstance.get(`/races`),
                    axiosInstance.get(`/spells/67c6f3d337c666e9c7754125`),
                    axiosInstance.get(`/spells/67c7049375266cda5a3c15f0`),
                    axiosInstance.get(`/spells/67c7067a75266cda5a3c15f6`)
                ]);

                setRaces(racesRes.data.races);
                setSpells({
                    spell1: spell1Res.data.spell,
                    spell2: spell2Res.data.spell,
                    spell3: spell3Res.data.spell
                });
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }
        })();
    }, []);

    // Navigation Race & Genre
    const changeRace = useCallback((direction) => {
        setRaceIndex(prev => (prev + direction + races.length) % races.length);
    }, [races]);

    const changeGenre = useCallback((direction) => {
        setGenreIndex(prev => (prev + direction + genres.length) % genres.length);
    }, [genres]);

    // Validation et envoi des données
    const goToLobby = async () => {
        try {
            const response = await axiosInstance.post(`/users/signup`, { ...user, gender: genres[genreIndex], avatar: races[raceIndex]?.avatar, race: races[raceIndex]?._id });
            const { user: userResponse, accessToken, refreshToken } = response.data;

            dispatch(setUserSignup({ user: userResponse, presignup: false }));

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
        } catch (error) {
            console.log('User in error =>', user, error);
            if (!error.response.data.success) {
                console.log(error.response.data)
                setError(error.response.data.message);
            }

            console.error('Error with goToLobby =>', error);
        }
    };

    // Loader si les données ne sont pas encore là
    if (races.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
                        {/* LOGO */}
                        <View style={styles.logoSection}>
                            <Text style={styles.title}>TROLLEN</Text>
                            <Image style={styles.logo} source={require('@assets/logo.png')} />
                        </View>

                        <View style={styles.characterBox}>
                            {/* CHOIX DE LA RACE */}
                            <View style={styles.characterChoice}>
                                <View style={styles.raceAndClasseChoice}>
                                    <TouchableOpacity style={styles.leftBtn} onPress={() => changeRace(-1)}>
                                        <FontAwesome name='chevron-left' size={30} color='rgb(239, 233, 225)' />
                                    </TouchableOpacity>
                                    <View style={styles.middle}>
                                        <Text style={styles.textRaces}>{races[raceIndex]?.name}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.rightBtn} onPress={() => changeRace(1)}>
                                        <FontAwesome name='chevron-right' size={30} color='rgb(239, 233, 225)' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.raceDescription}>
                                    <Text style={styles.textRaceDescription}>{races[raceIndex]?.tagline}</Text>
                                </View>

                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <Avatar avatar={races[raceIndex]?.avatar} username={user?.username} />
                                </View>

                                {/* CHOIX DU GENRE */}
                                <View style={[styles.genreChoise, { alignSelf: 'center' }]}>
                                    <TouchableOpacity style={styles.leftBtnGenre} onPress={() => changeGenre(-1)}>
                                        <FontAwesome name='chevron-left' size={20} color='rgb(239, 233, 225)' />
                                    </TouchableOpacity>
                                    <Text style={styles.textGenreChoice}>{genres[genreIndex]}</Text>
                                    <TouchableOpacity style={styles.rightBtnGenre} onPress={() => changeGenre(1)}>
                                        <FontAwesome name='chevron-right' size={20} color='rgb(239, 233, 225)' />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.spells}>
                                    <View style={styles.passifSpellBox}>
                                        <Text style={styles.passifSpellText}>Passive Spell</Text>
                                        <View style={styles.passifSpellTitle}>
                                            <View style={styles.shield}>
                                                <FontAwesome name='shield' size={20} color='rgb(239, 233, 225)' />
                                            </View>
                                            <Text style={styles.spellTitle}>{races[raceIndex]?.spells[0]?.name}</Text>
                                        </View>
                                        <View style={styles.passifSpellDescription}>
                                            {/* <Image style={styles.spellImg} source={races[raceIndex]?.spells[0]?.image} /> */}
                                            <Text style={[styles.spellText, styles.spellTextDescription]}>{races[raceIndex]?.spells[0]?.description}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.actifSpellBox}>
                                        <Text style={styles.actifSpellText}>Active Spells</Text>
                                        <View style={styles.actifSpell}>
                                            {[spells.spell1, spells.spell2, spells.spell3].map((spell, index) => (
                                                <View key={index} style={styles.spell}>
                                                    <View style={styles.fire}>
                                                        <FontAwesome name='fire' size={20} color='rgb(239, 233, 225)' />
                                                    </View>
                                                    {/* <Image style={styles.spellImg} source={spell?.image} /> */}
                                                    <Text style={styles.spellText}>{spell?.name}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>


                            {/* <View style={styles.avatarChoise}>
                                <Image style={styles.avatarImg} source={races[raceIndex]?.avatar} />
                            </View> */}

                            {/* VALIDATION */}
                            <View style={styles.validationSection}>
                                <TouchableOpacity style={styles.validationBtn} onPress={goToLobby}>
                                    <Text style={styles.textBtn}>TIME TO TROLL!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ImageBackground>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, resizeMode: 'cover', padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
    characterBox: { flex: 1, alignItems: 'center' },

    /* SECTION LOGO */
    logoSection: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
    title: { color: 'rgb(121, 102, 91)', fontSize: 30, fontWeight: 800 },
    logo: { width: 50, height: 50 },


    /* CHARACTER CHOICE */
    characterChoice: { backgroundColor: theme.colors.lightBrown, width: '100%', borderRadius: 35, paddingVertical: 20, marginBottom: 20 },
    raceAndClasseChoice: { alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', marginBottom: 10 },
    middle: { alignItems: 'center', justifyContent: 'center' },
    leftBtn: { position: 'absolute', left: 20 },
    rightBtn: { position: 'absolute', right: 20 },
    textRaces: { color: theme.colors.darkBrown, fontSize: 20, fontWeight: 800 },
    raceDescription: { alignItems: 'center', marginBottom: 20 },
    textRaceDescription: { color: theme.colors.darkBrown, fontSize: 16, fontWeight: 800 },

    /* BIG SPELL BOX*/
    spells: { alignItems: 'center', width: '100%', alignSelf: 'center', },

    /* PASSIF SPELL BOX*/
    passifSpellBox: { paddingBottom: 30, paddingTop: 20, marginBottom: 20, backgroundColor: 'rgb(121, 102, 91)', width: '100%', alignItems: 'center' },
    passifSpellTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative', width: '100%' },
    passifSpellText: { color: theme.colors.veryLightBrown, fontSize: 18, marginBottom: 10, fontWeight: 800 },
    shield: { position: 'absolute', left: 15, top: -5, backgroundColor: theme.colors.blue, borderRadius: 99, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    passifSpellDescription: { textAlign: 'center', paddingHorizontal: 10 },
    spellTitle: { color: theme.colors.veryLightBrown, textAlign: 'center', marginBottom: 20, fontSize: 16, fontWeight: 800 },
    spellText: { color: theme.colors.veryLightBrown, textAlign: 'center', fontWeight: 800 },

    /* ACTIF SPELL TEXT*/
    actifSpellBox: { width: '100%', alignItems: 'center', marginBottom: 10 },
    actifSpellText: { color: theme.colors.veryLightBrown, fontSize: 18, marginBottom: 10, fontWeight: 800 },
    actifSpell: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
    spell: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.darkBrown, height: 40, paddingRight: 20, paddingLeft: 50, borderRadius: 99 },
    fire: { position: 'absolute', left: 0, top: 0, backgroundColor: theme.colors.red, borderRadius: 99, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    /* GENRE CHOICE BOX*/
    genreChoise: {
        flexDirection: 'row',
        marginTop: '2%',
        height: 40,
        width: 200,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgb(121, 144, 197)',
        borderRadius: 40,
        marginBottom: 20
    },
    textGenreChoice: { color: theme.colors.veryLightBrown, fontSize: 16, fontWeight: 800 },
    leftBtnGenre: { position: 'absolute', left: 10 },
    rightBtnGenre: { position: 'absolute', right: 10 },
    /* AVATAR CHOICE BOX*/
    avatarChoise: { width: '100%', justifyContent: 'center', alignItems: 'center' },

    /* VALIDATION SECTION BOX*/
    validationSection: { backgroundColor: 'rgb(83, 70, 64)', borderRadius: 40, justifyContent: 'center' },
    // avatarImg: { height: 90, width: 90 },
    validationBtn: { backgroundColor: theme.colors.green, borderRadius: 40, height: 50, width: 200, justifyContent: 'center', alignItems: 'center' },
    textBtn: { color: theme.colors.white, fontSize: 20, fontWeight: 800 }
})
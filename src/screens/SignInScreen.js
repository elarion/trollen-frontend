import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Pressable, TextInput, ImageBackground } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { loginData } from '../store/user';
import { signinUser, resetState } from '../store/authSlice';
import Checkbox from 'expo-checkbox';
import { jwtDecode } from 'jwt-decode';

export default function SignInScreen({ navigation }) {
    const EXPO = process.env.EXPO_PUBLIC_BACKEND_URL;
    const [modalSignUpVisible, setModalSignUpVisible] = useState(false);
    const [modalSignInVisible, setModalSignInVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setChecked] = useState(false);

    const { loading, error, success } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const guestMode = () => {
        setUsername('');
        setPassword('');
        setModalSignInVisible(!modalSignInVisible);
        navigation.navigate('TabNavigator');
    };

    const preSignUp = async () => {
        if (isChecked) {
            try {
                const response = await fetch(`${EXPO}/users/pre-signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, email: email, password: password, confirmPassword: confirmPassword, has_consent: isChecked }),
                });

                const data = await response.json();

                if (data) {
                    dispatch(loginData({ username: username, email: email, password: password, confirmPassword: confirmPassword, has_consent: isChecked }));
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setModalSignUpVisible(!modalSignUpVisible);
                    navigation.navigate('CharacterCreation', {
                        username,
                        email,
                        password,
                        confirmPassword,
                        has_consent: isChecked
                    });
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription :", error);
            }
        }
    };

    const signInWithId = async () => {
        try {
            const response = await fetch(`${EXPO}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password }),
            });

            const data = await response.json();
            console.log(jwtDecode(data.token))
            if (data) {
                dispatch(loginData({ username: data.username, email: data.email, token: data.token, tokenDecoded: jwtDecode(data.token) })); // AJOUTER USER_ID REDUX
                setUsername('');
                setPassword('');
                setModalSignInVisible(!modalSignInVisible);
                navigation.navigate('TabNavigator')
            }
        } catch (error) {
            console.error("Erreur lors de la connexion =>", error);
        }
    };

    const signInWithDiscord = () => {
        //MODALE DISCORD
        navigation.navigate('TabNavigator')
    };

    const forgetPassword = () => {
        //LIEN
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <View style={styles.signInBox}>

                        {/* SECTION LOGO */}

                        <View style={styles.logoSection}>
                            <Text style={styles.title}>TROLLEN</Text>
                            <Image style={styles.logo} source={require('../../assets/favicon.png')} />
                        </View>

                        {/* SECTION GUEST MODE */}

                        <View style={styles.invitedSection}>
                            <Text style={styles.text}>Tu débarque et t'as pas le temps ?</Text>
                            <TouchableOpacity style={styles.guestBtn} onPress={() => guestMode()}>
                                <Text style={styles.textGuestBtn}>Mode invité</Text>
                            </TouchableOpacity>
                        </View>

                        {/* SECTION SIGNUP => MODAL */}

                        <View style={styles.signUpSection}>
                            <Text style={styles.text}>Pas encore de compte ?</Text>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalSignUpVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalSignUpVisible(!modalSignUpVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <View style={styles.inputSection}>
                                            <Text>Entrer username</Text>
                                            <TextInput style={styles.nickname} placeholder="Username" onChangeText={value => setUsername(value)} value={username} />
                                            <Text>Entrer email</Text>
                                            <TextInput style={styles.email} placeholder="Email" onChangeText={value => setEmail(value)} value={email} />
                                            <Text>Entrer password</Text>
                                            <TextInput style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                                            <Text>Confirmer password</Text>
                                            <TextInput style={styles.confirmPassword} placeholder="Confirm" onChangeText={value => setConfirmPassword(value)} value={confirmPassword} secureTextEntry={true} />
                                        </View>
                                        <View style={styles.section}>
                                            <Checkbox
                                                style={styles.checkbox}
                                                value={isChecked}
                                                onValueChange={setChecked}
                                                color={isChecked ? '#4630EB' : undefined}
                                            />
                                            <Text style={styles.paragraph}>Consent to Troll</Text>
                                        </View>
                                        <View style={styles.btnModal}>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={() => setModalSignUpVisible(!modalSignUpVisible)}>
                                                <Text style={styles.textStyle}>Retour</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.button, styles.buttonValidation]}
                                                onPress={() => preSignUp()}>
                                                <Text style={styles.textStyle}>Valider</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Pressable
                                style={[styles.signUpBtn, styles.buttonOpen]}
                                onPress={() => setModalSignUpVisible(true)}>
                                <Text style={styles.textBtn}>S'inscrire</Text>
                            </Pressable>
                        </View>

                        {/* SECTION SIGNIN WITH ID => MODAL */}

                        <View style={styles.signInSection}>
                            <Text style={styles.text}>Vous avez déja un compte ?</Text>
                            <Modal
                                aniationType="slide"
                                transparent={true}
                                visible={modalSignInVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalSignInVisible(!modalSignInVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <View style={styles.inputSection}>
                                            <Text>Entrer username</Text>
                                            <TextInput style={styles.nickname} placeholder="Username" onChangeText={value => setUsername(value)} value={username} />
                                            <Text>Entrer password</Text>
                                            <TextInput style={styles.password} placeholder="Password" onChangeText={value => setPassword(value)} value={password} secureTextEntry={true} />
                                        </View>
                                        <View style={styles.btnModal}>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={() => setModalSignInVisible(!modalSignInVisible)}>
                                                <Text style={styles.textStyle}>Retour</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.button, styles.buttonValidation]}
                                                onPress={() => signInWithId()}>
                                                <Text style={styles.textStyle}>Valider</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Pressable
                                style={[styles.signInWithIdBtn, styles.buttonOpen]}
                                onPress={() => setModalSignInVisible(true)}>
                                <Text style={styles.textBtn}>Se connecter avec vos identifiants</Text>
                            </Pressable>

                            {/* SECTION SIGNUP/SIGNIN WITH DISCORD */}

                            <TouchableOpacity style={styles.signInWithDiscordBtn} onPress={() => signInWithDiscord()}>
                                <Text style={styles.textBtn}>Se connecter avec Discord</Text>
                            </TouchableOpacity>

                            {/* SECTION FORGET PASSWORD */}

                            <TouchableOpacity style={styles.forgetPassword} onPress={() => forgetPassword()}>
                                <Text style={styles.textForgetPassword}>Mot de passe oublié ?</Text>
                            </TouchableOpacity>
                        </View>
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
    signInBox: {
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
    },
    logo: {
        width: 50,
        height: 50
    },

    /* TEXT DESCRIPTIF */
    text: {
        fontSize: 15,
        marginBottom: '1%'
    },

    /* SECTION GUEST */
    invitedSection: {
        width: '100%',
        marginTop: '20%',
        alignItems: 'center',
    },
    textGuestBtn: {
        fontSize: 25,
        fontWeight: 800,
        color: 'white'
    },
    guestBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(147, 151, 111)',
        borderRadius: 40,
        height: 80,
        width: '75%'
    },
    textBtn: {
        fontSize: 18,
        fontWeight: 800,
        color: 'white',
    },

    /* SECTION SIGNUP */
    signUpSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: '20%'
    },
    signUpBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(121, 144, 197)',
        borderRadius: 25,
        height: 55,
        width: '75%',
    },

    /* SECTION SIGNIN */
    signInSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: '10%'
    },
    signInWithIdBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(189, 159, 138)',
        borderRadius: 25,
        height: 55,
        width: '75%',
    },
    signInWithDiscordBtn: {
        marginTop: '2%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(89, 101, 233)',
        borderRadius: 25,
        height: 55,
        width: '75%',
    },

    /* SECTION FORGET PASSWORD */
    forgetPassword: {
        marginTop: '20%',
    },
    textForgetPassword: {
        color: 'red',
        fontSize: 15
    },

    /* SECTION MODAL */
    centeredView: {
        flex: 1,
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
    buttonValidation: {
        backgroundColor: 'green',
        width: '45%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    inputSection: {
        height: '60%',
        marginTop: '10%',
        alignItems: 'center',
        width: '100%',
    },
    nickname: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 20,
        paddingLeft: 15,
    },
    email: {
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
    confirmPassword: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingLeft: 15,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%'
    },
})
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Modal, Pressable, TextInput } from "react-native"
import { useState } from "react";

export default function SignInScreen({ navigation }) {

    const [modalSignUpVisible, setModalSignUpVisible] = useState(false);
    const [modalSignInVisible, setModalSignInVisible] = useState(false);
    
    const guestMode = () => {
        navigation.navigate('CharacterCreation')
        // OU
        //navigation.navigate('TabNavigator')
    };

    const signUp = () => {
        navigation.navigate('CharacterCreation')
        // OU
        //navigation.navigate('TabNavigator')
    };

    const signInWithId = () => {
        navigation.navigate('TabNavigator')
        //modale username + password
    };

    const signInWithDiscord = () => {
        //modale Discord
        navigation.navigate('TabNavigator')
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.signInBox}>

                {/* SECTION LOGO */}

                <View style={styles.logoSection}>
                    <Text style={styles.title}>TROLLEN</Text>
                    <Image style={styles.img} source={require('../../assets/favicon.png')} />
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
                                    <TextInput style={styles.nickname} placeholder="Username" />
                                    <Text>Entrer email</Text>
                                    <TextInput style={styles.email} placeholder="Email" />
                                    <Text>Entrer password</Text>
                                    <TextInput style={styles.password} placeholder="Password" />
                                    <Text>Confirmer password</Text>
                                    <TextInput style={styles.confirmPassword} placeholder="Confirm password" />
                                </View>
                                <View style={styles.btnModal}>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalSignUpVisible(!modalSignUpVisible)}>
                                        <Text style={styles.textStyle}>Retour</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonValidation]}
                                        onPress={() => setModalSignUpVisible(!modalSignUpVisible)}>
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
                        animationType="slide"
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
                                    <TextInput style={styles.nickname} placeholder="Username" />
                                    <Text>Entrer password</Text>
                                    <TextInput style={styles.password} placeholder="Password" />
                                </View>
                                <View style={styles.btnModal}>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalSignInVisible(!modalSignInVisible)}>
                                        <Text style={styles.textStyle}>Retour</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonValidation]}
                                        onPress={() => setModalSignInVisible(!modalSignInVisible)}>
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
                        <Text style={styles.textForgetPassword}>Mot de pass oublié ?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signInBox: {
        flex: 1,
        alignItems: 'center',
    },

     /* SECTION LOGO */
    logoSection: {
        alignItems: 'center',
        marginTop: '2%'
    },
    title: {
        color: 'brown',
        fontSize: 30,
        fontWeight: 800,
    },
    img: {

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
        backgroundColor: 'green',
        borderRadius: 40,
        height: 80,
        width: '60%'
    },
    textBtn: {
        fontSize: 18,
        fontWeight: 800,
        color: 'white'
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
        backgroundColor: 'lightblue',
        borderRadius: 25,
        height: 50,
        width: '60%',
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
        backgroundColor: 'brown',
        borderRadius: 25,
        height: 50,
        width: '60%',
    },
    signInWithDiscordBtn: {
        marginTop: '2%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        borderRadius: 25,
        height: 50,
        width: '60%',
    },

    /* SECTION FORGET PASSWORD */
    forgetPassword: {
        marginTop:'30%',
    },
    textForgetPassword: {
        color:'red',
        fontSize:30
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
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'30%',
        width:'100%'
    },
    buttonClose: {
        backgroundColor: 'red',
        width:'45%',
        alignItems: 'center',
    },
    buttonValidation: {
        backgroundColor: 'green',
        width:'45%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    inputSection: {
        height: '60%',
        justifyContent: 'space-between',
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
})
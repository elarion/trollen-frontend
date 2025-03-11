/** Imports Hooks */
import React, { useReducer, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

/** Imports components */
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, ImageBackground, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';


/** Imports store */
import { useDispatch } from 'react-redux';
import { setUserSignin, setUserPreSignup } from '@store/authSlice';

/** Imports axios */
import axiosInstance from '@utils/axiosInstance';

/** Imports theme */
import theme from '@theme';

// Initial state
const initialState = {
    modalSignUpVisible: false,
    modalSignInVisible: false,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    has_consent: false,
};

// Reducer pour gérer l'état, ça fonctionne comme un useState mais avec un objet
// On utilse les switch pour gérer les actions et eviter de créer une fonction pour chaque action
const reducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_SIGNUP_MODAL':
            return { ...state, modalSignUpVisible: !state.modalSignUpVisible };
        case 'TOGGLE_SIGNIN_MODAL':
            return { ...state, modalSignInVisible: !state.modalSignInVisible };
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET_FIELDS':
            return initialState;
        default:
            return state;
    }
};

export default function SignInScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [state, dispatchState] = useReducer(reducer, initialState);
    const [error, setError] = useState(null);
    const [errorPresignup, setErrorPresignup] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mode invité
    const guestMode = () => {
        Alert.alert('Guest mode', 'Not working yet... but have been');
        dispatchState({ type: 'RESET_FIELDS' });

        // navigation.navigate('TabNavigator');
    };

    // Inscription utilisateur
    const preSignUp = async () => {
        if (!state.has_consent) return false;

        try {
            setLoading(true);

            const response = await axiosInstance.post(`/users/pre-signup`, { username: state.username, email: state.email, password: state.password, confirmPassword: state.confirmPassword, has_consent: state.has_consent });

            if (!response.data.success) {
                console.log('Error with preSignUp =>', response.data.error);
            }

            dispatch(setUserPreSignup({ user: { username: state.username, email: state.email, password: state.password, confirmPassword: state.confirmPassword, has_consent: state.has_consent } }));

            dispatchState({ type: 'TOGGLE_SIGNUP_MODAL' });
            dispatchState({ type: 'RESET_FIELDS' });

            navigation.navigate('CharacterCreation');
        } catch (error) {
            console.log('Error with preSignUp =>', error);
        } finally {
            setLoading(false);
        }
    };

    // Connexion utilisateur
    const signInWithId = async () => {
        if (!state.username || !state.password) return false;

        try {
            setLoading(true);

            const response = await axiosInstance.post(`/users/signin`, { username: state.username, password: state.password });

            const { user, accessToken, refreshToken } = response.data;
            dispatch(setUserSignin({ user }));

            dispatchState({ type: 'RESET_FIELDS' });

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
        } catch (error) {
            if (!error.response.data.success) {
                setError(error.response.data.message);
            }

            console.error('Error with signInWithId =>', error);
        } finally {
            setLoading(false);
        }
    };

    // safeareaProvider est un composant qui permet de s'assurer que le contenu de l'application est visible dans la zone sécurisée de l'appareil
    // La différence entre safeAreaView et safeAreaProvider est que safeAreaView est un composant qui permet de s'assurer que le contenu de l'application est visible dans la zone sécurisée de l'appareil
    // safeAreaView est un composant qui permet de s'assurer que le contenu de l'application est visible dans la zone sécurisée de l'appareil
    // Si on ne met pas safeAreaProvider, le contenu de l'application ne sera pas visible dans la zone sécurisée de l'appareil
    return (
        <>
            <ImageBackground source={require('../../../assets/background/background.png')} style={styles.backgroundImage}>
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container} edges={['top', 'left']}>
                        {loading && (
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                                {/* <ActivityIndicator size="large" color="#0000ff" /> */}
                                {/* <Text style={{ color: theme.colors.veryLightBrown, fontSize: 24, fontWeight: 'bold' }}>loading...</Text> */}
                            </View>
                        )}
                        <View style={styles.signInBox}>
                            {/* SECTION LOGO */}
                            <View style={styles.logoSection}>
                                <Text style={styles.title}>TROLLEN</Text>
                                <Image style={styles.logo} source={require('../../../assets/logo.png')} />
                            </View>

                            {/* SECTION GUEST MODE */}
                            <View style={[styles.buttonSection, { marginBottom: 20 }]}>
                                <Text style={[styles.text, { fontWeight: 'bold', color: theme.colors.darkBrown }]}>You don't have time?</Text>
                                <TouchableOpacity style={[styles.guestBtn, styles.button]} onPress={guestMode}>
                                    <Text style={styles.textGuestBtn}>guest mode</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.text, { color: theme.colors.darkBrown, marginBottom: 20 }]}>or</Text>

                            {/* SECTION SIGNIN */}
                            <View style={styles.buttonSection}>
                                {/* <Text style={[styles.text, { color: theme.colors.darkBrown }]}>Already have an account?</Text> */}
                                <TouchableOpacity
                                    style={[styles.signInWithIdBtn, styles.button]}
                                    onPress={() => dispatchState({ type: 'TOGGLE_SIGNIN_MODAL' })}>
                                    <Text style={styles.textBtn}>Sign in</Text>
                                </TouchableOpacity>
                            </View>

                            {/* SECTION SIGNUP */}
                            <View style={[styles.buttonSection, { marginBottom: 20 }]}>
                                {/* <Text style={[styles.text, { color: theme.colors.darkBrown }]}>Don't have an account yet ?</Text> */}
                                <TouchableOpacity
                                    style={[styles.signUpBtn, styles.button]}
                                    onPress={() => dispatchState({ type: 'TOGGLE_SIGNUP_MODAL' })}>
                                    <Text style={styles.textBtn}>Create an account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ImageBackground>
            {/* SECTION SIGNUP */}
            <AuthModal
                title="Subscribe"
                visible={state.modalSignUpVisible}
                toggleModal={() => dispatchState({ type: 'TOGGLE_SIGNUP_MODAL' })}
                fields={state}
                setField={(field, value) => dispatchState({ type: 'UPDATE_FIELD', field, value })}
                onConfirm={preSignUp}
                isSignUp
                error={error}
            />
            {/* SECTION SIGNIN */}
            <AuthModal
                title="Connexion"
                visible={state.modalSignInVisible}
                toggleModal={() => dispatchState({ type: 'TOGGLE_SIGNIN_MODAL' })}
                fields={state}
                setField={(field, value) => dispatchState({ type: 'UPDATE_FIELD', field, value })}
                onConfirm={signInWithId}
                error={error}
            />
        </>
    );
}

// Composant Modal (Réutilisable)
const AuthModal = ({ title, visible, toggleModal, fields, setField, onConfirm, isSignUp, error }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={toggleModal} style={{ height: '100%' }}>
        <View style={styles.centeredView}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} onPress={toggleModal} />

            <View style={styles.modalView}>
                <Text style={styles.titleModal}>{title}</Text>
                <View style={styles.inputSection}>
                    <Text style={[styles.text]}>{isSignUp ? 'Choose a' : 'Enter your'} username {!isSignUp ? 'or email' : ''}</Text>
                    <TextInput placeholderTextColor={theme.colors.primary} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Username" keyboardType="email-address" value={fields.username} onChangeText={value => setField('username', value)} />
                    {isSignUp && (
                        <>
                            <Text style={styles.text}>Enter your email</Text>
                            <TextInput placeholderTextColor={theme.colors.primary} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Email" keyboardType="email-address" value={fields.email} onChangeText={value => setField('email', value)} />
                        </>
                    )}
                    <Text style={styles.text}>{isSignUp ? 'Choose a' : 'Enter your'} password</Text>
                    <TextInput placeholderTextColor={theme.colors.primary} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Password" value={fields.password} onChangeText={value => setField('password', value)} secureTextEntry />
                    {isSignUp && (
                        <>
                            <Text style={styles.text}>Confirm your password</Text>
                            <TextInput placeholderTextColor={theme.colors.primary} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Confirm your password" value={fields.confirmPassword} onChangeText={value => setField('confirmPassword', value)} secureTextEntry />
                        </>
                    )}
                </View>

                {isSignUp && (
                    <View style={styles.checkboxSection}>
                        <Checkbox value={fields.has_consent} onValueChange={(value) => setField('has_consent', value)} color={theme.colors.green} style={styles.checkbox} />
                        <Text style={[styles.text, { paddingTop: 7 }]} onPress={() => setField('has_consent', !fields.has_consent)}>I accept the conditions</Text>
                    </View>
                )}

                <View style={styles.btnModal}>
                    <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={toggleModal}>
                        <Text style={styles.textStyle}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonValidation]} onPress={onConfirm}>
                        <Text style={styles.textStyle}>Validate</Text>
                    </TouchableOpacity>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    </Modal >
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, width: '100%', height: '100%', resizeMode: 'cover' },
    signInBox: { flex: 1, alignItems: 'center', padding: 20, alignItems: 'center', justifyContent: 'center' },
    logoSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    title: { fontSize: 42, fontWeight: 'bold', color: theme.colors.darkBrown },
    buttonSection: { width: 250, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    text: { fontSize: 16, color: theme.colors.white, fontWeight: 'bold', marginBottom: 5, alignSelf: 'center' },
    guestBtn: { backgroundColor: theme.colors.green },
    signUpBtn: { backgroundColor: theme.colors.blue, height: 45, },
    textGuestBtn: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' },
    textBtn: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' },
    signInWithIdBtn: { backgroundColor: theme.colors.lightBrown, height: 45, },
    button: { width: '100%', borderRadius: 99, height: 45, padding: 10, alignItems: 'center', justifyContent: 'center' },
    btnModal: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    buttonClose: { backgroundColor: 'red', width: '45%', alignItems: 'center' },
    buttonValidation: { backgroundColor: 'green', width: '45%', alignItems: 'center' },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    titleModal: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: theme.colors.white },
    inputSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: { width: 250, height: 40, borderRadius: 20, backgroundColor: theme.colors.veryLightBrown, paddingLeft: 15 },
    btnModal: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
    buttonClose: { backgroundColor: theme.colors.red, width: '45%', alignItems: 'center' },
    buttonValidation: { backgroundColor: theme.colors.green, width: '45%', alignItems: 'center' },
    textStyle: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' },
    checkboxSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    checkbox: { marginRight: 10 },
    errorText: { color: theme.colors.red, fontSize: 16, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }
});

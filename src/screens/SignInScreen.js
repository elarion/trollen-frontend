import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native"

export default function SignInScreen({ navigation }) {

    const guestMode = () => {
        navigation.navigate('CharacterCreation')
        // OU
        //navigation.navigate('TabNavigator')
    };

    const signUp = () => {
        navigation.navigate('SignUp')
    };

    const signInWithId = () => {
        //modale username + password
    };

    const signInWithDiscord = () => {
        //modale Discord
        navigation.navigate('CharacterCreation')
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.signInBox}>
                <View style={styles.logoSection}>
                    <Text style={styles.title}>TROLLEN</Text>
                    <Image style={styles.img} source={require('../assets/favicon.png')} />
                </View>
                <View style={styles.invitedSection}>
                    <Text style={styles.text}>Tu débarque et t'as pas le temps ?</Text>
                    <TouchableOpacity style={styles.guestBtn} onPress={() => guestMode()}>
                        <Text style={styles.textGuestBtn}>Mode invité</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signUpSection}>
                    <Text style={styles.text}>Pas encore de compte ?</Text>
                    <TouchableOpacity style={styles.signUpBtn} onPress={() => signUp()}>
                        <Text style={styles.textBtn}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signInSection}>
                    <Text style={styles.text}>Vous avez déja un compte ?</Text>
                    <TouchableOpacity style={styles.signInWithIdBtn} onPress={() => signInWithId()}>
                        <Text style={styles.textBtn}>Se connecter avec vos identifiants</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signInWithDiscordBtn} onPress={() => signInWithDiscord()}>
                        <Text style={styles.textBtn}>Se connecter avec Discord</Text>
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
    text: {
        fontSize: 15,
        marginBottom: '1%'
    },
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
        fontSize: 20,
        fontWeight: 800,
        color: 'white'
    },
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
})
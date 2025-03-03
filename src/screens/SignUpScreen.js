import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"

export default function SignUpScreen() {

    // FLECHE RETOUR ????

    const signUp= () => {
        //enregistrement bdd
        navigation.navigate('CharacterCreation')
    }

    const signUpWithDiscord= () => {
        //enregistrement bdd
        navigation.navigate('CharacterCreation')
    }

    return (
        <View styles={StyleSheet.container}>
            <View style={styles.signUpSection}>
                <View style={styles.logoSection}>
                    <Text style={styles.title}>TROLLEN</Text>
                    <Image style={styles.img} source={require('../assets/favicon.png')} />
                </View>
                <View style={styles.inputSection}>
                    <TextInput style={styles.nickname} placeholder="Username" />
                    <TextInput style={styles.email} placeholder="Email" />
                    <TextInput style={styles.password} placeholder="Password" />
                    <TextInput style={styles.confirmPassword} placeholder="Confirm password" />
                </View>
                <View style={styles.btnSection}>
                    <TouchableOpacity style={styles.signUpWithIdBtn} onPress={() => signUp()}>
                        <Text style={styles.textBtn}>S'inscrire</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>OU</Text>
                    <TouchableOpacity style={styles.signUpWithDiscordBtn} onPress={() => signUpWithDiscord()}>
                        <Text style={styles.textBtn}>S'inscrire avec Discord</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signUpBox: {
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
    signUpSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: '5%'
    },
    inputSection: {
        height:'35%',
        justifyContent:'space-between',
        marginTop: '10%',
        alignItems: 'center',
        width: '100%',
    },
    nickname: {
        width:'40%',
        height:40,
        borderWidth:1,
        borderColor:'red',
        borderRadius:20,
        paddingLeft:15,
    },
    email: {
        width:'40%',
        height:40,
        borderWidth:1,
        borderColor:'green',
        borderRadius:20,
        paddingLeft:15,
    },
    password: {
        width:'40%',
        height:40,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:20,
        paddingLeft:15,
    },
    confirmPassword: {
        width:'40%',
        height:40,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:20,
        paddingLeft:15,
    },
    btnSection: {
        alignItems: 'center',
        width: '100%'
    },
    textBtn: {
        fontSize: 20,
        fontWeight: 800,
        color: 'white'
    },
    signUpWithIdBtn: {
        marginTop:'10%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'brown',
        borderRadius: 25,
        height: 50,
        width: '60%',
    },
    text: {
        marginTop:30,
        fontSize: 15,
        marginBottom: 30,
    },
    signUpWithDiscordBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        borderRadius: 25,
        height: 50,
        width: '60%',
    },
});
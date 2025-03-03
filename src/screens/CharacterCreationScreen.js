import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native"

const goLeftRace = () => {

}

const goRightRace = () => {

}

const genreChoiceBtn = () => {

}

const goLeftAvatar = () => {

}

const goRightAvatar = () => {

}

const goToLobby = () => {

}

export default function CharactereCreationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.characterBox}>

                {/* SECTION LOGO */}

                <View style={styles.logoSection}>
                    <Text style={styles.title}>TROLLEN</Text>
                    <Image style={styles.img} source={require('../../assets/favicon.png')} />
                </View>

                {/* SECTION DESCRIPTION */}

                <View style={styles.characterChoice}>
                    <View style={styles.raceAndClasseChoice}>
                        <TouchableOpacity style={styles.leftBtn} onPress={() => goLeftRace()}>
                            <Text style={styles.leftTextBtn}>LEFT</Text>
                        </TouchableOpacity>
                        <View style={styles.middle}>
                            <Text style={styles.textRaces}>Nina</Text>
                            <Text style={styles.textClasses}>Dénicheur de Secret</Text>
                        </View>
                        <TouchableOpacity style={styles.rightBtn} onPress={() => goRightRace()}>
                            <Text style={styles.rightTextBtn}>RIGHT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.raceDescription}>
                        <Text>Description</Text>
                    </View>

                    {/* SECTION SPELLS */}
                    <View style={styles.spells}>
                        <View style={styles.passifSpellBox}>
                            <Text>Sort Passif</Text>
                            <View style={styles.passifSpellDescription}>
                                <Image source={require('../../assets/favicon.png')} />
                                <Text>Description du Sort Passif</Text>
                            </View>
                        </View>
                        <View style={styles.actifSpellBox}>
                            <Text style={styles.actifSpellText}>Sorts Actifs</Text>
                            <View style={styles.actifSpell}>
                                <View style={styles.spell}>
                                    <Image source={require('../../assets/favicon.png')} />
                                    <Text>Boule de Feu</Text>
                                </View>
                                <View style={styles.spell}>
                                    <Image source={require('../../assets/favicon.png')} />
                                    <Text>Boule de Glace</Text>
                                </View>
                                <View style={styles.spell}>
                                    <Image source={require('../../assets/favicon.png')} />
                                    <Text>Boule de Troll</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* SECTION MSIEUR/DAME */}

                <View style={styles.genreChoise}>
                    <TouchableOpacity style={styles.genreChoiceBtn} onPress={() => genreChoiceBtn()}>
                        <Text style={styles.textGenreChoice}>Un.e Msieur Dame</Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION AVATAR */}

                <View style={styles.avatarChoise}>
                    <TouchableOpacity style={styles.leftBtn} onPress={() => goLeftAvatar()}>
                        <Text style={styles.leftTextBtn}>LEFT</Text>
                    </TouchableOpacity>
                    <Image source={require('../../assets/favicon.png')} />
                    <TouchableOpacity style={styles.rightBtn} onPress={() => goRightAvatar()}>
                        <Text style={styles.rightTextBtn}>Right</Text>
                    </TouchableOpacity>
                </View>


                {/* SECTION TIME TO TROLL */}
                <View style={styles.validationSection}>
                    <TouchableOpacity style={styles.validationBtn} onPress={() => goToLobby()}>
                        <Text style={styles.textBtn}>TIME TO TROLL !</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    characterBox: {
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

    /* CHARACTER CHOICE */
    characterChoice: {
        marginTop: '5%',
        backgroundColor: 'brown',
        width: '90%',
        height: '60%',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    raceAndClasseChoice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '10%'
    },
    middle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftBtn: {
        marginRight: '10%'
    },
    rightBtn: {
        marginLeft: '10%'
    },
    raceDescription: {
        // marginTop:'5%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        width: '95%',
        backgroundColor: 'green',
    },

    /* BIG SPELL BOX*/
    spells: {
        backgroundColor: 'blue',
        alignItems: 'center',
        //justifyContent: 'center',
        width: '95%',
        borderRadius: 47,
        height: '60%'
    },

    /* PASSIF SPELL BOX*/
    passifSpellBox: {
        backgroundColor: 'green',
        borderRadius: 40,
        height: '40%',
        width: '90%',
        marginTop: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    passifSpellDescription: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    /* ACTIF SPELL TEXT*/
    actifSpellText: {
        marginTop: '2%',
    },

    /* ACTIF SPELL BOX*/
    actifSpellBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
    actifSpell: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    spell: {
        flexDirection: 'row',
        width: '48%',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'green',
        borderRadius: 40,
        marginTop: '5%'
    },

    /* GENRE CHOICE BOX*/
    genreChoise: {
        marginTop: '5%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* AVATAR CHOICE BOX*/
    avatarChoise: {
        marginTop: '5%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* VALIDATION SECTION BOX*/
    validationSection: {
        marginTop: '5%',
        width: '45%',
        height: '5%',
        backgroundColor: 'green',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
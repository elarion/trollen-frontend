import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"

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
                        <TouchableOpacity style={styles.guestBtn} onPress={() => goLeftRace()}>
                            <Text style={styles.leftBtn}>LEFT</Text>
                        </TouchableOpacity>
                        <Text style={styles.textRaces}>Nina</Text>
                        <Text style={styles.textClasses}>Dénicheur de Secret</Text>
                        <TouchableOpacity style={styles.guestBtn} onPress={() => goRightRace()}>
                            <Text style={styles.rightBtn}>RIGHT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.raceDescription}>
                        <Text>Description</Text>
                    </View>

                    {/* SECTION SPELLS */}
                    <View style={styles.spells}>
                        <View style={styles.passifSpell}>
                            <Text>Sort Passif</Text>
                            <View style={styles.passifSpellDescription}>
                                <Image source={require('../../assets/favicon.png')} />
                                <Text>Description du Sort Passif</Text>
                            </View>
                        </View>
                        <View style={styles.actifSpell}>
                            <Text>Sorts Actifs</Text>
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

                {/* SECTION MSIEUR/DAME */}

                <View style={styles.genreChoise}>
                    <TouchableOpacity style={styles.genreChoiceBtn} onPress={() => genreChoiceBtn()}>
                        <Text style={styles.textGenreChoice}>Un.e Msieur Dame</Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION AVATAR */}

                <View style={styles.avatarChoise}>
                    <TouchableOpacity style={styles.guestBtn} onPress={() => goLeftAvatar()}>
                        <Text style={styles.leftBtn}>LEFT</Text>
                    </TouchableOpacity>
                    <Image source={require('../../assets/favicon.png')} />
                    <TouchableOpacity style={styles.guestBtn} onPress={() => goRightAvatar()}>
                        <Text style={styles.rightBtn}>Right</Text>
                    </TouchableOpacity>
                </View>


                {/* SECTION TIME TO TROLL */}
                <View>
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
})
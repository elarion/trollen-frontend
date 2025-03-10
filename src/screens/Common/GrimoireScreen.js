import { StyleSheet, Text, View, Image, ImageBackground, ScrollView, Modal, TouchableOpacity } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import axiosInstance from '@utils/axiosInstance';
import TopHeader from "@components/TopHeader";
import { Avatar } from '@components/Avatar';

export default function GrimoireScreen({ navigation }) {
    const [modalShowRacesVisible, setModalShowRacesVisible] = useState(false);
    const [modalShowSpellsVisible, setModalShowSpellsVisible] = useState(false);
    const [viewMode, setViewMode] = useState('races');
    const [selectedRace, setSelectedRace] = useState(null);
    const [selectedSpell, setSelectedSpell] = useState(null);
    const [racesData, setRacesData] = useState([]);
    const [spellsData, setSpellsData] = useState([]);
    //console.log(racesData)

    useEffect(() => {
        (async () => {
            const response1 = await axiosInstance.get(`/spells`)
            setSpellsData(response1.data.spells)
            const response2 = await axiosInstance.get('/races')
            setRacesData(response2.data.races)
        })()
    }, [])

    const races = racesData.map((data) => {
        return (
            <View key={data._id}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalShowRacesVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalShowRacesVisible(false);
                        setSelectedRace(null);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {selectedRace && (
                                <View style={styles.racesCard}>
                                    <View style={styles.left}>
                                        <Text style={styles.textName}>{selectedRace.name}</Text>
                                        <Avatar avatar={selectedRace.avatar} />
                                    </View>
                                    <View style={styles.rightRaces}>
                                        <View style={styles.rightTop}>
                                            <Text style={styles.textTitleDescription}>Description :</Text>
                                            <Text style={styles.textDescription}>{selectedRace.description}</Text>
                                            <Text style={styles.textDescription}>{selectedRace.tagline}</Text>
                                        </View>
                                        <View style={styles.rightBot}>
                                            <Text style={styles.textTitleDescription}>Spells passifs :</Text>
                                            <View style={styles.passivSpell}>
                                                <Text style={styles.textDescription}>{selectedRace.spells.map((spell) => spell.image).join(', ')}</Text>
                                                <Text style={styles.textDescription}>{selectedRace.spells.map((spell) => spell.name).join(', ')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <View style={styles.btnModal}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalShowRacesVisible(false);
                                        setSelectedRace(null);
                                    }}>
                                    <Text style={styles.textStyle}>Retour</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    style={styles.itemCard}
                    onPress={() => {
                        setSelectedRace(data); // Associer la race sélectionnée
                        setModalShowRacesVisible(true);
                    }}>
                    <Text style={styles.textBtn}>{data.name}</Text>
                    <Avatar avatar={data.avatar} />
                </TouchableOpacity>
            </View>
        );
    });


    const spells = spellsData.map((data) => {
        return (
            <View key={data._id}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalShowSpellsVisible && selectedSpell?._id === data._id}
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
                                        <Text>{selectedSpell.image}</Text>
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
                <TouchableOpacity
                    style={styles.itemCard}
                    onPress={() => {
                        setSelectedSpell(data); // Associer le sort sélectionné
                        setModalShowSpellsVisible(true);
                    }}>
                    <Text style={styles.textBtn}>{data.name}</Text>
                    <Text>{data.image}</Text>
                </TouchableOpacity>
            </View>
        );
    });


    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['left', 'top']}>
                    <TopHeader />
                    <Text style={styles.subTitle}>GRIMOIRE</Text>
                    <View style={styles.selectCategories}>
                        <TouchableOpacity onPress={() => setViewMode('races')}>
                            <Text style={[styles.subSubTitle, { color: viewMode === 'races' ? 'rgb(188, 118, 26)' : 'black' }]}>Races</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setViewMode('spells')}>
                            <Text style={[styles.subSubTitle, { color: viewMode === 'spells' ? 'rgb(188, 118, 26)' : 'black' }]}>Spells</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.grimoireContentBox}>
                        <ScrollView contentContainerStyle={styles.itemsContainer}>
                            {viewMode === 'races' ? races : spells}
                        </ScrollView>
                    </View>
                </SafeAreaView >
            </SafeAreaProvider >
        </ImageBackground>
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

    //GRIMOIRE TEXT STYLE
    subTitle: {
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        textAlign: 'center',
        marginTop: '5%'
    },
    // TITLE RACES AND SPELLS
    selectCategories: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '5%',
        gap: '33%',
        marginBottom: '5%'
    },
    subSubTitle: {
        //color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
    },
    //INFO AREA
    grimoireContentBox: {
        flex: 1,
    },
    //BOUTON INSIDE INFO AREA (SELECT RACES OR SPELLS)
    textBtn: {
        fontSize: 18,
        fontWeight: 800,
        color: 'Brown',
        marginBottom: '5%',
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: '2%',
    },
    itemCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },

    //MODALE
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
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
        paddingTop: '6%',
        backgroundColor: 'rgb(74, 52, 57)',
        borderBottomLeftRadius: 45,
        borderTopLeftRadius: 45
    },
    textName: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 25,
        color: 'rgb(239, 233, 225)'
    },
    rightRaces: {
        paddingTop: '6%',
        width: '60%',
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: 'rgb(188, 118, 26)',
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
        gap: '5%'
    },
    rightSpells: {
        paddingTop: '6%',
        width: '60%',
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: 'rgb(188, 118, 26)',
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
    },
    passivSpell: {
        flexDirection: 'row'
    },
    textTitleDescription: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 2,
        color: 'rgb(239, 233, 225)'
    },
    textDescription: {
        color: 'rgb(239, 233, 225)'
    }
})
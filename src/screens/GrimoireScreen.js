import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView, Modal, Pressable } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function GrimoireScreen({ navigation }) {
    const [modalShowRacesVisible, setModalShowRacesVisible] = useState(false);
    const [selectedRace, setSelectedRace] = useState(null);
    
    const goToSettings = () => {
        navigation.navigate('Settings');
    }
    const goToNews = () => {
        navigation.navigate('News');
    }
    const goToProfile = () => {
        navigation.navigate('Profile');
    }
    const goToGrimoire = () => {
        navigation.navigate('Grimoire');
    }
    const [spells, setSpells] = useState([]);
    const [races, setRaces] = useState([]);
    //console.log(races)
    console.log(spells)

    useEffect(() => {
        (async () => {
            const response1 = await axiosInstance.get(`/spells`)
            setSpells(response1.data.spells)
            const response2 = await axiosInstance.get('/races')
            setRaces(response2.data.races)
        })()
    }, [])

    const racesMap = races.map((data) => {
        return (
            <View key={data._id}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalShowRacesVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalShowRacesVisible(false);
                        setSelectedRace(null); // Réinitialiser la sélection quand le modal se ferme
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {selectedRace && (
                                <View style={styles.raceCard}>
                                    <View style={styles.left}>
                                        <Text>{selectedRace.name}</Text>
                                        <Text>{selectedRace.avatar}</Text>
                                    </View>
                                    <View style={styles.right}>
                                        <View>
                                            <Text>Description :</Text>
                                            <Text>{selectedRace.description}</Text>
                                        </View>
                                        <View>
                                            <Text>Spells passifs :</Text>
                                            <Text>{selectedRace.spells.map((spell) => spell.name).join(', ')}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <View style={styles.btnModal}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalShowRacesVisible(false);
                                        setSelectedRace(null);
                                    }}>
                                    <Text style={styles.textStyle}>Retour</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.ShowRacesWithIdBtn, styles.buttonOpen]}
                    onPress={() => {
                        setSelectedRace(data); // Associer la race sélectionnée
                        setModalShowRacesVisible(true);
                    }}>
                    <Text style={styles.textBtn}>{data.name}{data.avatar}</Text>
                </Pressable>
            </View>
        );
    });


    const spellsMap = spells.map((data) => {
        return (
            <View key={data._id} style={styles.spellCard}>
                <View style={styles.left}>
                    <Text>{data.name}</Text>
                    <Text>{data.avatar}</Text>
                </View>
                <View style={styles.right}>
                    <View>
                        <Text>Description :</Text>
                        <Text>{data.description}</Text>
                    </View>
                    <View>
                        <Text>Spells passifs :</Text>
                    </View>
                </View>
            </View>

        )
    });


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <Header
                        containerStyle={styles.header}
                        leftComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToSettings}>
                                    <FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToNews}>
                                    <FontAwesome name='newspaper-o' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
                        centerComponent={
                            <View>
                                <Text style={styles.title}>Trollen</Text>
                            </View>
                        }
                        rightComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToProfile}>
                                    <FontAwesome name='user' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToGrimoire}>
                                    <FontAwesome name='book' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
                    />
                    <View style={styles.grimoireBox}>
                        <Text style={styles.subTitle}>GRIMOIRE</Text>
                        <ScrollView style={styles.scrollView}>
                            <View>{racesMap}</View>

                            <View style={styles.spellView}>
                                <Text style={styles.subSubTitle}>Spells :</Text>
                                <View>{spellsMap}</View>
                            </View>
                        </ScrollView>
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
    header: {
        backgroundColor: 'rgb(74, 52, 57)',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        color: 'rgb(239, 233, 225)',
        fontSize: 30,
        fontWeight: 800,
    },
    subTitle: {
        marginTop: '5%',
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
    },
    subSubTitle: {
        margin: '5%',
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
    },
    grimoireBox: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    raceView: {
        height: '100%',
        width: '95%'

    },
    raceCard: {
        flexDirection: 'row',
        height: '75%',
        width: '100%',
        borderWidth: 2,
        marginBottom: '1%',
        borderRadius: 45
    },
    left: {
        width: '35%',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '10%'
    },
    right: {
        width: '65%',
        paddingLeft: '5%',
        justifyContent: 'space-around',
    },
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
        height: '40%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '10%',
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'red',
        width: '45%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textBtn: {
        fontSize: 18,
        fontWeight: 800,
        color: 'Brown',
        marginBottom: '5%'
    },
})
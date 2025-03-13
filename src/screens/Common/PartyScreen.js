import {
    StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity,
    KeyboardAvoidingView
} from "react-native";
import { Modal, SlideAnimation } from 'react-native-modals';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import axiosInstance from '@utils/axiosInstance';
import theme from '@theme';
import { Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window"); // Obtenir les dimensions de l'écran

export default function RoomScreen({ navigation, route }) {
    const { party_id } = route.params;
    const [partyInfo, setPartyInfo] = useState([]);
    const [modalSpellVisible, setModalSpellVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(`/parties/${party_id}`);
                setPartyInfo(response.data.party);
            } catch (error) {
                console.error("Error fetching party info:", error);
            }
        })();
    }, []);

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView behavior="padding" style={styles.container}>

                        {/* HEADER */}
                        <View style={styles.underheaderContainer}>
                            <TouchableOpacity style={styles.roomSettings}>
                                <FontAwesome name='cog' size={20} color={theme.colors.darkBrown} />
                            </TouchableOpacity>
                            <View style={styles.roomInfos}>
                                {partyInfo.admin && <Text style={styles.creatorRoomName}>{partyInfo.admin.username}</Text>}
                                <Text style={styles.roomName}>{partyInfo.name}</Text>
                                <Text style={styles.numberOfParticipants}>
                                    {partyInfo.participants?.length} Troll{partyInfo.participants?.length > 1 && `s`}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.playerList}>
                                <FontAwesome name='users' size={20} color={theme.colors.darkBrown} />
                            </TouchableOpacity>
                        </View>

                        {/* MESSAGE BOX */}
                        <View style={styles.messageBox}>
                            <Text>Messages are coming...</Text>
                        </View>

                        {/* MESSAGE INPUT */}
                        <View style={styles.underMessageBox}>
                            <TextInput
                                placeholder="Tape ton message ici !"
                                placeholderTextColor="gray"
                                multiline={true}
                                style={styles.input}
                            />
                            <View style={styles.buttons}>
                                <TouchableOpacity style={styles.sendButton}>
                                    <FontAwesome name='send' size={12} color='white' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.spellButton} onPress={() => setModalSpellVisible(true)}>
                                    <FontAwesome name='fire' size={15} color='white' />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* MODAL SPELL */}
                        <Modal
                            height={0.2}
                            width={1}
                            visible={modalSpellVisible}
                            modalAnimation={new SlideAnimation({
                                slideFrom: 'left',
                                useNativeDriver: true,
                            })}
                            onRequestClose={() => setModalSpellVisible(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.spellContainer}>
                                    <TouchableOpacity style={styles.spell} />
                                    <TouchableOpacity style={styles.spell} />
                                    <TouchableOpacity style={styles.spell} />
                                </View>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalSpellVisible(false)}>
                                    <Text style={styles.closeButtonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

    /* HEADER */
    underheaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        // backgroundColor: 'red',
    },
    roomSettings: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.lightBrown02,
    },
    roomInfos: {
        alignItems: 'center',
    },
    creatorRoomName: {
        color: theme.colors.darkBrown,
    },
    roomName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.darkBrown,
    },
    numberOfParticipants: {
        color: theme.colors.darkBrown,
    },
    playerList: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.lightBrown02,
    },

    /* MESSAGE BOX */
    messageBox: {
        flex: 3, // Prend 3 fois plus de place que les autres
        width: '100%',
        // backgroundColor: 'orange',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* MESSAGE INPUT */
    underMessageBox: {
        flexDirection: 'row',
        alignItems: 'center', // Centre verticalement
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        minHeight: 60, // Hauteur fixe mais pas trop grande
    },
    input: {
        height: 40, // Hauteur réduite
        flex: 1, // Prend l'espace disponible sans dépasser
        backgroundColor: theme.colors.lightBrown02,
        borderRadius: 20,
        paddingHorizontal: 15, // Ajout de marge interne pour le texte
        fontSize: 14, // Taille du texte réduite si besoin
        color: theme.colors.darkBrown,
    },
    buttons: {
        flexDirection: 'row',
        gap: 5,
        paddingLeft: 5,
    },
    sendButton: {
        width: 30,
        height: 30,
        backgroundColor: 'rgb(195, 157, 136)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    spellButton: {
        width: 30,
        height: 30,
        backgroundColor: theme.colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    /* MODAL */
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(180, 157, 136)',
        padding: 20,
        borderRadius: 10,
    },
    spellContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    spell: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgb(246, 89, 89)',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'rgb(246, 89, 89)',
        padding: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
    },
});


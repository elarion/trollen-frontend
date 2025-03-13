// Imports Components
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import TopHeader from '@components/TopHeader';
import { getSocket } from "@services/socketService";

// Imports Utils
import axiosInstance from '@utils/axiosInstance';

// Imports Icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Imports Hooks
import { useState, useEffect, useCallback } from "react";

// Imports Theme
import theme from '@theme';

const limit = 10;
export default function PortalScreen({ navigation }) {
    const [rooms, setRooms] = useState([]); // Stocke la liste des rooms
    const [page, setPage] = useState(1); // Suivi de la pagination
    const [loading, setLoading] = useState(false); // État de chargement
    const [hasMore, setHasMore] = useState(true); // Savoir s'il y a encore des données
    const [tag, setTag] = useState(''); // Recherche par tag

    // Charger les rooms par page
    // Utilisation de usecallback pour éviter les appels en boucle
    // Car par défaut, la fonction est recréée à chaque rendu
    // Et avec useCallback, elle est mémorisée donc pas recréée au rendu suivant
    // elle est utilisé par useEffect et FlatList
    const fetchRooms = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`/rooms/by-limit?page=${page}&limit=${limit}`);

            if (response.data.success === false) return;

            // Mise à jour de la liste des rooms
            const newRooms = response.data.rooms;
            setRooms(prevRooms => [...prevRooms, ...newRooms]);

            // Vérifier s'il y a encore des rooms à charger
            // Si le nombre de rooms chargées est inférieur à 25, il n'y a plus de rooms, logi
            if (newRooms.length < limit) {
                setHasMore(false);
            }

            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Erreur de récupération des rooms :", error);
        } finally {
            setLoading(false);
        }
    }, [loading, page, hasMore]); // Dépendances de la fonction pour éviter les appels en boucle

    // Charger la première page au montage
    useEffect(() => {
        const socket = getSocket();
        socket.on("newRoom", (newRoom) => {
            setRooms(prevRooms => [newRoom.room, ...prevRooms]);
        });

        fetchRooms();

        return () => {
            socket.off("newRoom");
        };
    }, []);

    // Fonction pour aller vers une room spécifique
    const goToRoom = (roomId) => {
        navigation.navigate('Room', { roomId });
    };

    // Fonction de rendu de chaque item dans FlatList
    const renderRoom = ({ item }) => (
        <View style={styles.room} key={item._id}>
            <View style={styles.inRoomLeft}>
                <Text style={styles.roomName}>{item.name}</Text>

                <TouchableOpacity style={styles.join} onPress={() => goToRoom(item._id)}>
                    <Text style={styles.textButton}>Join</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inRoomRight}>
                <View style={styles.rightUsernameAndJoin}>
                    <Text style={styles.username}>Crée par {item.admin?.username}</Text>
                    <Text style={styles.roomNumberOfParticipants}>{item.participants.length} participant{item.participants.length > 1 && 's'}</Text>
                </View>

                <Text style={styles.roomTag}>
                    {item.tags?.map((tag, i) => `#${tag.name}`).join(" ")}
                </Text>
            </View>
        </View >
    );

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />

                    {/* <View style={styles.placeholder}>
                        <TextInput
                            placeholder="Enter a tag here..."
                            placeholderTextColor="gray"
                            style={styles.place}
                            onChangeText={setTag}
                            value={tag}
                        />
                        <TouchableOpacity style={styles.bouton} onPress={() => setTag('')}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Search</Text>
                        </TouchableOpacity>
                    </View> */}

                    <View style={[styles.roomBox, { marginTop: 20 }]}>
                        <FlatList
                            data={rooms}
                            renderItem={renderRoom}
                            keyExtractor={(item) => item._id}
                            onEndReached={fetchRooms} // Charge plus de rooms quand on atteint la fin
                            onEndReachedThreshold={0.5} // Déclenche le chargement quand on est à 50% du bas
                            ListFooterComponent={loading && <ActivityIndicator size="small" color={theme.colors.darkBrown} />} // Affiche un loader en bas de la liste
                        />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, resizeMode: 'cover',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingVertical: 10,
    },
    placeholder: {
        flexDirection: "row",
        height: 65,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    bouton: {
        borderRadius: 30,
        width: '20%',
        height: '60%',
        backgroundColor: theme.colors.darkBrown08,
        justifyContent: 'center',
        alignItems: 'center',
        fontweight: 'bold',
    },
    roomBox: {
        flex: 1,
        //backgroundColor: 'blue',
        paddingHorizontal: 20,
        // paddingBottom: 50,
        justifyContent: 'top',
        alignItems: 'center',
        gap: '2%',
    },

    //STYLE DES CARTES ROOMS
    room: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginBottom: 20,
        width: '100%',
        height: 120,
        borderRadius: 10,
        padding: 10,
        backgroundColor: theme.colors.lightBrown02,
    },
    inRoomLeft: {
        flexDirection: 'column',
        justifyContent: "space-between",
        //backgroundColor: 'blue'
        width: '50%',
    },
    roomName: {
        fontSize: 18,
        color: theme.colors.darkBrown,
        fontWeight: 'bold',
    },
    roomTag: {
        fontStyle: 'italic',
    },
    roomNumberOfParticipants: {
    },
    inRoomRight: {
        // flexDirection: 'row',
        //backgroundColor: 'orange',
        width: '50%',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        // justifyContent: 'flex-end',
    },
    leftFavButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
        width: '20%',
    },
    rightUsernameAndJoin: {
        flexDirection: 'column',
        //backgroundColor: 'green',

        width: '80%',
        alignItems: 'flex-end',
        // justifyContent: 'space-around',
    },
    username: {
        //backgroundColor:'orange',
        // fontWeight: 'bold',
    },
    join: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.green,
        height: 40,
        width: '70%',
        borderRadius: 30,
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
    }

})
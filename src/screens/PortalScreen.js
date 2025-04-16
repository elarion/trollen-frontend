import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axiosInstance from '../utils/axiosInstance';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect, useCallback } from "react";

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
        fetchRooms();
    }, []);

    // Fonction pour aller vers une room spécifique
    const goToRoom = (room_id) => {
        navigation.navigate('Room', { room_id });
    };

    // Fonction de rendu de chaque item dans FlatList
    const renderRoom = ({ item }) => (
        <View style={styles.room} key={item._id}>
            <View style={styles.inRoomLeft}>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomTag}>
                    {item.tags?.map((tag, i) => `#${tag.name}`).join(" ")}
                </Text>
                <Text style={styles.roomNumberOfParticipants}>{item.participants.length} Trolls</Text>
            </View>
            <View style={styles.inRoomRight}>
                <View style={styles.rightUsernameAndJoin}>
                    <Text style={styles.username}>{item.admin?.username}</Text>
                    <TouchableOpacity style={styles.join} onPress={() => goToRoom(item._id)}>
                        <Text style={styles.textButton}>Join</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <Header
                        containerStyle={styles.header}
                        centerComponent={<Text style={styles.title}>Trollen</Text>}
                    />

                    <View style={styles.placeholder}>
                        <TextInput
                            placeholder="Enter a tag here..."
                            placeholderTextColor="gray"
                            style={styles.place}
                            onChangeText={setTag}
                            value={tag}
                        />
                        <TouchableOpacity style={styles.bouton} onPress={() => console.log("Recherche par tag:", tag)}>
                            <Text>Search</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.roomBox}>
                        <FlatList
                            data={rooms}
                            renderItem={renderRoom}
                            keyExtractor={(item) => item._id}
                            onEndReached={fetchRooms} // Charge plus de rooms quand on atteint la fin
                            onEndReachedThreshold={0.5} // Déclenche le chargement quand on est à 50% du bas
                            ListFooterComponent={loading && <ActivityIndicator size="small" color="white" />} // Affiche un loader en bas de la liste
                        />
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
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
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        fontweight: 'bold',
    },
    roomBox: {
        flex: 1,
        //backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingBottom: 50,
        justifyContent: 'top',
        alignItems: 'center',
        gap: '2%',
    },

    //STYLE DES CARTES ROOMS
    room: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginBottom: 10,
        width: '100%',
        height: 120,
        borderRadius: 10,
        backgroundColor: "white",
    },
    inRoomLeft: {
        flexDirection: 'column',
        justifyContent: "space-around",
        marginLeft: '2%',
        //backgroundColor: 'blue'
        width: '50%',
    },
    roomName: {

    },
    roomTag: {

    },
    roomNumberOfParticipants: {

    },
    inRoomRight: {
        flexDirection: 'row',
        //backgroundColor: 'orange',
        width: '46%',
        height: '100%',
        marginRight: '2%',
        justifyContent: 'flex-end',
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
        justifyContent: 'space-around',
    },
    username: {
        //backgroundColor:'orange',
        margin: 10,
    },
    join: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'brown',
        height: '30%',
        width: '70%',
        borderRadius: 30,
    },
    textButton: {
        color: 'white'

    }

})
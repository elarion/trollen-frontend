import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import TopHeader from '@components/TopHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from "@expo/vector-icons";
import axiosInstance from '@utils/axiosInstance';
import { useSelector } from 'react-redux'

export default function FriendsScreen() {
    const user = useSelector((state) => state.auth)
    const user_id = user.user?._id
    const [sendedFriendsList, setSendedFriendsList] = useState([]);
    const [receivedFriendsList, setReceivedFriendsList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    //console.log(friendsList)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axiosInstance.get(`/users_friends/sended/${user_id}`)
                setSendedFriendsList(response1.data.sended || [])
            } catch(error){
                /* console.error("error axios sent friends request", error) */
            }
            try {
                const response2 = await axiosInstance.get(`/users_friends/received/${user_id}`)
                setReceivedFriendsList(response2.data.received || [])
            } catch(error) {
                /* console.error("error axios received friends request", error) */
            }
            try {
                const response3 = await axiosInstance.get(`/users_friends/friends/${user_id}`)
                setFriendsList(response3.data.friends || [])
            } catch(error) {
                /* console.error("error axios received friends List", error) */
            }
        }
        fetchData()
        const interval = setInterval(fetchData,10000)
    }, []);

    const accept = async (requestId) => {
        const response = await axiosInstance.post(`/users_friends/accept/${requestId}`);

        if (!response.data.success) {
            console.log('Error while adding friend', response.data);
        }

        console.log('response in accept friend =>', response.data);

        console.log('friends list =>', friendsList);

        // On filter les pending friends
        const updatedReceivedList = receivedFriendsList.filter(friend => friend._id !== requestId);

        // On reset la friend list en attente
        setReceivedFriendsList(updatedReceivedList);

        // On ajoute le friend accepté aux friends déjà accepté
        // const newFriend = response.data.updatedRequest;
        setFriendsList(response.data.friends || friendsList);

    }

    const reject = async (requestId) => {
        try {
            await axiosInstance.post(`/users_friends/reject/${requestId}`);
            const updatedReceivedList = receivedFriendsList.filter(friend => friend._id !== requestId);
            setReceivedFriendsList(updatedReceivedList);
        } catch (error) {
            console.error("Erreur lors du rejet de l'invitation :", error);
        }
    }

    const removeFromFriends = async (friendId) => {
        try {
            await axiosInstance.delete(`/users_friends/${user_id}/${friendId}`);
            setFriendsList(prev => prev.filter(friend => friend._id !== friendId));
        } catch (error) {
            console.error("Erreur lors de la suppression de l''ami :", error);
        }
    };

    const sendedInvitation = sendedFriendsList.filter(data => data.status === 'pending').map((data, i) => {
        return (
            <View style={styles.pendingSendedFriendsCardBox} key={i}>
                <Text style={styles.textUsername} >{data.friend.username}</Text>
                <View style={styles.status}>
                    <Text style={styles.textStatus}>{data.status}</Text>
                </View>
            </View>
        );
    });

    const receivedInvitation = receivedFriendsList.filter(data => data.status === 'pending').map((data, i) => {
        return (
            <View style={styles.pendingReceivedFriendsCardBox} key={i}>
                <View style={styles.left}>
                    <Text style={styles.textUsername}>{data.user_2.username}</Text>
                </View>
                <View style={styles.right}>
                    <View style={styles.status}>
                        <Text style={styles.textStatus}>{data.status}</Text>
                    </View>
                    <TouchableOpacity onPress={() => accept(data._id)}>
                        <MaterialCommunityIcons name="check" size={40} color='#899E6A' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => reject(data._id)}>
                        <MaterialCommunityIcons name="close" size={40} color='#F65959' />
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    const friends = friendsList.map((data, i) => (
        <View style={styles.friendsCardBox} key={i}>
            <Text style={styles.textUsername}>{data.username}</Text>
            <TouchableOpacity onPress={() => removeFromFriends(data._id)}>
                <MaterialCommunityIcons name="delete-circle" size={40} color='#F65959' />
            </TouchableOpacity>
        </View>
    ));

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />
                    <View style={styles.friendsBox}>
                        <ScrollView contentContainerStyle={styles.itemsContainer}>
                            <View style={styles.pendingFriendsBox}>
                                <View>
                                    <Text style={styles.textPendingFriends}>Pending :</Text>
                                </View>
                                {sendedInvitation}
                                {receivedInvitation}
                            </View>
                            <View style={styles.friendsListBox}>
                                <View>
                                    <Text style={styles.textMyFriends}>My Friends :</Text>
                                </View>
                                {friends}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1, resizeMode: 'cover',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingVertical: 10,
    },
    itemsContainer: {
        height: '100%'
    },
    textUsername: {
        fontSize: 15,
        fontWeight: 800,
    },
    status: {
        borderWidth: 2,
        borderColor: 'rgb(74, 52, 57)',
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgb(188, 118, 26)'
    },
    textStatus: {
        color: 'white',
        fontSize: 15,
        fontWeight: 800,
    },
    textPendingFriends: {
        marginTop: 20,
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        marginBottom:10
    },
    pendingFriendsBox: {
        alignItems: 'center',
        gap: 7
    },
    pendingSendedFriendsCardBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgb(74, 52, 57)',
        borderRadius: 15,
        height: 60,
        width: '95%',
    },
    pendingReceivedFriendsCardBox: {
        flexDirection: 'row',
        borderWidth: 3,
        borderRadius: 15,
        height: 60,
        width: '95%',
        borderColor: 'rgb(74, 52, 57)',
    },
    left: {
        paddingLeft: 15,
        //borderWidth:2,
        height:'100%',
        width:'45%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    right: {
        flexDirection: 'row',
        paddingRight: 13,
        //borderWidth:2,
        height:'100%',
        width:'55%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textMyFriends: {
        marginTop: 20,
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        marginBottom:10
    },
    friendsListBox: {
        //justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    friendsCardBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 15,
        height: 60,
        width: '95%',
        borderColor: 'rgb(74, 52, 57)',
    },
});

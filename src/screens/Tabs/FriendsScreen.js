import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import TopHeader from '@components/TopHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '@utils/axiosInstance';
import { useSelector } from 'react-redux'

export default function FriendsScreen() {
    const user = useSelector((state) => state.auth)
    const user_id = user.user?._id
    const [sendedFriendsList, setSendedFriendsList] = useState([]);
    const [receivedFriendsList, setReceivedFriendsList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    console.log(friendsList)

    useEffect(() => {
        (async () => {
            const response1 = await axiosInstance.get(`/users_friends/sended/${user_id}`)
            setSendedFriendsList(response1.data.sended)
            const response3 = await axiosInstance.get(`/users_friends/friends/${user_id}`)
            setFriendsList(response3.data.friends)
            const response2 = await axiosInstance.get(`/users_friends/received/${user_id}`)
            setReceivedFriendsList(response2.data.received)
        })()
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
            <View style={styles.pendingFriendsCardBox} key={i}>
                <Text>{data.friend.username}</Text>
                <Text>{data.status}</Text>
            </View>
        );
    });

    const receivedInvitation = receivedFriendsList.filter(data => data.status === 'pending').map((data, i) => {
        return (
            <View style={styles.pendingFriendsCardBox} key={i}>
                <Text>{data.user_2.username}</Text>
                <Text>{data.status}</Text>
                <TouchableOpacity onPress={() => accept(data._id)}>
                    <MaterialCommunityIcons name="check" size={28} color='green' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => reject(data._id)}>
                    <MaterialCommunityIcons name="delete" size={28} color='red' />
                </TouchableOpacity>
            </View>
        );
    });

    const friends = friendsList.map((data, i) => (
        <View style={styles.friendsCardBox} key={i}>
            <Text>{data.username}</Text>
            <TouchableOpacity onPress={() => removeFromFriends(data._id)}>
                <MaterialCommunityIcons name="delete" size={28} color='red' />
            </TouchableOpacity>
        </View>
    ));

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />
                    <View style={styles.friendsBox}>
                        <View style={styles.pendingFriendsBox}>
                            <View>
                                <Text>Pending :</Text>
                            </View>
                            {sendedInvitation}
                            {receivedInvitation}
                        </View>
                        <View style={styles.friendsListBox}>
                            <View>
                                <Text>My Friends :</Text>
                            </View>

                            {friends}

                        </View>
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
    pendingFriendsBox: {
        //justifyContent: 'center',
        alignItems: 'center',
        //height:'50%'
    },
    pendingFriendsCardBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        height: 60,
        width: '95%'
    },
    friendsListBox: {
        //justifyContent: 'center',
        alignItems: 'center',
    },
    friendsCardBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        height: 60,
        width: '95%'
    },
});

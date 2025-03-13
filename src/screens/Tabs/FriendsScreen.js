import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import TopHeader from '@components/TopHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from "@expo/vector-icons";
import axiosInstance from '@utils/axiosInstance';
import { useSelector } from 'react-redux'

export default function FriendsScreen() {
    const user = useSelector((state) => state.auth)
    const user_id = user.user?._id
    const [sendedFriendsList, setSendedFriendsList] = useState([]);
    const [receivedFriendsList, setReceivedFriendsList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [selectedTab, setSelectedTab] = useState('friends');
    //console.log(friendsList)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axiosInstance.get(`/users_friends/sended/${user_id}`)
                console.log("Sended Friends:", response1.data);
                setSendedFriendsList(response1.data.sended || [])
            } catch (error) {
                console.error("error axios sent friends request", error)
            }
            try {
                const response2 = await axiosInstance.get(`/users_friends/received/${user_id}`)
                setReceivedFriendsList(response2.data.received || [])
            } catch (error) {
                console.error("error axios received friends request", error)
            }
            try {
                const response3 = await axiosInstance.get(`/users_friends/friends/${user_id}`)
                console.log("all Friends:", response3.data);
                setFriendsList(response3.data.friends || [])
            } catch (error) {
                /* console.error("error axios received friends List", error) */
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);

    }, []);

    const renderContent = () => {
        switch (selectedTab) {
            case 'friends':
                return friendsList
                    .map((data, i) => (
                        <View style={styles.friendsCardBox} key={i}>
                            <Text style={styles.textUsername}>{data.username}</Text>
                            <TouchableOpacity onPress={() => removeFromFriends(data._id)}>
                                <Icon name="account-off" size={30} color='#F65959' />
                            </TouchableOpacity>
                        </View>
                    ));
            case 'pending':
                return sendedFriendsList
                    .filter(data => data.status === 'pending')
                    .map((data, i) => (
                        <View style={styles.pendingSendedFriendsCardBox} key={i}>
                            <Text style={styles.textUsername}>{data.friend?.username}</Text>
                            <View style={styles.status}>
                                <Icon name="account-clock" size={30} color='#7391C9' />
                            </View>
                        </View>
                    ));
            case 'received':
                return receivedFriendsList
                    .filter(data => data.status === 'pending')
                    .map((data, i) => (
                        <View style={styles.pendingReceivedFriendsCardBox} key={i}>
                            <View style={styles.left}>
                                <Text style={styles.textUsername}>{data.user_2.username}</Text>
                            </View>
                            <View style={styles.right}>
                                <TouchableOpacity onPress={() => accept(data._id)}>
                                    <Icon name="check" size={30} color='#899E6A' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => reject(data._id)}>
                                    <Icon name="close" size={30} color='#F65959' />
                                </TouchableOpacity>
                            </View>
                        </View>

                    ));


        }
    }

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
            console.error("Erreur lors de la suppression de l'ami :", error);
        }
    };

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.background}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            onPress={() => setSelectedTab('friends')}
                            style={styles.tabButton}
                        >
                            <Text style={[styles.tabText, selectedTab === 'friends' && styles.activeTabText]}>Friends</Text>
                            {selectedTab === 'friends' && <View style={styles.indicator} />}
                        </TouchableOpacity>

                        <TouchableOpacity
    onPress={() => setSelectedTab('received')}
    style={styles.tabButton}
>
    <Text style={[styles.tabText, selectedTab === 'received' && styles.activeTabText]}>Received</Text>
    {receivedFriendsList.filter(data => data.status === 'pending').length > 0 && (
        <View style={{ 
            fontSize: 10, 
            position: 'absolute', 
            top: -1, 
            right: -16, 
            backgroundColor: '#7391C9', 
            height: 20, 
            width: 20, 
            borderRadius: 10, 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            <Text style={{ fontWeight: 'bold', fontSize: 10, color: 'white' }}>
                {receivedFriendsList.filter(data => data.status === 'pending').length > 99 ? '99+' : receivedFriendsList.filter(data => data.status === 'pending').length}
            </Text>
        </View>
    )}
    {selectedTab === 'received' && <View style={styles.indicator} />}
</TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedTab('pending')}
                            style={styles.tabButton}
                        >
                            <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>Pending</Text>
                            {selectedTab === 'pending' && <View style={styles.indicator} />}
                        </TouchableOpacity>

                    </View>
                    <ScrollView contentContainerStyle={styles.content}>{renderContent()}</ScrollView>
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
        flex: 1,
        resizeMode: 'cover',
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
        color : '#55453F',
        fontWeight: '600',
    },
    status: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,

    },
  
    pendingSendedFriendsCardBox: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        paddingRight: 30,
        paddingLeft: 30,
        alignItems: 'center',
        borderRadius: 100,
        height: 60,
        width: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    pendingReceivedFriendsCardBox: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        borderRadius: 100,
        height: 60,
        width: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    left: {
        paddingLeft: 15,
        //borderWidth:2,
        height: '100%',
        width: '45%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    right: {
        flexDirection: 'row',
        paddingLeft: 50,
        height: '100%',
        width: '55%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textMyFriends: {
        marginTop: 20,
        color: 'rgb(188, 118, 26)',
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 10
    },
    friendsListBox: {
        //justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    friendsCardBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingRight: 30,
        paddingLeft: 30,
        alignItems: 'center',
        borderRadius: 100,
        height: 60,
        width: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    tabs: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: 10,
    },
    tabButton: {
        position: 'relative',
        paddingVertical: 8,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        color: '#55453F',
    },
    activeTabText: {
        color: '#C39D88',
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        bottom: -10,
        height: 3,
        width: '100%',
        backgroundColor: '#55453F',
    },
    background: { flex: 1 },
    container: { flex: 1 },
    content: { alignItems: 'center', padding: 10 },
});

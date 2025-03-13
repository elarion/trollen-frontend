import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Modal, SlideAnimation } from "react-native-modals";
import { FontAwesome } from "@expo/vector-icons";
import axiosInstance from '@utils/axiosInstance';
import { useSelector } from "react-redux";
import UserReportModal from "./UserReportModal";

import theme from '@theme';

const UsersModal = ({ modalUserRoomVisible, setModalUserRoomVisible, participants }) => {
    const { user } = useSelector(state => state.auth);
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [userToReport, setUserToReport] = useState(null);
    const [sortedParticipants, setSortedParticipants] = useState(participants);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const fetchFriendList = async () => {
            try {
                const response = await axiosInstance.get(`/users_friends/friends/${user._id}`)
                setFriendsList(response.data.friends || []);
            } catch (error) {
                console.error("error axios received friends List", error);
            }
        }

        if (modalUserRoomVisible) {
            fetchFriendList();
        }
    }, [modalUserRoomVisible]);

    // useEffect(() => {
    //     if (participants) {
    //         console.log("participants", participants);
    //         // socket id peut être et on veut trier quand meme avec le socket_id

    //         setSortedParticipants(participants.sort((a, b) => (a.user?.socket_id === null) - (b.user?.socket_id === null)));
    //     }
    // }, [participants]);

    const handleAddFriend = async (item) => {
        try {
            const response = await axiosInstance.post(`/users/friends`, {
                user_1: user._id,
                targetUserId: item.user._id,
            });
            console.log("Friends added", response.data);
            setFriendsList([...friendsList, item.user]);
        } catch (error) {
            console.error("Error with adding friends:", error);
        }
    };

    const isFriend = (participant) => {
        return friendsList.some(friend => friend._id === participant.user._id);
    };

    const handleReportFriend = (item) => {
        setUserToReport(item);
        setModalReportVisible(true);
    };

    return (
        <Modal
            style={[styles.modal, { opacity: modalUserRoomVisible ? 1 : 0.5 }]}
            height={0.9}
            width={0.8}
            onSwipeOut={() => setModalUserRoomVisible(false)}
            swipeDirection={["right"]}
            modalAnimation={new SlideAnimation({
                initialValue: 0,
                slideFrom: 'right',
                useNativeDriver: true,
            })}
            visible={modalUserRoomVisible}
            onRequestClose={() => setModalUserRoomVisible(false)}
            modalStyle={{ backgroundColor: "transparent" }}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => setModalUserRoomVisible(false)} style={[styles.closeButton, { position: 'absolute', top: 20, right: 20, zIndex: 1000 }]}>
                    <FontAwesome name="times" size={24} color={theme.colors.darkBrown} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{participants.length} members</Text>


                <FlatList
                    data={participants}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        (
                            <View style={styles.inputSection}>
                                <View style={styles.username}><View style={[styles.statusIndicator, { backgroundColor: item.user.socket_id ? theme.colors.green : theme.colors.red }]} /><Text>{item.user.username === user.username ? 'You' : item.user.username}</Text></View>

                                {item.user._id !== user._id && <View style={styles.actions}>
                                    {!isFriend(item) && (
                                        <TouchableOpacity onPress={() => handleAddFriend(item)} style={styles.addButton}>
                                            <FontAwesome name="user-plus" size={20} color="#7391C9" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => handleReportFriend(item)} style={styles.reportButton}>
                                        <FontAwesome name="flag" size={15} color="#F65959" />
                                    </TouchableOpacity>
                                </View>}
                            </View>
                        )
                    )}
                    contentContainerStyle={styles.flatListContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>No users in this room</Text>}
                />
            </View>
            {
                userToReport && (
                    <UserReportModal

                        visible={modalReportVisible}
                        onClose={() => setModalReportVisible(false)}
                        userToReport={userToReport}
                        onReport={(user) => {
                            console.log("Utilisateur signalé:", user);
                            setModalReportVisible(false);
                        }}
                    />
                )
            }
        </Modal >
    );
};

const styles = {
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",

    },
    modalContainer: {
        flex: 1,
        width: "80%",
        height: "80%",
        backgroundColor: "#F0E9E0",
        opacity: 0.9,
        padding: 20,
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        alignSelf: "flex-end",
        justifyContent: "flex-start",
    },

    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    modalTitle: {
        // alignSelf: "flex-end",
        fontSize: 20,
        fontWeight: "bold",
        color: "#55453F",
        marginBottom: 20,
        // marginLeft: 4,
    },
    inputSection: {
        padding: 12,
        backgroundColor: '#F8F8F8',
        borderRadius: 100,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        // borderLeftWidth: 3,  
        // borderLeftColor: '#55453F', 
        // borderRadius: 100,
        // borderColor: '#55453F',
        // borderWidth: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
        color: '#55453F',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    statusIndicator: {
        marginTop: 3,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addButton: {
        marginLeft: 15,
        padding: 6,
    },
    reportButton: {
        padding: 6,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        fontStyle: "italic",
    }
};

export default UsersModal;

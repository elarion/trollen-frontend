import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Modal, SlideAnimation } from "react-native-modals";
import { FontAwesome } from "@expo/vector-icons";
import axiosInstance from '@utils/axiosInstance';
import { useSelector } from "react-redux";
import UserReportModal from "./UserReportModal";

const UsersModal = ({ modalUserRoomVisible, setModalUserRoomVisible, participants }) => {
    const { user } = useSelector(state => state.auth);
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [userToReport, setUserToReport] = useState(null);

    const handleAddFriend = async (item) => {
        try {
            const response = await axiosInstance.post(`/users/friends`, {
                user_1: user._id,
                targetUserId: item.user._id,
            });
            console.log("Friends added", response.data);
        } catch (error) {
            console.error("Erreur lors de la création d'amis:", error);
        }
    };

    const handleReportFriend = (item) => {
        setUserToReport(item);
        setModalReportVisible(true);
    };

    return (
        <Modal
            style={[styles.modal, { opacity: modalUserRoomVisible ? 1 : 0.5 }]}
            height={1}
            width={0.6}
            onSwipeOut={() => setModalUserRoomVisible(false)}
            swipeDirection={["right"]}
            modalAnimation={new SlideAnimation({
                initialValue: 0,
                slideFrom: 'right',
                useNativeDriver: true,
            })}
            visible={modalUserRoomVisible}
            onRequestClose={() => setModalUserRoomVisible(false)}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => setModalUserRoomVisible(false)} style={styles.closeButton}>
                    <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Users</Text>
                
               
                <FlatList
                    data={participants}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.inputSection}>
                            <Text style={styles.username}>{item.user.username}</Text>

                            
                            <View style={[styles.statusIndicator, { backgroundColor: item.status === "online" ? "#00FF00" : "#FF4D4D" }]} />

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => handleAddFriend(item)} style={styles.addButton}>
                                    <FontAwesome name="user-plus" size={20} color="#7391C9" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleReportFriend(item)} style={styles.reportButton}>
                                    <FontAwesome name="flag" size={15} color="#F65959" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.flatListContainer} 
                    ListEmptyComponent={<Text style={styles.emptyText}>No users in this room</Text>} 
                />
            </View>
            {userToReport && (
                <UserReportModal
                
                    visible={modalReportVisible}
                    onClose={() => setModalReportVisible(false)}
                    userToReport={userToReport}
                    onReport={(user) => {
                        console.log("Utilisateur signalé:", user);
                        setModalReportVisible(false);
                    }}
                />
            )}
        </Modal>
    );
};

const styles = {
    modal: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#F0E9E0",
        padding: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        paddingBottom: 0, 
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#55453F",
        marginBottom: 20,
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
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 15, 
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

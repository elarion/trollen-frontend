import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const UsersModal = ({ modalUserRoomVisible, setModalUserRoomVisible, participants }) => {
    const handleAddFriend = (item) => {
        
        console.log("Ajouter ami:", item);
    };
    const handleReportFriend = (item) => {
        
        console.log("Report friend:", item);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalUserRoomVisible}
            onRequestClose={() => setModalUserRoomVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setModalUserRoomVisible(false)}>
                        <FontAwesome name="times" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Users</Text>
                    <FlatList
                        data={participants}
                        keyExtractor={(item) => item._id} 
                        renderItem={({ item }) => (
                            <View style={styles.inputSection} key={item._id}>
                                <Text style={styles.modalTitle}>{item.user.username}</Text>
                                
                                <TouchableOpacity onPress={() => handleAddFriend(item)}>
                                    <FontAwesome name="exclamation-circle" size={24} color="red" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAddFriend(item)}>
                                    <FontAwesome name="user-plus" size={24} color="blue" />
                                </TouchableOpacity>
                               
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    modalContainer: {
        width: "60%",
        height: "100%",
        backgroundColor: "#F0E9E0",
        padding: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginBottom: 20,
    },
    inputSection: {
        padding: 10,
        backgroundColor: 'lightgrey',
        marginBottom: 5,
        flexDirection: 'row',  
        justifyContent: 'space-between', 
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
};

export default UsersModal;

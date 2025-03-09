// Imports Hooks
import React, { useState } from 'react';

// Imports Components
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LobbyModalRoom from '@components/modals/LobbyModalRoom';
import { Portal } from '@components/Portal';
import TopHeader from '@components/TopHeader';

// Imports Store
import { logoutUser } from '@store/authSlice';
import { useDispatch } from 'react-redux';

// Imports Icons

// Imports Theme
import theme from '@theme';

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    const handleCreateRoom = (roomData) => {
        console.log("Room Data:", roomData);
    };

    const handleLogout = async () => {
        await dispatch(logoutUser()).unwrap(); // Attendre la fin du logout

        // navigation.reset sert à réinitialiser la pile de navigation pour empêcher le retour en arrière du retour en arrière
        navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }], // Rediriger et empêcher le retour en arrière
        });
    };

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <TopHeader />

                    <View style={styles.portalBox}>

                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                            <Portal portal="portal-4" />
                            <Portal portal="portal-2" />
                            <Portal portal="portal-3" />
                        </View>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Hazard ROOM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Create Party</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.createRoomBtn, styles.button]} onPress={() => setModalVisible(true)}>
                            <Text style={styles.textCreateBtn}>Join Party</Text>
                        </TouchableOpacity>

                        <Text onPress={handleLogout}>logout</Text>

                        <LobbyModalRoom visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={handleCreateRoom} />
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
        // position: 'relative',
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    portalBox: {
        marginTop: 20, alignItems: 'center', height: '50%'
    },
    createRoomBtn: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 10, width: '40%', alignItems: 'center'
    },
    textCreateBtn: { color: 'white' },
    button: {
        backgroundColor: '#e8be4b', padding: 10, borderRadius: 10, width: '40%', alignItems: 'center', marginBottom: 10,
    }
});

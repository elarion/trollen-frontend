import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function LobbyScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} >
                <View styles={styles.portalBox}>
                    <TouchableOpacity style={styles.roomCreationBtn} onPress={() => goToCreationRoom()}>
                        <Text style={styles.textRoomCreationBtn}>ROOM CREATION</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roomListBtn} onPress={() => goToRoomList()}>
                        <Text style={styles.textRoomListBtn}>ROOM LIST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.hazardRoomBtn} onPress={() => goToHazardRoom()}>
                        <Text style={styles.textHazardRoomBtn}>HAZARD ROOM</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    portalBox: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20, // Added gap between buttons
    },
    roomCreationBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textRoomCreationBtn: {
        color: 'white',
    },
    roomListBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textRoomListBtn: {
        color: 'white',
    },
    hazardRoomBtn: {
        backgroundColor: '#e8be4b',
        padding: 10,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textHazardRoomBtn: {
        color: 'white',
    },
})
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';

export default function LobbyScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} >
                <Header 
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Trollen', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />
                <View style={styles.portalBox}>
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
        //justifyContent: 'center',
    },
    portalBox: {
        marginTop: '20%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '50%',
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
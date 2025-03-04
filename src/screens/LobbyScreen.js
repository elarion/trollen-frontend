import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function LobbyScreen({ navigation }) {

    const goToSettings = () => {
        navigation.navigate('Settings');
    }
    const goToNews = () => {
        navigation.navigate('News');
    }
    const goToProfile = () => {
        navigation.navigate('Profile');
    }
    const goToGrimoire = () => {
        navigation.navigate('Grimoire');
    }
    const goToCreationRoom = () => {
        console.log('Go to Creation Room');
    }
    const goToRoomList = () => {
        console.log('Go to Room List');
    }
    const goToHazardRoom = () => {
        console.log('Go to Hazard Room');
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <Header
                        containerStyle={styles.header}
                        leftComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToSettings}>
                                    <FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToNews}>
                                    <FontAwesome name='newspaper-o' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
                        centerComponent={
                            <View>
                                <Text style={styles.title}>Trollen</Text>
                            </View>
                        }
                        rightComponent={
                            <View style={styles.headerButtons}>
                                <TouchableOpacity onPress={goToProfile}>
                                    <FontAwesome name='user' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goToGrimoire}>
                                    <FontAwesome name='book' size={30} color='rgb(239, 233, 225)' />
                                </TouchableOpacity>
                            </View>
                        }
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
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    )
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
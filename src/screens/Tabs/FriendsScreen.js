import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import TopHeader from '@components/TopHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function FriendsScreen() {
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
                            <View style={styles.pendingFriendsCardBox}>
                                <Text>Jean-Jacques</Text>
                                <Text>Pending</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                                    <MaterialCommunityIcons name="check" size={28} color='green' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                                    <MaterialCommunityIcons name="delete" size={28} color='red' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.friendsListBox}>
                            <View>
                                <Text>My Friends :</Text>
                            </View>
                            <View style={styles.friendsCardBox}>
                                <Text>Jean-Jacques</Text>
                                <Text>Friends</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                                    <MaterialCommunityIcons name="delete" size={28} color='red' />
                                </TouchableOpacity>
                            </View>
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

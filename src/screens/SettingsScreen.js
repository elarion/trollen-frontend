import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from "react-native"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import CustomHeader from "../components/CustomHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function SettingsScreen({ navigation }) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ImageBackground source={require('../../assets/background/background.png')} style={styles.backgroundImage}>
                    <CustomHeader navigation={navigation} />
                    <View style={styles.settingsBox}>
                        {/* LES SETTINGS */}
                        <Text>LES SETTINGS</Text>
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
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    settingsBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
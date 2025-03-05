import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"

export default function SettingsScreen() {
    return (
        <View styles={StyleSheet.container}>
           <Text>Settings Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
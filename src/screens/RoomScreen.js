import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"

export default function RoomScreen() {
    return (
        <View styles={StyleSheet.container}>
           <Text>Room Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native"

export default function NewsScreen() {
    return (
        <View styles={StyleSheet.container}>
           <Text>News Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function CustomHeader({navigation}) {
    return (
        <Header
            containerStyle={styles.header}
            leftComponent={
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('News')}>
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
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <FontAwesome name='user' size={30} color='rgb(239, 233, 225)' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                        <FontAwesome name='book' size={30} color='rgb(239, 233, 225)' />
                    </TouchableOpacity>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgb(74, 52, 57)',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
    },
    title: {
        color: 'rgb(239, 233, 225)',
        fontSize: 30,
        fontWeight: 800,
    },
})
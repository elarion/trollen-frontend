import React from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axiosInstance from '@utils/axiosInstance';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';

export default function PartyLoadingScreen({ navigation, route }) {
    const [player, setPlayer] = useState([1, 2]); // A modifier

    const { party_id } = route.params;
    if (player.length >= 3) {
        return (
            <ImageBackground source={require('@assets/background/background.png')} style={[styles.backgroundImage, { backgroundColor: 'transparent' }]}>
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container} edges={['top', 'left']}>
                        {/* <View style={styles.btn}>
                            {<Text style={styles.btnText}>Leave the queue and return to Lobby</Text>}
                            <TouchableOpacity onPress={() => navigation.navigate('Lobby')} >
                                <MaterialCommunityIcons name="door-open" size={28} color={'red'} />
                            </TouchableOpacity>
                        </View> */}
                        <View style={styles.countdown}>
                            <Text>The Game Will Begin Soon:</Text>
                            <CountdownCircleTimer
                                isPlaying
                                duration={15}
                                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                colorsTime={[7, 5, 2, 0]}
                                onComplete={() => {
                                    navigation.navigate('Party', { party_id }); // Redirection à la fin du Timer
                                }}
                            >
                                {({ remainingTime }) => <Text>{remainingTime}</Text>}
                            </CountdownCircleTimer>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ImageBackground >
        )
    }

    return (
        <ImageBackground source={require('@assets/background/background.png')} style={[styles.backgroundImage, { backgroundColor: 'transparent' }]}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'left']}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>Leave the queue and return to Lobby</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LobbyHome')} >
                            <MaterialCommunityIcons name="door-open" size={28} color={'red'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gameView}>
                        <View >
                            <Text style={styles.gameTitle}>WordToWord</Text>
                        </View>
                        <View style={styles.waitingBox}>
                            <View style={styles.message}>
                                <Text style={styles.waitingText}>Waiting for Trolls :</Text>
                                <Text style={styles.number}>2/6</Text>
                            </View>
                            <View style={styles.participants}>
                                <Text style={styles.participantName}>Jean has join the game</Text>
                                <Text>Jacques has join the game</Text>
                            </View>
                        </View>
                    </View>

                </SafeAreaView>
            </SafeAreaProvider>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        paddingVertical: 10,

        //
        gap: 50
    },
    btn: {
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    btnText: {
        fontSize: 15,
        color: 'rgb(188, 118, 26)',
        fontWeight: 600,
    },
    gameView: {
        alignItems: 'center',
        gap: 20
    },
    countdown: {
        alignItems: 'center',
        justifyContent:'center',
        height:'100%',
        gap: 20,
    },
    gameTitle: {
        fontSize: 30,
        color: 'rgb(74, 52, 57)',
        fontWeight: 800,

    },
    waitingBox: {
        height: '70%',
        width: '80%',
        borderWidth: 2,
        borderRadius: 25,
        gap: 20
    },
    waitingText: {
        fontSize: 15,
        fontWeight: 600
    },
    number: {
        fontSize: 15,
        fontWeight: 800
    },
    message: {
        marginTop: '10%',
        alignItems: 'center',
        gap: 10
    },
    participants: {
        marginTop: '5%',
        gap: 10,
        paddingLeft: 20,
    },
    participantName: {
        fontSize: 15,
        fontWeight: 600,
    }
})


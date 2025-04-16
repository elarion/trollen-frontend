// Imports hooks
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

// Imports components
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Header } from 'react-native-elements';

// Imports icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Imports theme
import theme from '@theme';

const TopHeader = () => {
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                {/* LEFT SIDE */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                        <Image source={require('@assets/grimoire.png')} style={[styles.headerIcon, { width: 22, height: 22, tintColor: theme.colors.darkBrown }]} />
                        {/* <MaterialCommunityIcons name="book-outline" size={28} color={theme.colors.darkBrown} /> */}
                    </TouchableOpacity>
                </View>

                {/* CENTER */}
                <View style={{ alignItems: 'center' }}>
                    {/* <Image source={require('@assets/logo.png')} style={{ width: 40, height: 40, tintColor: theme.colors.darkBrown }} /> */}
                    <Text style={styles.title} onPress={() => navigation.navigate(route.name)}>Trollen</Text>
                    {/* <Image source={require('@assets/logo.png')} style={{ width: 40, height: 40, tintColor: theme.colors.darkBrown }} /> */}
                </View>

                {/* RIGHT SIDE */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image source={require('@assets/profile.png')} style={[styles.headerIcon, { width: 22, height: 22, tintColor: theme.colors.darkBrown }]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 70,
        // position: 'absolute',
        paddingHorizontal: 20,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.lightBrown02,
        borderRadius: 100,
        // alignItems: 'center',
        // paddingHorizontal: 30,
        // paddingVertical: 10,
    },
    title: {
        color: theme.colors.darkBrown,
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 20,
    },
});

export default TopHeader;

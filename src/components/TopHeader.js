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
        // <Header
        //     containerStyle={styles.header}
        //     leftComponent={
        //         <View style={styles.headerButtons}>
        //             <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        //                 <FontAwesome name='cog' size={30} color='rgb(239, 233, 225)' />
        //             </TouchableOpacity>
        //             <TouchableOpacity onPress={() => navigation.navigate('News')}>
        //                 <FontAwesome name='newspaper-o' size={30} color='rgb(239, 233, 225)' />
        //             </TouchableOpacity>
        //         </View>
        //     }
        //     centerComponent={
        //         <View>
        //             <Text style={styles.title}>Trollen</Text>
        //         </View>
        //     }
        //     rightComponent={
        //         <View style={styles.headerButtons}>
        //             <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        //                 <FontAwesome name='user' size={30} color='rgb(239, 233, 225)' />
        //             </TouchableOpacity>
        //             <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
        //                 <FontAwesome name='book' size={30} color='rgb(239, 233, 225)' />
        //             </TouchableOpacity>
        //         </View>
        //     }
        // />
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                {/* LEFT SIDE */}
                <View style={styles.headerButtons}>
                    {/*  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <MaterialCommunityIcons name="cog-outline" size={28} color={theme.colors.darkBrown} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('News')}>
                        <MaterialCommunityIcons name="newspaper-variant-outline" size={28} color={theme.colors.darkBrown} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => navigation.navigate('Grimoire')}>
                        <Image source={require('@assets/grimoire.png')} color={theme.colors.darkBrown} style={[styles.headerIcon, { width: 28, height: 28, tintColor: theme.colors.darkBrown }]} />
                        {/* <MaterialCommunityIcons name="book-outline" size={28} color={theme.colors.darkBrown} /> */}
                    </TouchableOpacity>
                </View>

                {/* CENTER */}
                <Text style={styles.title} onPress={() => navigation.navigate(route.name)}>Trollen</Text>

                {/* RIGHT SIDE */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image source={require('@assets/profile.png')} color={theme.colors.darkBrown} style={[styles.headerIcon, { width: 28, height: 28, tintColor: theme.colors.darkBrown }]} />
                        {/* <MaterialCommunityIcons name="account-outline" size={28} color={theme.colors.darkBrown} /> */}
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 60,
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
        height: 60,
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

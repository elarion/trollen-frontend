import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserData } from '@store/authSlice';
import AuthStack from './AuthStack';
import TabNavigator from './TabNavigator';
import TopHeader from '@components/TopHeader';
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

/**
 * RootNavigator is the main navigator of the app.
 * It is used to navigate between the different screens of the app.
 * It is also used to handle the authentication of the user.
 * It is used to handle the loading of the user data.
 * It is used to handle the error of the user data.
 */
const RootNavigator = () => {
    const dispatch = useDispatch();
    const { user, token, refreshToken, loading } = useSelector(state => state.auth);
    console.log('RootNavigator => User =>', user);
    console.log('RootNavigator => Token =>', token);
    console.log('RootNavigator => Refresh Token =>', refreshToken);
    // const [loading, setLoading] = useState(true);
    // const [token, setToken] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             // const token = await SecureStore.getItemAsync("accessToken");
    //             console.log('token =>', token);

    //             console.log('Loading user data');
    //             // token && await dispatch(loadUserData()).unwrap();
    //         } catch (err) {
    //             if (err.message === "No active session") {
    //                 console.log('In RootNavigator =>', err.message);
    //             } else {
    //                 console.error("Erreur chargement des données utilisateur:", err);
    //             }
    //         } finally {
    //             // setInitialLoading(false);
    //         }
    //     })();
    // }, []);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const token = await SecureStore.getItemAsync("accessToken");
    //             setToken(token);

    //             !token && await dispatch(loadUserData()).unwrap();
    //         } catch (err) {
    //             console.log("Erreur de chargement des données utilisateur :", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     })();
    // }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {/* {token && <TopHeader />} */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name="TabNavigator" component={TabNavigator} /> */}

                {token ? (
                    <>
                        <Stack.Screen name="TabNavigator" component={TabNavigator} />
                        <Stack.Screen name="Auth" component={AuthStack} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Auth" component={AuthStack} />
                        <Stack.Screen name="TabNavigator" component={TabNavigator} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
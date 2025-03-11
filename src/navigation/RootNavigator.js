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

const RootNavigator = () => {
    const { user } = useSelector(state => state.auth);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 100);
    // }, []);

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }

    return (
        <NavigationContainer>
            {/* {token && <TopHeader />} */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name="TabNavigator" component={TabNavigator} /> */}

                {user ? (
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
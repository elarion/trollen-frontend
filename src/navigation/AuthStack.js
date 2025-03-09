import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from './screens';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen {...SCREENS.AUTH.SIGN_IN} />
        <Stack.Screen {...SCREENS.AUTH.CHARACTER_CREATION} />
    </Stack.Navigator>
);

export default AuthStack;

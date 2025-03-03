import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './src/screens/SignInScreen';
import CharactereCreationScreen from './src/screens/CharacterCreationScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import PortalScreen from './src/screens/PortalScreen';
import RoomScreen from './src/screens/RoomScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import * as Linking from 'expo-linking';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Lobby" component={LobbyScreen} />
      <Tab.Screen name="Portal" component={PortalScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const redirectUrl = Linking.createURL('/');
  console.log(redirectUrl);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CharacterCreation" component={CharactereCreationScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
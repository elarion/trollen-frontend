import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//import * as Linking from 'expo-linking';

import SignInScreen from './src/screens/SignInScreen';
import CharactereCreationScreen from './src/screens/CharacterCreationScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import PortalScreen from './src/screens/PortalScreen';
import RoomScreen from './src/screens/RoomScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import GrimoireScreen from './src/screens/GrimoireScreen';
import NewsScreen from './src/screens/NewsScreen';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './src/store/user';

const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LobbyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} >
    <Stack.Screen name="LobbyMain" component={LobbyScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="News" component={NewsScreen} />
    <Stack.Screen name="Grimoire" component={GrimoireScreen} />
    
  </Stack.Navigator>
);

const PortalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PortalMain" component={PortalScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="News" component={NewsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Grimoire" component={GrimoireScreen} />
    <Stack.Screen name="Room" component={RoomScreen}/>
  </Stack.Navigator>
);

const FriendsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FriendsMain" component={FriendsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="News" component={NewsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Grimoire" component={GrimoireScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Lobby') {
          iconName = 'shield';
        } else if (route.name === 'Portal') {
          iconName = 'connectdevelop';
        } else if (route.name === 'Friends') {
          iconName = 'handshake-o';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'rgb(189, 159, 138)',
      tabBarInactiveTintColor: '#b2b2b2',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'rgb(74, 52, 57)',
        paddingTop: 12,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0,
        elevation: 0,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    })}>
      <Tab.Screen name="Lobby" component=/* {LobbyScreen} */ {LobbyStack} />
      <Tab.Screen name="Portal" component=/* {PortalStack} */ {PortalStack} />
      <Tab.Screen name="Friends" component=/* {FriendsStack} */{FriendsStack} />
      {/* <Stack.Screen name="TopTabs" component={TopTabNavigator} /> */}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="CharacterCreation" component={CharactereCreationScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
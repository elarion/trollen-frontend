// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// //import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { ModalPortal } from 'react-native-modals';
// import { View, ActivityIndicator } from 'react-native';
// //import * as Linking from 'expo-linking';

// import SignInScreen from './src/screens/SignInScreen';
// import CharactereCreationScreen from './src/screens/CharacterCreationScreen';
// import LobbyScreen from './src/screens/LobbyScreen';
// import PortalScreen from './src/screens/PortalScreen';
// import RoomScreen from './src/screens/RoomScreen';
// import SettingsScreen from './src/screens/SettingsScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import FriendsScreen from './src/screens/FriendsScreen';
// import GrimoireScreen from './src/screens/GrimoireScreen';
// import NewsScreen from './src/screens/NewsScreen';

// // import { configureStore } from '@reduxjs/toolkit';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// // import user from './src/store/user';
// import { store, persistor } from './src/configs/redux'; // Importation du store et du persistor
// import { useSelector, useDispatch } from 'react-redux';
// import { loadUserData } from './src/store/authSlice';


// // const store = configureStore({
// //   reducer: { user },
// // });

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const LobbyStack = () => (
// 	<Stack.Navigator screenOptions={{ headerShown: false }} >
// 		<Stack.Screen name="LobbyMain" component={LobbyScreen} />
// 		<Stack.Screen name="Settings" component={SettingsScreen} /* options={{
//       animation: 'fade',
//       transitionSpec: {
//         open: { animation: 'timing', config: { duration: 0 } },
//         close: { animation: 'timing', config: { duration: 0 } }
//       }
//     }} */ />
// 		<Stack.Screen name="Profile" component={ProfileScreen} />
// 		<Stack.Screen name="News" component={NewsScreen} />
// 		<Stack.Screen name="Grimoire" component={GrimoireScreen} />
// 		<Stack.Screen name="Room" component={RoomScreen} />
// 	</Stack.Navigator>
// );

// const PortalStack = () => (
// 	<Stack.Navigator screenOptions={{ headerShown: false }}>
// 		<Stack.Screen name="PortalMain" component={PortalScreen} />
// 		<Stack.Screen name="Settings" component={SettingsScreen} />
// 		<Stack.Screen name="News" component={NewsScreen} />
// 		<Stack.Screen name="Profile" component={ProfileScreen} />
// 		<Stack.Screen name="Grimoire" component={GrimoireScreen} />
// 		<Stack.Screen name="Room" component={RoomScreen} />
// 	</Stack.Navigator>
// );

// const FriendsStack = () => (
// 	<Stack.Navigator screenOptions={{ headerShown: false }}>
// 		<Stack.Screen name="FriendsMain" component={FriendsScreen} />
// 		<Stack.Screen name="Settings" component={SettingsScreen} />
// 		<Stack.Screen name="News" component={NewsScreen} />
// 		<Stack.Screen name="Profile" component={ProfileScreen} />
// 		<Stack.Screen name="Grimoire" component={GrimoireScreen} />
// 	</Stack.Navigator>
// );

// const TabNavigator = () => {
// 	return (
// 		<Tab.Navigator screenOptions={({ route }) => ({
// 			tabBarIcon: ({ color, size }) => {
// 				let iconName = '';

// 				if (route.name === 'Lobby') {
// 					iconName = 'shield';
// 				} else if (route.name === 'Portal') {
// 					iconName = 'connectdevelop';
// 				} else if (route.name === 'Friends') {
// 					iconName = 'handshake-o';
// 				}

// 				return <FontAwesome name={iconName} size={size} color={color} />;
// 			},
// 			tabBarActiveTintColor: 'rgb(189, 159, 138)',
// 			tabBarInactiveTintColor: '#b2b2b2',
// 			headerShown: false,
// 			tabBarStyle: {
// 				backgroundColor: 'rgb(74, 52, 57)',
// 				paddingTop: 12,
// 				position: 'absolute',
// 				bottom: 0,
// 				left: 0,
// 				right: 0,
// 				borderTopWidth: 0,
// 				elevation: 0,
// 			},
// 			tabBarLabelStyle: {
// 				fontSize: 12,
// 				marginBottom: 5,
// 			},
// 		})}>
// 			<Tab.Screen name="Lobby" component=/* {LobbyScreen} */ {LobbyStack} listeners={({ navigation }) => ({
// 				tabPress: (e) => {
// 					navigation.navigate('Lobby');
// 				},
// 			})} />
// 			<Tab.Screen name="Portal" component=/* {PortalStack} */ {PortalStack} listeners={({ navigation }) => ({
// 				tabPress: (e) => {
// 					navigation.navigate('Portal');
// 				},
// 			})} />
// 			<Tab.Screen name="Friends" component=/* {FriendsStack} */{FriendsStack} listeners={({ navigation }) => ({
// 				tabPress: (e) => {
// 					navigation.navigate('Friends');
// 				},
// 			})} />
// 		</Tab.Navigator>
// 	);
// };

// const RootNavigator = () => {
// 	const dispatch = useDispatch();
// 	const { token } = useSelector((state) => state.auth);
// 	const [loading, setLoading] = useState(true);

// 	// Charger les données utilisateur au démarrage
// 	useEffect(() => {
// 		(async () => {
// 			try {
// 				await dispatch(loadUserData()).unwrap(); // unwrap() pour gérer les rejets
// 			} catch (err) {
// 				console.error("Erreur lors du chargement des données utilisateur :", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		})()
// 	}, [dispatch]);

// 	// Afficher un loader pendant la vérification
// 	if (loading) {
// 		return (
// 			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// 				<ActivityIndicator size="large" color="#0000ff" />
// 			</View>
// 		);
// 	}

// 	return (
// 		<Stack.Navigator screenOptions={{ headerShown: false }}>
// 			{token ? (
// 				<Stack.Screen name="TabNavigator" component={TabNavigator} />
// 			) : (
// 				<>
// 					<Stack.Screen name="SignIn" component={SignInScreen} />
// 					<Stack.Screen name="CharacterCreation" component={CharactereCreationScreen} />
// 				</>
// 			)}
// 		</Stack.Navigator>
// 	);
// };

// export default function App() {
// 	return (
// 		<Provider store={store}>
// 			<PersistGate loading={null} persistor={persistor}>
// 				<NavigationContainer>
// 					<RootNavigator />
// 				</NavigationContainer>
// 				<ModalPortal />
// 			</PersistGate>
// 		</Provider>
// 	);
// }

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@configs/redux';
import RootNavigator from '@navigation/RootNavigator';
import { ModalPortal } from 'react-native-modals';

// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<RootNavigator />
				<ModalPortal />
			</PersistGate>
		</Provider>
	);
}

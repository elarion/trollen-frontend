import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MainStack from './MainStack';
import theme from '@theme';
import { StyleSheet } from 'react-native';
import TopHeader from '@components/TopHeader';
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Lobby: 'shield',
                        Portal: 'connectdevelop',
                        Friends: 'handshake-o',
                    };
                    return <FontAwesome name={icons[route.name]} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: 'rgb(74, 52, 57)',
                    elevation: 0,
                    borderTopWidth: 0,
                    height: 70,
                    paddingTop: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.secondary,
                headerShown: false, // On désactive les headers internes
                // header: TopHeader,
            })}
        >
            <Tab.Screen name="Lobby" component={MainStack} initialParams={{ initialRoute: "LOBBY" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    navigation.navigate('Lobby');
                },
            })} />
            <Tab.Screen name="Portal" component={MainStack} initialParams={{ initialRoute: "PORTAL" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    navigation.navigate('Portal');
                },
            })} />
            <Tab.Screen name="Friends" component={MainStack} initialParams={{ initialRoute: "FRIENDS" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    navigation.navigate('Friends');
                },
            })} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Permet d'éviter que le header dépasse
    },
});

export default TabNavigator;
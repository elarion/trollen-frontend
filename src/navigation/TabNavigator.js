import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MainStack from './MainStack';
import theme from '@theme';
import { StyleSheet, Platform, View, Text, Image } from 'react-native';
import TopHeader from '@components/TopHeader';
const Tab = createBottomTabNavigator();
import { BlurView } from 'expo-blur';
import { useNavigationState } from '@react-navigation/native';

export default function TabNavigator({ navigation }) {
    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('tabPress', (e) => {
    //         console.log('tabPress', e);
    //         // Vérifie si l’utilisateur est déjà sur l’écran "RoomsList"
    //         const state = navigation.getState();
    //         const isAlreadyOnRoomsList = state.routes[state.index].name === 'Room';

    //         if (isAlreadyOnRoomsList) {
    //             // Reset uniquement si on est déjà sur la tab
    //             navigation.reset({
    //                 index: 0,
    //                 routes: [{ name: 'RoomsList' }],
    //             });
    //         }
    //     });

    //     return unsubscribe;
    // }, [navigation]);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                //get the current screen name
                // How to get the current screen name ?
                const state = useNavigationState(state => state);
                const currentScreen = state?.routes[state.index]?.state?.routes?.at(-1)?.name;

                return {
                    // tabBarIcon: ({ color, size }) => {
                    //     const icons = {
                    //         Lobby: 'home',
                    //         Portal: 'connectdevelop',
                    //         Friends: 'handshake-o',
                    //     };
                    //     return <FontAwesome name={icons[route.name]} size={25} color={color} />;
                    // },
                    tabBarIcon: ({ focused }) => {
                        let iconSource;

                        if (route.name === 'Lobby') {
                            iconSource = focused
                                ? require('@assets/lobby.png')  // Icône sélectionnée
                                : require('@assets/lobby.png');        // Icône non sélectionnée
                        } else if (route.name === 'Portal') {
                            iconSource = focused
                                ? require('@assets/vortex.png')
                                : require('@assets/vortex.png');
                        } else if (route.name === 'Friends') {
                            iconSource = focused
                                ? require('@assets/friends2.png')
                                : require('@assets/friends2.png');
                        }

                        return (
                            <Image
                                source={iconSource}
                                style={{
                                    width: 30, // Ajuste la taille selon tes besoins
                                    height: 30,
                                    tintColor: focused ? theme.colors.darkBrown : theme.colors.lightBrown, // Optionnel : change la couleur si besoin
                                }}
                                resizeMode="cover"
                            />
                        );
                    },
                    tabBarShowLabel: false,

                    tabBarStyle: {
                        // display: ["Room", "Portal"].includes(state.routes[state.index].name) ? "none" : "flex",
                        height: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        // position: 'absolute',
                        // left: "50%",
                        // left: 0,
                        // right: 0,
                        // bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        paddingTop: 15,
                        borderTopWidth: 0,
                        elevation: 0,
                        // borderRadius: 100,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    },
                    // tabBarBackground: () => (
                    //     Platform.OS === 'ios'
                    //         ? <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                    //         // ? <BlurView intensity={5} tint={theme.colors.lightBrown02} style={{ flex: 1 }} />
                    //         : <View style={{ flex: 1, backgroundColor: 'transparent' }} />
                    // ),
                    tabBarLabelStyle: {
                        // fontSize: 12,
                        // fontWeight: 'bold',
                        // backgroundColor: 'red',
                    },
                    tabBarBadgeStyle: {
                        // height: 20,
                        // width: 20,
                        // backgroundColor: 'red',
                        // color: theme.colors.secondary,
                    },
                    tabBarIconStyle: {
                        alignItems: 'center',
                        justifyContent: 'center',
                        // height: 40,
                        // width: 40,
                        borderRadius: 100,
                        // backgroundColor: theme.colors.lightBrown05,
                    },
                    // tabBarItemStyle: {
                    //     backgroundColor: 'green',
                    // },
                    // tabBarAccessibilityLabel: 'test',
                    tabBarHideOnKeyboard: true,

                    // tabBarActiveBackgroundColor: theme.colors.lightBrown02,
                    // tabBarActiveIconStyle: {
                    //     backgroundColor: theme.colors.darkBrown,
                    // },
                    tabBarActiveTintColor: theme.colors.darkBrown,
                    tabBarInactiveTintColor: theme.colors.darkBrown05,
                    headerShown: false, // On désactive les headers internes
                    // header: TopHeader,
                }
            }}
        >
            <Tab.Screen name="Lobby" component={MainStack} initialParams={{ initialRoute: "LOBBY" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    navigation.navigate('Lobby');
                },
            })} />
            <Tab.Screen name="Portal" component={MainStack} initialParams={{ initialRoute: "PORTAL" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    const state = navigation.getState();
                    if (state.routes[state.index].name === 'Portal') {
                        navigation.navigate('Portal');
                    }
                },
            })} />
            <Tab.Screen name="Friends" component={MainStack} initialParams={{ initialRoute: "FRIENDS" }} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    navigation.navigate('Friends');
                },
            })} />
        </Tab.Navigator >
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1, // Permet d'éviter que le header dépasse
//     },
// });

// export default TabNavigator;
// import React from 'react';
// import {
//     Alert,
//     Animated,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
// import Ionicons from '@expo/vector-icons/Ionicons';
// // import MainStack from './MainStack';


// export default function TabNavigator() {
//     const _renderIcon = (routeName, selectedTab) => {
//         let icon = '';

//         switch (routeName) {
//             case 'Lobby':
//                 icon = 'home-outline';
//                 break;
//             case 'Friends':
//                 icon = 'people-outline';
//                 break;
//             case 'Portal':
//                 icon = 'settings-outline';
//                 break;
//         }

//         return (
//             <Ionicons
//                 name={icon}
//                 size={25}
//                 color={routeName === selectedTab ? 'black' : 'gray'}
//             />
//         );
//     };

//     const renderTabBar = ({ routeName, selectedTab, navigate }) => {
//         console.log('routeName', routeName, selectedTab, navigate);
//         return (
//             <TouchableOpacity
//                 onPress={() => navigate(routeName)}
//                 style={styles.tabbarItem}
//             >
//                 {_renderIcon(routeName, selectedTab)}
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <CurvedBottomBarExpo.Navigator
//             screenOptions={{
//                 headerShown: false,
//             }}
//             type="DOWN"
//             style={styles.bottomBar}
//             shadowStyle={styles.shawdow}
//             height={55}
//             circleWidth={50}
//             bgColor="white"
//             initialRouteName="Lobby"
//             borderTopLeftRight
//             renderCircle={({ selectedTab, navigate }) => (
//                 <Animated.View style={styles.btnCircleUp}>
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => Alert.alert('Click Action')}
//                     >
//                         <Ionicons name={'apps-sharp'} color="gray" size={25} />
//                     </TouchableOpacity>
//                 </Animated.View>
//             )}
//             tabBar={renderTabBar}
//         >
//             <CurvedBottomBarExpo.Screen
//                 name="Lobby"
//                 component={MainStack}
//                 initialParams={{ initialRoute: "LOBBY" }}
//                 listeners={({ navigation }) => ({
//                     tabPress: (e) => {
//                         navigation.navigate('Lobby');
//                     },
//                 })}
//                 position="LEFT"
//             />
//             <CurvedBottomBarExpo.Screen
//                 name="Friends"
//                 component={MainStack}
//                 initialParams={{ initialRoute: "FRIENDS" }}
//                 listeners={({ navigation }) => ({
//                     tabPress: (e) => {
//                         navigation.navigate('friends');
//                     },
//                 })}
//                 position="RIGHT"
//             />
//         </CurvedBottomBarExpo.Navigator>
//     );
// }

// export const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     shawdow: {
//         shadowColor: '#DDDDDD',
//         shadowOffset: {
//             width: 0,
//             height: 0,
//         },
//         shadowOpacity: 1,
//         shadowRadius: 5,
//     },
//     button: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     bottomBar: {},
//     btnCircleUp: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#E8E8E8',
//         bottom: 30,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.2,
//         shadowRadius: 1.41,
//         elevation: 1,
//     },
//     imgCircle: {
//         width: 30,
//         height: 30,
//         tintColor: 'gray',
//     },
//     tabbarItem: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     img: {
//         width: 30,
//         height: 30,
//     },
//     screen1: {
//         flex: 1,
//         backgroundColor: '#BFEFFF',
//     },
//     screen2: {
//         flex: 1,
//         backgroundColor: '#FFEBCD',
//     },
// });

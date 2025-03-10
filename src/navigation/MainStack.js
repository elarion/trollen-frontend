import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from './screens';
import { useRoute } from '@react-navigation/native';
import TopHeader from '@components/TopHeader';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

const MainStack = () => {
    const route = useRoute(); // Récupère initialRoute des params
    const initialRoute = route.params?.initialRoute || "LOBBY"; // Fallback au cas où

    return (
        <>
            {/* <TopHeader /> */}
            {/* initialRouteName est utile ? ou pas ? oui car */}
            {/* <Stack.Navigator screenOptions={{ header: TopHeader }} initialRouteName={SCREENS.TABS[initialRoute].name}> */}
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SCREENS.TABS[initialRoute].name}>
                <Stack.Screen {...SCREENS.TABS[initialRoute]} />
                {Object.values(SCREENS.COMMON).map(({ name, component }) => (
                    <Stack.Screen key={name} name={name} component={component} />
                ))}
            </Stack.Navigator>
        </>
    );
};

export default MainStack;

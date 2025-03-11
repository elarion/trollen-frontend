import SignInScreen from '../screens/Auth/SignInScreen';
import CharacterCreationScreen from '../screens/Auth/CharacterCreationScreen';

import LobbyScreen from '../screens/Tabs/LobbyScreen';
import PortalScreen from '../screens/Tabs/PortalScreen';
import FriendsScreen from '../screens/Tabs/FriendsScreen';

import SettingsScreen from '../screens/Common/SettingsScreen';
import ProfileScreen from '../screens/Common/ProfileScreen';
import NewsScreen from '../screens/Common/NewsScreen';
import GrimoireScreen from '../screens/Common/GrimoireScreen';
import RoomScreen from '../screens/Common/RoomScreen';
import PartyScreen from '../screens/Common/PartyScreen';

export const SCREENS = {
    AUTH: {
        SIGN_IN: { name: "SignIn", component: SignInScreen },
        CHARACTER_CREATION: { name: "CharacterCreation", component: CharacterCreationScreen },
    },
    TABS: {
        LOBBY: { name: "LobbyHome", component: LobbyScreen },
        PORTAL: { name: "PortalHome", component: PortalScreen },
        FRIENDS: { name: "FriendsHome", component: FriendsScreen },
    },
    COMMON: {
        SETTINGS: { name: "Settings", component: SettingsScreen },
        PROFILE: { name: "Profile", component: ProfileScreen },
        NEWS: { name: "News", component: NewsScreen },
        GRIMOIRE: { name: "Grimoire", component: GrimoireScreen },
        ROOM: { name: "Room", component: RoomScreen },
        PARTY: { name: "Party", component: PartyScreen },
    },
};
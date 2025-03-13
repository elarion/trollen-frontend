import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../../theme';
import { slugify } from '@utils/slugify';
import { avatars } from '@configs/avatars';
const portals = {
    "portal-1": require('@assets/portals/portal-1.png'),
    "portal-2": require('@assets/portals/portal-2.png'),
    "portal-3": require('@assets/portals/portal-3.png'),
    "portal-4": require('@assets/portals/portal-4.png'),
    "portal-5": require('@assets/portals/portal-5.png'),
};

export const Portal = ({ portal }) => {
    return (
        <View style={styles.portal}>
            <Image source={portals[portal]} style={styles.portalImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    portal: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    portalImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
    },
});

import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../../theme';
import { useSelector } from 'react-redux';
import { slugify } from '@utils/slugify';
import { avatars } from '@configs/avatars';

export const Avatar = ({ avatar, username = '' }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <View style={styles.avatar}>
            <Image source={avatars[slugify(avatar)]} style={styles.avatarImage} />
            {/* <Text style={styles.name}>{username || user.username}</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        padding: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
        // resizeMode: 'cover',
        backgroundColor: theme.colors.darkBrown,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.darkBrown,
    },
});

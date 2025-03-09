import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Settings</Text>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

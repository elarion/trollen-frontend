import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GrimoireScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Grimoire</Text>
        </View>
    );
};

export default GrimoireScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
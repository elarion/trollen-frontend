import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import theme from '../../../theme';

export const AuthModal = ({ title, visible, toggleModal, fields, setField, onConfirm, isSignUp, error }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={toggleModal} style={{ height: '100%' }}>
        <View style={styles.centeredView}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} onPress={toggleModal} />

            <View style={styles.modalView}>
                <Text style={styles.titleModal}>{title}</Text>
                <View style={styles.inputSection}>
                    <Text style={[styles.text]}>{isSignUp ? 'Choose a' : 'Enter your'} username {!isSignUp ? 'or email' : ''}</Text>
                    <TextInput placeholderTextColor={theme.colors.black} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Username" keyboardType="email-address" value={fields.username} onChangeText={value => setField('username', value)} />
                    {isSignUp && (
                        <>
                            <Text style={styles.text}>Enter your email</Text>
                            <TextInput placeholderTextColor={theme.colors.black} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Email" keyboardType="email-address" value={fields.email} onChangeText={value => setField('email', value)} />
                        </>
                    )}
                    <Text style={styles.text}>{isSignUp ? 'Choose a' : 'Enter your'} password</Text>
                    <TextInput placeholderTextColor={theme.colors.black} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Password" value={fields.password} onChangeText={value => setField('password', value)} secureTextEntry />
                    {isSignUp && (
                        <>
                            <Text style={styles.text}>Confirm your password</Text>
                            <TextInput placeholderTextColor={theme.colors.black} autoCapitalize="none" style={[styles.input, { marginBottom: 10 }]} placeholder="Confirm" value={fields.confirmPassword} onChangeText={value => setField('confirmPassword', value)} secureTextEntry />
                        </>
                    )}
                </View>

                {isSignUp && (
                    <View style={styles.checkboxSection}>
                        <Checkbox value={fields.has_consent} onValueChange={(value) => setField('has_consent', value)} color={theme.colors.green} style={styles.checkbox} />
                        <Text style={[styles.text, { paddingTop: 7 }]} onPress={() => setField('has_consent', !fields.has_consent)}>I accept the conditions</Text>
                    </View>
                )}

                <View style={styles.btnModal}>
                    <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={toggleModal}>
                        <Text style={styles.textStyle}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonValidation]} onPress={onConfirm}>
                        <Text style={styles.textStyle}>Validate</Text>
                    </TouchableOpacity>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    </Modal >
);
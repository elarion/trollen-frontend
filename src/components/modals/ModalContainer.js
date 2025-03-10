import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modals';

const ModalContainer = ({ children }) => {
    return (
        <Modal
            height={0.2}
            width={1}
            margin={0}
            padding={0}
            style={styles.modal}

            modalAnimation={new SlideAnimation({
                intialValue: 0,
                slideFrom: 'left',
                useNativeDriver: true,
            })}
            animationType="slide"
            transparent={true}
            visible={modalSpellVisible}
            //onToucheOutside={() => setModalSpellVisible(visible=false)}
            onRequestClose={() => {
                setModalSpellVisible(visible = false);
            }}>
            {children}

            
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ModalContainer;
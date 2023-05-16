import React from "react";
import Modal from "react-native-modal";
import { View } from 'react-native';

import StylesContainers from '../style/containers'

const ModalDefault = ({modal, setModal, content}) => {
    return (
        <Modal isVisible={modal} swipeDirection={'down'}
            onSwipeComplete={setModal}
            onBackdropPress={setModal}
            onBackButtonPress={setModal}
            backdropOpacity={0.5}
            style={{justifyContent: 'flex-end', margin: 0}}
        >
            <View style={[StylesContainers.modal]}>
                <View style={StylesContainers.modalHandle}/>
                {content}
            </View>
        </Modal>
    );
};

export default ModalDefault;
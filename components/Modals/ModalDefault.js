import React from "react";
import Modal from "react-native-modal";
import { View } from 'react-native';

import StylesContainers from '../style/containers'

const ModalDefault = ({modal, hideModal, content}) => {
    return (
        <Modal isVisible={modal} swipeDirection={'down'}
            onSwipeComplete={hideModal}
            onBackdropPress={hideModal}
            onBackButtonPress={hideModal}
            backdropOpacity={0.5}
            style={{justifyContent: 'flex-end', margin: 0}}
        >
            <View style={[StylesContainers.modalDefault]}>
                <View style={StylesContainers.modalHandle}/>
                {content}
            </View>
        </Modal>
    );
};

export default ModalDefault;
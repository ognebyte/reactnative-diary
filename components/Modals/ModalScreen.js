import React from "react";
import Modal from "react-native-modal";
import { View, Text } from 'react-native';
import { TextInput, TouchableRipple, Button, IconButton } from 'react-native-paper';

import StylesNavigation from '../style/navigation'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import IconClose from 'assets/svg/close'
import IconPlus from 'assets/svg/plus'


const ModalDefault = ({modal, hideModal, content}) => {
    return (
        <Modal isVisible={modal} swipeDirection={'right'}
            animationIn={'slideInRight'}
            animationOut={'slideOutRight'}
            onSwipeComplete={hideModal}
            onBackButtonPress={hideModal}
            backdropOpacity={0.5}
            style={{margin: 0}}
        >
            <View style={{flex: 1}}>
                <View style={Styles.modalHeader}>
                    <IconButton icon={IconClose} iconColor='black'
                        size={30}
                        onPress={hideModal}
                    />
                    <Button mode='contained-tonal'
                        buttonColor={StylesButtons.active.backgroundColor}
                    >
                        Добавить
                    </Button>
                </View>
                <View style={[StylesContainers.screen, Styles.modalScreenContainer]}>
                    {content}
                </View>
            </View>
        </Modal>
    );
};

export default ModalDefault;
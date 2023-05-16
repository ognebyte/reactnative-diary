import Modal from "react-native-modal";
import { View, Text, ActivityIndicator } from 'react-native';

import StylesTexts from '../style/texts';
import Styles from './styles'

const Loading = ({loading}) => {

    return (
        <Modal isVisible={loading} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <View style={Styles.modalLoading}>
                <Text style={[StylesTexts.lightColor, StylesTexts.default]}> Загрузка... </Text>
                <ActivityIndicator size={25} color={'white'}/>
            </View>
        </Modal>
    )
}

export default Loading;
import React from "react";
import { Animated, View, Text, Easing, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesSubject from './styles/subject'

import IconDelete from '../../assets/svg/delete';

const Subject = (props) => {
    const iconSize = 20
    const animValue = new Animated.Value(0)
    const opacityValue = new Animated.Value(1)

    const animStart = async () => {
        Animated.timing(opacityValue, {
            toValue: 0,
            duration: 200,
            easing: Easing.cubic,
            useNativeDriver: true,
        }).start()
        Animated.timing(animValue, {
            toValue: -300,
            duration: 200,
            easing: Easing.cubic,
            useNativeDriver: true,
        }).start(() => props.setDelete())
    };

    const swipeRight = () => {
        return (
            <TouchableOpacity onPress={() => animStart()}
                style={[
                    StylesSubject.subjectSwipe,
                    StylesButtons.delete
                ]}>
                <View style={{ alignItems: 'center' }}>
                    <IconDelete size={iconSize}/>
                    <Text style={StylesTexts.small}> Delete </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View style={[StylesSubject.subjectContainer, {transform: [{translateX: animValue}], opacity: opacityValue}]}>
            <Swipeable
                friction={3}
                overshootLeft={false}
                overshootRight={false}
                renderRightActions={swipeRight}
                containerStyle={{flex: 1}}
                childrenContainerStyle={{flex: 1}}
            >
                <View style={[StylesSubject.subject, {height: 50, gap: 5}]}>
                    <Text style={StylesTexts.default} numberOfLines={1}> 
                        {props.title}
                    </Text>
                    {/* <Text style={[StylesTexts.small, StylesTexts.fadeColor]} numberOfLines={1}> 
                        Создал: {props.createdBy} {props.createdBy !== props.user ? null : `(Вы)`}
                    </Text> */}
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default Subject;
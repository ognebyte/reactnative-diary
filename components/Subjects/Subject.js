import React, { useRef } from "react";
import { Animated, View, Text, Easing, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesSubject from './styles/subject'

import IconDelete from '../../assets/svg/delete';
import IconEdit from '../../assets/svg/edit';
import Chevron from "../../assets/svg/chevron";

const Subject = (props) => {
    const iconSize = 20
    const animValue = new Animated.Value(0)
    const opacityValue = new Animated.Value(1)
    const refSwipeable = useRef(null)

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

    const swipeLeft = () => {
        return (
            <TouchableOpacity onPress={() => {props.edit(); refSwipeable.current.close()}}
                style={[
                    StylesSubject.subjectSwipe,
                    StylesButtons.edit
                ]}>
                <View style={{ alignItems: 'center' }}>
                    <IconEdit size={iconSize}/>
                    <Text style={StylesTexts.small}> Edit </Text>
                </View>
            </TouchableOpacity>
        );
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
                ref={refSwipeable}
                friction={3}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={swipeLeft}
                renderRightActions={swipeRight}
                containerStyle={{flex: 1}}
                childrenContainerStyle={{flex: 1}}
            >
                <View style={[StylesSubject.subject, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                    <Text style={[StylesTexts.default, {maxWidth: '85%'}]} numberOfLines={1}> 
                        {props.title}
                    </Text>
                    <Chevron size={25} color={'black'}/>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default Subject;
import React, { useRef } from "react";
import { Animated, View, Text, Easing, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import IconDelete from '../../assets/svg/delete';
import IconEdit from '../../assets/svg/edit';
import Chevron from "../../assets/svg/chevron";

const ScheduleItem = (props) => {
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
                    Styles.swipe,
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
                    Styles.swipe,
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
        <Animated.View style={[Styles.animatedViewContainer, {transform: [{translateX: animValue}], opacity: opacityValue}]}>
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
                <View style={[Styles.animatedView, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50}]}>
                    <Text style={[StylesTexts.default, {maxWidth: '85%'}]} numberOfLines={1}> 
                        {props.title}
                    </Text>
                    <Chevron size={25} color={'black'}/>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default ScheduleItem;
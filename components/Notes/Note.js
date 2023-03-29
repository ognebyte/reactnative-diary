import React, { useEffect } from "react";
import { Animated, View, Text, Easing, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesNote from './styles/note'

import IconDelete from '../../assets/svg/delete';

const Note = (props) => {
    // const translateX = new Animated.Value(0);
    // const translateY = new Animated.Value(0);
    // const swipe = Animated.event(
    //     [ { nativeEvent: { translationX: translateX } }, ],
    //     { useNativeDriver: true }
    // );
    const iconSize = 30
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
                    StylesNote.noteSwipe,
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
        <Animated.View style={[StylesNote.noteContainer, {transform: [{translateX: animValue}], opacity: opacityValue}]}>
            <Swipeable
                friction={3}
                overshootLeft={false}
                overshootRight={false}
                renderRightActions={swipeRight}
                containerStyle={{flex: 1}}
                childrenContainerStyle={{flex: 1}}
            >
                <View style={StylesNote.note}>
                    <Text style={[StylesTexts.big]} numberOfLines={1}> 
                        {props.title}
                    </Text>

                    {
                        !props.description ? null :
                        <Text style={[StylesNote.textField, StylesTexts.small]} numberOfLines={2}>
                            {props.description}
                        </Text>
                    }
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default Note;
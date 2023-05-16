import React, { useRef } from 'react';
import moment from 'moment';
import { Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './style'

import IconCheck from '../../assets/svg/check';
import Chevron from '../../assets/svg/chevron'
import IconDelete from '../../assets/svg/delete';
import IconDone from '../../assets/svg/done';
import IconUndone from '../../assets/svg/undone';
import Clock from '../../assets/svg/clock'

const CalendarItem = (props) => {
    const item = props.item;
    const iconSize = 30
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
            <View
                style={[
                    Styles.subjectSwipe,
                    item.subject_isComplete ? StylesButtons.edit : StylesButtons.accept
                ]}>
                {
                    item.subject_isComplete ?
                        <View style={{ alignItems: 'center' }}>
                            <IconUndone size={iconSize}/>
                            <Text style={StylesTexts.small}> Undone </Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center' }}>
                            <IconDone size={iconSize}/>
                            <Text style={StylesTexts.small}> Done </Text>
                        </View>
                }
            </View>
        );
    };

    const swipeRight = () => {
        return (
            <TouchableOpacity onPress={() => animStart()}
                style={[
                    Styles.subjectSwipe,
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
        <Animated.View style={[Styles.dayContainer, {transform: [{translateX: animValue}], opacity: opacityValue}]}>
            <Swipeable
                ref={refSwipeable}
                friction={3}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={swipeLeft}
                renderRightActions={swipeRight}
                onSwipeableOpen={
                    (direction) => {
                        if (direction == 'left') {
                            refSwipeable.current.close()
                            props.setComplete()
                        }
                    }
                }
                containerStyle={{flex: 1}}
                childrenContainerStyle={{flex: 1}}
            >
                <View style={Styles.day}>
                    <TouchableOpacity
                        style={[{width: 30, height: 30}, item.subject_isComplete ? [Styles.taskCheck, {backgroundColor: '#000000'}] : Styles.taskUnCheck]}
                        onPress={() => props.setComplete()}
                        activeOpacity={0.6}
                    >
                        { item.subject_isComplete ? <IconCheck color={'#ffffff'} size={'100%'}/> : null }
                    </TouchableOpacity>

                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                            <Clock size={18} color={StylesTexts.fadeColor.color}/>
                            <Text style={[StylesTexts.default, StylesTexts.fadeColor, {textAlign: 'right'}]}>
                                {moment(item.subject_deadline).format('HH:mm')}
                            </Text>
                        </View>

                        <Text style={[StylesTexts.medium]} numberOfLines={1}>
                            {item.subject_title}
                        </Text>

                        <Text style={[StylesTexts.small, StylesTexts.fadeColor]} numberOfLines={1}>
                            Предмет: {item.subjects_title}
                        </Text>
                    </View>

                    <Chevron size={25} color={StylesTexts.fadeColor.color}/>
                </View>
            </Swipeable>
        </Animated.View>
    );
}

export default CalendarItem;
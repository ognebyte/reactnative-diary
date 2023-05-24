import React, { useRef } from "react";
import moment from 'moment';
import 'moment/locale/ru'
import { Animated, View, Text, Easing, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Colors from '../style/colors'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesSubject from './styles/subject'

import IconDelete from '../../assets/svg/delete';
import IconDone from '../../assets/svg/done';
import IconUndone from '../../assets/svg/undone';
import IconCheck from '../../assets/svg/check';

const Assignments = (props) => {
    const item = props.item
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
                    StylesSubject.subjectSwipe,
                    item.isComplete ? StylesButtons.edit : StylesButtons.accept
                ]}>
                {
                    item.isComplete ?
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
                <View style={[StylesSubject.subject, {flexDirection: 'row'}]}>
                    <View style={{justifyContent: 'center'}}>
                        <TouchableOpacity
                            style={[{width: 30, height: 30}, item.isComplete ? [StylesSubject.taskCheck, {backgroundColor: '#000000'}] : StylesSubject.taskUnCheck]}
                            onPress={() => props.setComplete()}
                        >
                            { item.isComplete ? <IconCheck color={'#ffffff'} size={'100%'}/> : null }
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 5}}>
                        <Text numberOfLines={1}
                            style={[
                                StylesTexts.big,
                                !item.isComplete ? null : {textDecorationLine: 'line-through', color: Colors.darkFade}
                            ]}
                        >
                            {item.title}
                        </Text>
                        
                        <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>
                            Создано: {moment(item.createdAt).locale('ru').format('D MMMM')}
                        </Text>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {
                                !item.deadline ? null :
                                <Text style={[StylesTexts.small]}>
                                    Срок сдачи: {moment(item.deadline).format('D MMMM, HH:mm')}
                                </Text>
                            }
                            {
                                !item.grade ? null :
                                <Text style={StylesTexts.small}>
                                    Баллов: {item.grade}
                                </Text>
                            }
                        </View>

                        {
                            !item.description ? null :
                            <Text style={[StylesTexts.small, {color: Colors.darkFade}]} numberOfLines={2}>
                                {item.description}
                            </Text>
                        }
                    </View>
                </View>
            </Swipeable>
        </Animated.View>
    );
};

export default Assignments;
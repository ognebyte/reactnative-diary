import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { IconButton } from 'react-native-paper';
import moment from 'moment';

import StylesPaper from '../style/paper'
import Colors from '../style/colors'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import Context from 'config/context';

import IconMore from 'assets/svg/more-vertical'


const AssignmentItem = ({ item }) => {
    const { contextSubject } = useContext(Context);
    const isPupil = contextSubject.role === 'pupil' ? true : false

    const getColor = () => {
        let color = Colors.inactive
        if (item.dueDate) {
            if (moment(item.dueDate).valueOf() < moment().valueOf()) {
                color = Colors.alarm
            }
            else color = Colors.needAttention
        }
        return color
    }

    return (
        <View style={[Styles.assignmentItem, {borderColor: getColor()}]}>
            <View style={Styles.assignmentItemHeaderContainer}>
                <View style={Styles.assignmentItemHeader}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={[StylesTexts.big, {flex: 1}]} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={StylesTexts.small}>
                            Создан: {moment(item.createdAt).format('DD MMMM')}
                        </Text>
                    </View>
                </View>
                { isPupil ?
                    <View style={Styles.assignmentItemSummaryContainer}>
                        { !item.submission ? <Text style={[StylesTexts.default, {color: Colors.darkFade}]}> Не сдано </Text>
                            : !item.submission.gradedBy ? <Text style={StylesTexts.default}>На рассмотрении</Text>
                            : !item.submission.point ? <Text style={StylesTexts.default}>Оценена</Text>
                            :
                            <Text style={StylesTexts.default}>
                                Оценка: {<Text style={[StylesTexts.medium]}>{item.submission.point}</Text>}
                            </Text>
                        }
                    </View>
                    :
                    <View style={Styles.assignmentItemSummaryContainer}>
                        <View style={Styles.assignmentItemSummary}>
                            <Text numberOfLines={1} style={StylesTexts.default}> {item.submissionSubmitted} </Text>
                            <Text numberOfLines={1} style={[StylesTexts.small, {color: Colors.darkFade}]}> Сдано </Text>
                        </View>
                        <View style={StylesContainers.verticalSeparator}/>
                        <View style={Styles.assignmentItemSummary}>
                            <Text numberOfLines={1} style={StylesTexts.default}> {item.submissionGraded} </Text>
                            <Text numberOfLines={1} style={[StylesTexts.small, {color: Colors.darkFade}]}> Оценено </Text>
                        </View>
                        <View style={StylesContainers.verticalSeparator}/>
                        <View style={Styles.assignmentItemSummary}>
                            <Text numberOfLines={1} style={StylesTexts.default}> {item.commentCount} </Text>
                            <Text numberOfLines={1} style={[StylesTexts.small, {color: Colors.darkFade}]}> Комментарии </Text>
                        </View>
                    </View>
                }
            </View>
            <View style={Styles.assignmentItemInfo}>
                <Text style={[StylesTexts.default, item.dueDate ? null : StylesTexts.fadeColor]}>
                    { !item.dueDate ? 'Без срока сдачи' : `Срок сдачи: ${moment(item.dueDate).format('DD MMMM')}` }
                </Text>
                <Text style={[StylesTexts.default, item.maxPoints ? null : StylesTexts.fadeColor]}>
                    { !item.maxPoints ? 'Без баллов' : `${item.maxPoints} баллов` }
                </Text>
            </View>
        </View>
    );
};

export default AssignmentItem;
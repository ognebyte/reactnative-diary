import React, { useState, useEffect, useMemo, Component } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { FlashList } from "@shopify/flash-list";
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import Colors from '../style/colors';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './styles';

import ArrowForward from '../../assets/svg/arrow-forward'
import ArrowBack from '../../assets/svg/arrow-back'

const TaskItem = ({ item }) => {

    return (
        <View style={Styles.taskItem}>
            <Text style={StylesTexts.small} numberOfLines={1}>
                {item.subjects_title}
            </Text>
            <Text style={StylesTexts.medium} numberOfLines={2}>
                {item.assignments_title}
            </Text>
            {
                !item.assignments_description ? null :
                <Text style={[StylesTexts.small, {color: Colors.darkFade}]} numberOfLines={1}>
                    {item.assignments_description}
                </Text>
            }
            <Text style={[StylesTexts.small, {color: Colors.darkFade}]} numberOfLines={1}>
                { item.assignments_deadline ? 
                    `Срок сдачи: ${moment(item.assignments_deadline).format('DD MMMM, HH:mm')}`
                    :
                    `Создано: ${moment(item.assignments_createdAt).format('DD MMMM, HH:mm')}`
                }
            </Text>
        </View>
    );
}

export default TaskItem;
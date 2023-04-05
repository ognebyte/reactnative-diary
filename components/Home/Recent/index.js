import React, { useState, useEffect, useMemo, Component } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { FlashList } from "@shopify/flash-list";
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import StylesContainers from '../../style/containers';
import StylesButtons from '../../style/buttons';
import StylesTexts from '../../style/texts';

import ArrowForward from '../../../assets/svg/arrow-forward'
import ArrowBack from '../../../assets/svg/arrow-back'

const RecentItem = (props) => {
    const item = props.item

    return (
        <TouchableOpacity activeOpacity={0.8}
            onPress={
                () => {
                    alert(`${item.title}, ${item.description}, ${moment(item.deadline).format('LLLL')}`)
                }
            }
            //         setItemId(item.id)
            //         setItemTitle(item.title)
            //         setItemGrade(item.grade)
            //         setItemDescription(item.description)
            //         setItemDeadline(item.deadline);
            //         setModalEdit(true);
            //     }
            // }
        >
            <View style={[StylesButtons.default, {width: 200, height: 100, backgroundColor: '#FFFFFF'}]}>
                <Text> {item.title} </Text>
            </View>
            {/* <Task
                title={item.title}
                grade={item.grade}
                description={item.description}
                isComplete={item.isComplete}
                createdAt={item.createdAt}
                deadline={item.deadline}
                setDelete={() => deleteSubjectTask(item.id)}
                setComplete={() => setIsComplete(item.id, item.isComplete ? 0 : 1)}
            /> */}
        </TouchableOpacity>
    );
}

export default RecentItem;
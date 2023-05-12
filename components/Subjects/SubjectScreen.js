import React, { useState, useRef, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import StylesNavigation from '../style/navigation'
import StylesTexts from '../style/texts'

import Assignments from "./Assignments";
import Report from "./Report";
import Users from "./Users";


const SubjectScreen = ({ route, navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const subjectId = route.params.subjectId
    const subjectTitle = route.params.subjectTitle
    // const createdBy = route.params.createdBy

    const [load, setLoad] = useState(false)
    const screens = {
        index: 0,
        routes: [
            { key: 'first', title: ' Задачи ' },
            { key: 'second', title: ' Отчёт ' },
        ],
    };
    
    useEffect(
        () => {
            // if (createdBy) screens.routes.push({ key: 'third', title: ' Пользователи ' })
            navigation.setOptions({ headerTitle: subjectTitle })
        }, []
    )

    return (
        <TabView
            swipeEnabled={false}
            navigationState={screens}
            renderScene={SceneMap({
                first: () => <Assignments subjectId={subjectId}/>,
                second: () => <Report subjectId={subjectId} load={load}/>,
            })}
            // third: () => <Users subjectId={subjectId}/>,
            initialLayout={{ width: Dimensions.get('window').width }}
            onIndexChange={ index => {setLoad(!load); screens.index = index}}
            renderTabBar={ props => <TabBar {...props}
                style={{
                    flexDirection: 'column',
                    backgroundColor: StylesNavigation.colors.headerBackground,
                }}
                activeColor={'#6E7AFF'}
                inactiveColor={StylesNavigation.colors.inactiveColor}
                pressColor={'#00000020'}
                indicatorStyle={{backgroundColor: '#6E7AFF'}}
            />}
        />
    );
};

export default SubjectScreen;
import React, { useState, useRef, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import StylesNavigation from '../style/navigation'
import StylesTexts from '../style/texts'

import Tasks from "./Tasks";
import Report from "./Report";
import Users from "./Users";


const SubjectScreen = ({ route, navigation }) => {
    const table = 'subjects'
    const db = SQLite.openDatabase(`${table}.db`)
    const subjectId = route.params.subjectId
    const createdBy = route.params.createdBy

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
            db.transaction(tx => 
                tx.executeSql(`SELECT * FROM ${table} WHERE id = ?`, [subjectId],
                    (_, res) => {
                        navigation.setOptions({ headerTitle: res.rows.item(0).title })
                    },
                    (_, error) => console.log(error)
                )
            );
        }, []
    )

    return (
        <TabView
            swipeEnabled={false}
            navigationState={screens}
            renderScene={SceneMap({
                first: () => <Tasks subjectId={subjectId}/>,
                second: () => <Report subjectId={subjectId} createdBy={createdBy} load={load}/>,
            })}
            // third: () => <Users subjectId={subjectId} createdBy={createdBy}/>,
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
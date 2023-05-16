import React, { useState, useEffect, useMemo, Component } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles';

import RecentItem from './Recent';

const HomeRoute = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'assignments'
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const refresh = () => {
        loadDays()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    };

    useEffect(() => {
        refresh()
    }, [])


    const loadDays = () => {
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} ORDER BY deadline DESC`, [],
                (_, res) => {
                    var rows = []
                    for (let i = 0; i < res.rows.length; i++) {
                        let row = res.rows.item(i)
                        if (row.deadline !== null) rows.push(row)
                    }
                    setTasks(rows)
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}>
            <View style={StylesContainers.default}>
                <View style={[Styles.background, {backgroundColor: StylesTexts.linkColor.color}]}>
                    <View style={{margin: 30}}>
                        <Text style={[StylesTexts.big, StylesTexts.lightColor]}> Сегодня: {moment().format('DD MMMM')} </Text>
                    </View>
                </View>
                <View style={[Styles.content]}>
                    <View style={{gap: 20}}>

                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                            onPress={() => navigation.navigate("Notes")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Заметки </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                            onPress={() => navigation.navigate("SubjectsStack")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Предметы </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                            onPress={() => navigation.navigate("ScheduleStack")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Расписание </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                            onPress={() => navigation.navigate("ClassesStack")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Курсы </Text>
                        </TouchableOpacity>
                    </View>

                    {
                        tasks.length === 0 ? null :
                        <ScrollView horizontal={true} style={{height: 150, backgroundColor: '#00000050'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', overflow: 'scroll', gap: 30, paddingHorizontal: 30}}>
                                {
                                    tasks.map(
                                        (task) => {
                                            return (
                                                <View key={task.id} style={{flex: 1}}>
                                                    <RecentItem item={task}/>
                                                </View>
                                            )
                                        }
                                    )
                                }
                                </View>
                        </ScrollView>
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeRoute;
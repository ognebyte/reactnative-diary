import React, { useState, useEffect, useMemo, Component } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import StylesContainers from './style/containers';
import StylesButtons from './style/buttons';
import StylesTexts from './style/texts';

import ArrowForward from '../assets/svg/arrow-forward'
import ArrowBack from '../assets/svg/arrow-back'

const CalendarScreen = () => {
    const table = 'subject'
    const db = SQLite.openDatabase(`${table}.db`)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        loadDays()
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
                    console.log(tasks)
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View>
            {
                tasks.map(
                    task => {
                        return (
                            <Text key={task.id}>
                                {task.title} {moment(task.deadline).format('LLLL')}
                            </Text>
                        )
                    }
                )
            }
        </View>
    );
}

export default CalendarScreen;
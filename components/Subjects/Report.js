import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite'
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'
import StylesReport from './styles/report'

const windowWidth = Dimensions.get('window').width

const Report = (props) => {
    const table = 'subject'
    const db = SQLite.openDatabase(`${table}.db`)
    const subject_id = props.subjectId
    const [tasks, setTasks] = useState(0)
    const [tasksDone, setTasksDone] = useState(0)
    const [loading, setLoading] = useState(true)

    const refresh = React.useCallback(() => {
        getAllSubjectTask()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);

    useEffect(
        () => {
            refresh()
        }, [props.load]
    )

    const getAllSubjectTask = () => {
        db.transaction(tx => {
            tx.executeSql(`SELECT COUNT(id) as count FROM ${table} WHERE subject_id = ?;`, [subject_id],
                (_, res) => {
                    setTasks(res.rows.item(0).count)
                },
                (_, error) => console.log(error)
            );
            tx.executeSql(`SELECT COUNT(id) as countDone FROM ${table} WHERE subject_id = ? AND isComplete = 1;`, [subject_id],
                (_, res) => {
                    setTasksDone(res.rows.item(0).countDone)
                },
                (_, error) => console.log(error)
            );
        })
    }

    return (
        <ScrollView
            refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
        >
            <View style={[StylesContainers.screen, {flex: 1, gap: 20}]}>
                <View style={{flex: 1}}>
                    <View style={StylesReport.reportRow}>
                        <View style={[StylesReport.square, styles.square]}>
                            <Text style={StylesReport.textBig}> {tasks} </Text>
                            <Text style={StylesReport.textSmall}> Задач </Text>
                        </View>
                        <View style={[StylesReport.square, styles.square]}>
                            <Text style={StylesReport.textBig}> {tasks===0 ? '0' : `${((tasksDone * 100) / tasks).toFixed(0)}%`} </Text>
                            <Text style={StylesReport.textSmall}> Сделано </Text>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: `${((tasksDone * 100) / tasks).toFixed(0)}%`,
                                backgroundColor: StylesButtons.accept.backgroundColor,
                                zIndex: -1
                            }}/>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>

    );
};

export default Report;

const styles = StyleSheet.create({
    square: {
        width: windowWidth / 2 - StylesContainers.screen.padding * 1.5,
        height: windowWidth / 2 - StylesContainers.screen.padding * 1.5,
        maxWidth: 500,
        maxHeight: 500,
    }
})
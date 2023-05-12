import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite'
import 'react-native-gesture-handler';
import { SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainTab from './components/MainTab'
import NavigationTheme from './components/style/navigation'

/*
    for build apk:
    eas build -p android --profile preview
*/

const App = () => {
    const tableNotes = 'notes'
    const tableSubjects = 'subjects'
    const tableAssignments = 'assignments'
    const tableUsers = 'users'
    const tableSchedule = 'schedule'
    const tableDays = 'days'
    const db = SQLite.openDatabase('diary.db')

    useEffect(
        () => {
            db.transaction(tx => {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableNotes}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        description TEXT
                    )`
                );
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableSubjects}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        createdBy TEXT
                    )`
                );
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableAssignments}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subject_id INTEGER,
                        title TEXT,
                        description TEXT,
                        grade INTEGER,
                        isComplete INTEGER,
                        createdAt DATE,
                        deadline DATE
                    )`
                );
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableSchedule}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        saturday INTEGER
                    )`
                );
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableDays}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        schedule_id INTEGER,
                        subject_id INTEGER,
                        place INTEGER,
                        weekNumber INTEGER,
                        timeStart TEXT,
                        timeEnd TEXT,
                        courseType TEXT,
                        instructor TEXT,
                        location TEXT,
                        note TEXT
                    )`
                );
            });
        }
    , [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: NavigationTheme.colors.card }}>
            <StatusBar
                backgroundColor={NavigationTheme.colors.card}
                barStyle={NavigationTheme.dark ? 'light-content' : 'dark-content'}
            />
            <GestureHandlerRootView style={{flex: 1}}>
                <MainTab/>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default App;
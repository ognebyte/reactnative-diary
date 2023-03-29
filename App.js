import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite'
import 'react-native-gesture-handler';
import { SafeAreaView, StatusBar } from 'react-native';

import MainTab from './components/MainTab'
import NavigationTheme from './components/style/navigation'


const App = () => {
    const tableNotes = 'notes'
    const tableSubjects = 'subjects'
    const tableSubject = 'subject'
    const tableUsers = 'users'

    useEffect(
        () => {
            SQLite.openDatabase(`${tableNotes}.db`).transaction(tx => 
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableNotes}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        description TEXT
                    )`
                )
            );
            SQLite.openDatabase(`${tableSubjects}.db`).transaction(tx => 
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableSubjects}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        createdBy TEXT REFERENCES users(login)
                    )`
                )
            );
            SQLite.openDatabase(`${tableSubject}.db`).transaction(tx => 
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableSubject}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subject_id INTEGER REFERENCES subjects(id),
                        title TEXT,
                        description TEXT,
                        grade INTEGER,
                        isComplete INTEGER,
                        createdAt DATE,
                        deadline DATE
                    )`
                )
            );
            SQLite.openDatabase(`${tableUsers}.db`).transaction(tx => 
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableUsers}
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        login TEXT,
                        password TEXT,
                        firstname TEXT,
                        lastname TEXT,
                        email TEXT,
                        birthday DATE
                    )`
                )
            );
        }

    , [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: NavigationTheme.colors.card }}>
            <StatusBar
                backgroundColor={NavigationTheme.colors.card}
                barStyle={NavigationTheme.dark ? 'light-content' : 'dark-content'}
            />
            <MainTab/>
        </SafeAreaView>
    );
};

export default App;
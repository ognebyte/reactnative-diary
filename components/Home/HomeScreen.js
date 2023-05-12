import React, { useState, useEffect, useMemo, Component } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';

import NavigationTheme from '../style/navigation'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'

import RecentItem from './Recent';

import Psycho from '../../assets/img/psycho.png'

const windowDimensions = Dimensions.get('window');
const windowHeight = windowDimensions.height

const HomeRoute = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'assignments'
    const screenPadding = StylesContainers.screen.padding
    let prev = ''
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const refresh = React.useCallback(() => {
        prev = ''
        loadDays()
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);

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
        <ScrollView  refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}>
            <View style={StylesContainers.default}>
                <ImageBackground source={Psycho} style={styles.background}>
                </ImageBackground>
                <View style={[styles.content]}>
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
                            onPress={() => navigation.navigate("Schedule")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Расписание </Text>
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

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        width: '100%',
        height: windowHeight / 100 * 15,
    },
    content: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
        paddingTop: 30,
        marginTop: windowHeight / 100 * 12,
        gap: 40,
        backgroundColor: NavigationTheme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
})
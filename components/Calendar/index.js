import React, { useState, useEffect, useMemo, Component } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { FlashList } from "@shopify/flash-list";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';

LocaleConfig.locales['ru'] = {
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
LocaleConfig.defaultLocale = 'ru';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';

import CalendarItem from './CalendarItem';

import ArrowForward from '../../assets/svg/arrow-forward'
import ArrowBack from '../../assets/svg/arrow-back'

const CalendarScreen = () => {
    const table = 'subject'
    const db = SQLite.openDatabase(`${table}.db`)
    const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const [markedDates, setMarkedDates] = useState({})
    const mark = ({marked: true, dotColor: 'red'})

    const refresh = React.useCallback(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);
    
    useEffect(() => {
        loadMonth(new Date().getMonth() + 1)
        refresh()
    }, [])


    const loadMonth = (month) => {
        let firstDay = new Date(moment().format('YYYY'), month-1, 1).valueOf()
        let lastDat = new Date(moment().format('YYYY'), month, 1).valueOf()
        setMarkedDates({})
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} WHERE deadline >= ? AND deadline < ? ORDER BY deadline DESC`, [firstDay, lastDat],
                (_, res) => {
                    var rows = []
                    for (let i = 0; i < res.rows.length; i++) {
                        let row = res.rows.item(i)
                        if (row.deadline !== null) {
                            let dd = moment(row.deadline).format('YYYY-MM-DD')
                            rows.push(row)
                            setMarkedDates(date => {return {...date, [dd]: mark}})
                        }
                    }
                    setTasks(rows)
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <ScrollView refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }>
            <View style={{flex: 1}}>
                <CalendarList
                    onMonthChange={date => {
                        loadMonth(date.month)
                    }}
                    onDayPress={day => {
                        console.log('loadDay')
                        setSelectedDay(day.dateString);
                    }}
                    current={moment().format('YYYY-MM-DD')}
                    markedDates={markedDates}

                    renderArrow={(direction) => {return direction === 'left' ? <ArrowBack size={20}/> : <ArrowForward size={20}/>}}
                    hideArrows={false}
                    horizontal={true}
                    pagingEnabled={true}

                    theme={{
                        todayBackgroundColor: StylesButtons.active.backgroundColor,
                        todayTextColor: StylesTexts.linkColor.color,
                        selectedDayBackgroundColor: StylesTexts.linkColor.color,
                        selectedDayTextColor: StylesButtons.active.backgroundColor
                    }}
                />
            </View>
        </ScrollView>
    );
}

export default CalendarScreen;
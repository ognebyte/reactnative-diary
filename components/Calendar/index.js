import React, { useState, useEffect, useMemo } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { Text, View, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';

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
import Styles from './style'

import ArrowForward from '../../assets/svg/arrow-forward'
import ArrowBack from '../../assets/svg/arrow-back'

const CalendarScreen = () => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'subject'
    const table_subjects = 'subjects'

    const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));
    const [currentMonth, setCurrentMonth] = useState(moment().format('M'));

    const [tasks, setTasks] = useState([])
    const [markedDates, setMarkedDates] = useState({})

    const [loadingMonth, setLoadingMonth] = useState(true)
    const [loadingDay, setLoadingDay] = useState(false)
    
    const mark = ({marked: true, dotColor: 'red'})

    useMemo(() => {
        setLoadingDay(true)
        let startDay = moment(selectedDay).valueOf()
        let endDay = moment(selectedDay).valueOf() + 24*60*60*1000
        db.transaction(tx => {
            tx.executeSql(`SELECT
                ${table_subjects}.id AS subjects_id,
                ${table_subjects}.title AS subjects_title,
                ${table_subjects}.createdBy AS subjects_createdBy,

                ${table}.id AS subject_id,
                ${table}.subject_id AS subject_subject_id,
                ${table}.title AS subject_title,
                ${table}.description AS subject_description,
                ${table}.grade AS subject_grade,
                ${table}.isComplete AS subject_isComplete,
                ${table}.createdAt AS subject_createdAt,
                ${table}.deadline AS subject_deadline
                FROM ${table}, ${table_subjects} WHERE deadline >= ? AND deadline < ? AND subjects_id = subject_subject_id ORDER BY deadline`,
                [startDay, endDay],

                (_, res) => {
                    setTasks(res.rows._array)
                    setLoadingDay(false)
                },
                (_, error) => console.log(error)
            )
        })
    }, [selectedDay]);

    useMemo(() => {
        setLoadingMonth(true)
        let firstDay = new Date(moment().format('YYYY'), currentMonth-1, 1).valueOf()
        let lastDay = new Date(moment().format('YYYY'), currentMonth, 1).valueOf()
        
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM ${table} WHERE deadline >= ? AND deadline < ? ORDER BY deadline DESC`, [firstDay, lastDay],
                (_, res) => {
                    var dates = {}
                    res.rows._array?.map(row => {
                        if(!row.isComplete) Object.assign(dates, {[moment(row.deadline).format('YYYY-MM-DD')]: mark})
                    })
                    setMarkedDates(dates)
                    setLoadingMonth(false)
                },
                (_, error) => console.log(error)
            )
        })
    }, [currentMonth]);

    return (
        <ScrollView refreshControl={ <RefreshControl refreshing={loadingMonth} enabled={false}/> }>
            <View style={{flex: 1}}>
                <CalendarList
                    markedDates={{...markedDates, [selectedDay]: {selected: true, disableTouchEvent: true}}}
                    onMonthChange={date => setCurrentMonth(date.month)}
                    onDayPress={day => setSelectedDay(moment(day.timestamp).format('YYYY-MM-DD'))}

                    renderArrow={(direction) => {return direction === 'left' ? <ArrowBack size={20}/> : <ArrowForward size={20}/>}}
                    hideArrows={false}
                    horizontal={true}
                    pagingEnabled={true}
                    firstDay={1}

                    theme={{
                        todayBackgroundColor: StylesButtons.active.backgroundColor,
                        todayTextColor: StylesTexts.linkColor.color,
                        selectedDayBackgroundColor: StylesTexts.linkColor.color,
                        selectedDayTextColor: StylesButtons.active.backgroundColor
                    }}
                />
            </View>
            {
                loadingDay ? <ActivityIndicator animating={true} size={'large'} color={'black'} style={StylesContainers.screen}/>
                :
                <View style={[StylesContainers.screen, {alignItems: 'center', gap: 30}]}>
                    <View>
                        <Text style={StylesTexts.default}> {moment(selectedDay).format('D MMMM')} </Text>
                    </View>
                    
                    {
                        (tasks?.length || 0) === 0 ?
                        <Text style={[StylesContainers.alert, StylesTexts.default, {padding: 40}]}> Ничего не запланировано </Text>
                        :
                        <View style={{flex: 1, width: '100%', height: 110 * tasks.length}}>
                            <FlashList
                                data={tasks}
                                estimatedItemSize={110}
                                scrollEnabled={false}
                                renderItem={({item}) => (
                                    <View key={item.subject_id} style={Styles.dayContainer}>
                                        <Text style={StylesTexts.big}> {moment(item.subject_deadline).format('HH:mm')} </Text>
                                        <TouchableOpacity style={[Styles.day, {backgroundColor: item.subject_isComplete ? 'green' : 'red'}]}>
                                            <Text style={StylesTexts.big}>
                                                {item.subject_title}
                                            </Text>
                                            <Text style={[StylesTexts.small, StylesTexts.fadeColor]}>
                                                {item.subjects_title}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    }
                </View>
            }
        </ScrollView>
    );
}

export default CalendarScreen;
import React, { useState, useEffect, useMemo } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { Text, View, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Modal from "react-native-modal";

LocaleConfig.locales['ru'] = {
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
LocaleConfig.defaultLocale = 'ru';

import CalendarItem from './CalendarItem';
import ModalEdit from '../Modals/ModalEdit';
import ModalAdd from '../Modals/ModalAdd';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './style'

import ArrowForward from '../../assets/svg/arrow-forward'
import ArrowBack from '../../assets/svg/arrow-back'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const CalendarScreen = () => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'subject'
    const table_subjects = 'subjects'

    const [loading, setLoading] = useState(false)
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));
    const [selectedMonth, setSelectedMonth] = useState(moment().format('M'));

    const [tasks, setTasks] = useState([])
    const [markedDates, setMarkedDates] = useState({})

    const [trigger, setTrigger] = useState(true)
    const [loadingMonth, setLoadingMonth] = useState(true)
    const [loadingDay, setLoadingDay] = useState(false)
    const mark = ({marked: true, dotColor: 'red'})

    const [itemId, setItemId] = useState(null)
    const [item, setItem] = useState({})
    
    const refresh = React.useCallback(() => {
        setTrigger(!trigger)
        setLoading(false)
    }, []);

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
    }, [selectedDay, trigger]);

    useMemo(() => {
        setLoadingMonth(true)
        let firstDay = new Date(moment().format('YYYY'), selectedMonth-1, 1).valueOf()
        let lastDay = new Date(moment().format('YYYY'), selectedMonth, 1).valueOf()
        
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM ${table} WHERE deadline >= ? AND deadline < ? ORDER BY deadline DESC`, [firstDay, lastDay],
                (_, res) => {
                    var dates = {}
                    res.rows._array?.map(row => {
                        Object.assign(dates, {[moment(row.deadline).format('YYYY-MM-DD')]: mark})
                    })
                    setMarkedDates(dates)
                    setLoadingMonth(false)
                },
                (_, error) => console.log(error)
            )
        })
    }, [selectedMonth, trigger]);

    const setIsComplete = (id, value) => {
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET isComplete = ? WHERE id = ?`, [value, id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...tasks];
                        const indexToUpdate = rows.findIndex(item => item.subject_id === id);
                        rows[indexToUpdate].subject_isComplete = value;
                        setTasks(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    const addSubject = (title) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (title) VALUES (?)`, [title],
                (_, res) => {
                    setSubjects(
                        item => [
                            {id: res.insertId, title: title},
                            ...item
                        ]
                    )
                },
                (_, error) => console.log(error)
            );
        });
    }
    
    const saveInputs = (title, description, grade, dt) => {
        let datetime = null
        if (dt) datetime = Date.parse(dt)
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET title = ?, description = ?, grade = ?, deadline = ? WHERE id = ?`,
                [title, description, grade, datetime, itemId],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...tasks];
                        const indexToUpdate = rows.findIndex(item => item.subject_id === itemId);
                        rows[indexToUpdate].subject_title = title;
                        rows[indexToUpdate].subject_description = description;
                        rows[indexToUpdate].subject_grade = grade;
                        rows[indexToUpdate].subject_deadline = datetime;
                        setTasks(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    const deleteSubjectTask = (id) => {
        db.transaction(tx =>
            tx.executeSql(`DELETE FROM ${table} WHERE id = ?`, [id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        let items = [...tasks]
                        items.splice(tasks.findIndex((item) => { return item.id === id }), 1)
                        setTasks(items)
                        setTrigger(!trigger)
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}>
            <View style={{flex: 1, margin: 20, borderRadius: 15, overflow: 'hidden'}}>
                <CalendarList
                    markedDates={{
                        ...markedDates,
                        [selectedDay]: {
                            selected: true, disableTouchEvent: true,
                            marked: selectedDay in markedDates, dotColor: StylesButtons.active.backgroundColor
                        }
                    }}
                    onMonthChange={date => setSelectedMonth(date.month)}
                    onDayPress={day => setSelectedDay(moment(day.timestamp).format('YYYY-MM-DD'))}
                    displayLoadingIndicator={loadingMonth}
                    
                    renderArrow={(direction) => {return direction === 'left' ? <ArrowBack size={20}/> : <ArrowForward size={20}/>}}
                    hideArrows={false}
                    horizontal={true}
                    pagingEnabled={true}
                    firstDay={1}
                    calendarWidth={windowWidth - 20*2}

                    theme={{
                        indicatorColor: 'black',
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
                    {/* <View style={[StylesContainers.alert, {width: '100%', padding: 10}]}>
                        <Text style={StylesTexts.default}> {moment(selectedDay).format('D MMMM')} </Text>
                    </View> */}
                    <View style={{flex: 1, width: '100%', height: 110 * (tasks.length + 1)}}>
                        <FlashList
                            data={tasks}
                            estimatedItemSize={110}
                            scrollEnabled={false}
                            ListEmptyComponent={() => <Text style={[StylesContainers.alert, StylesTexts.default, {padding: 40}]}> Ничего не запланировано </Text>}
                            ItemSeparatorComponent={() => (
                                <View style={{alignSelf: 'center', width: '80%', height: 1.6, marginBottom: 20, borderRadius: 50, backgroundColor: '#B3B3B3'}}/>
                            )}
                            renderItem={({item}) => (
                                <TouchableOpacity key={item.subject_id}
                                    activeOpacity={1}
                                    style={{marginBottom: 20}}
                                    onPress={() => {
                                        setModalEdit(true)
                                        setItemId(item.subject_id)
                                        setItem({
                                            title: item.subject_title,
                                            description: item.subject_description,
                                            grade: item.subject_grade,
                                            deadline: item.subject_deadline,
                                        })
                                    }}
                                >
                                    <CalendarItem
                                        item={item}
                                        setComplete={() => setIsComplete(item.subject_id, item.subject_isComplete ? 0 : 1)}
                                        setDelete={() => deleteSubjectTask(item.subject_id)}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            }

            {/* Modal Edit */}
            {
                !modalEdit ? null :
                <ModalEdit show={(e) => {setModalEdit(false); if(e) setTrigger(!trigger)}}
                    title={item.title}
                    grade={item.grade.toString()}
                    description={item.description}
                    deadline={item.deadline}
                    descriptionShow={true} extraShow={true}
                    saveInputs={(t, d, g, dt) => saveInputs(t, d, g, dt)}
                />
            }

            {/* Modal Add */}
            {
                !modalAdd ? null :
                <ModalAdd show={() => setModalAdd(false)}
                    addInputs={(t, d, g, dt) => addSubject(t, d, g, dt)}
                />
            }
        </ScrollView>
    );
}

export default CalendarScreen;
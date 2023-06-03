import React, { useState, useEffect, useMemo, Component } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, Chip } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import * as SQLite from 'expo-sqlite'
import moment from 'moment';

import Colors from '../style/colors';
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesSchedule from '../Schedule/styles';
import Styles from './styles';

import ModalEdit from '../Modals/ModalEdit';
import TaskItem from './TaskItem';

import Chevron from 'assets/svg/chevron';
import Check from 'assets/svg/check';


const HomeRoute = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const [tasks, setTasks] = useState([])
    const [notes, setNotes] = useState([])
    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalEditNote, setModalEditNote] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState()
    const [selectedNote, setSelectedNote] = useState()
    
    const [loadingTasks, setLoadingTasks] = useState(true)
    const [loadingNote, setLoadingNote] = useState(true)
    const [filterTasks, setFilterTasks] = useState({
        upcoming: false,
        past: false,
        done: false,
        undone: false,
    })

    const refresh = () => {
        setLoading(true)
        loadTasks()
        loadNote()
        loadSchedule()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    };

    useEffect(() => {
        refresh()
        loadNote()
    }, [])
    
    useEffect(() => {
        loadTasks()
    }, [filterTasks])

    const loadTasks = () => {
        setLoadingTasks(true)
        db.transaction(tx =>
                tx.executeSql(`SELECT
                    assignments.id as assignments_id,
                    assignments.title as assignments_title,
                    assignments.description as assignments_description,
                    assignments.grade as assignments_grade,
                    assignments.isComplete as assignments_isComplete,
                    assignments.createdAt as assignments_createdAt,
                    assignments.deadline as assignments_deadline,
                    subjects.id as subjects_id,
                    subjects.title as subjects_title
                    FROM assignments
                    LEFT JOIN subjects ON subjects.id = assignments.subject_id`, [],
                (_, res) => {
                    const tasksArray = []
                    res.rows._array.map(item => {
                        if (item.assignments_deadline) {
                            if (filterTasks.upcoming) {
                                if (moment(item.assignments_deadline).isAfter(new Date())) {
                                    tasksArray.unshift(item);
                                    return;
                                }
                            }
                            if (filterTasks.past) {
                                if (moment(item.assignments_deadline).isBefore(new Date())) {
                                    tasksArray.unshift(item);
                                    return;
                                }
                            }
                        }
                        if (filterTasks.undone) {
                            if (!item.assignments_isComplete) {
                                tasksArray.unshift(item);
                                return;
                            }
                        }
                        if (filterTasks.done) {
                            if (item.assignments_isComplete) {
                                tasksArray.unshift(item);
                                return;
                            }
                        }
                        if (!filterTasks.upcoming && !filterTasks.past && !filterTasks.undone && !filterTasks.done) {
                            tasksArray.unshift(item);
                            return;
                        }
                    });
                    setTasks(tasksArray);
                    setLoadingTasks(false);
                },
                (_, error) => console.log(error)
            )
        )
    }

    const loadSchedule = () => {
        db.transaction(tx =>
            tx.executeSql(
                `SELECT schedule.*, subjects.title FROM schedule
                JOIN subjects ON schedule.subject_id = subjects.id
                WHERE schedule.week = ?
                ORDER BY place`
                , [moment().format('d')],
                (_, res) => {
                    setSchedule(res.rows._array)
                },
                (_, error) => console.log(error)
            )
        )
    }
    
    const loadNote = () => {
        setLoadingNote(true)
        setNotes([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM notes ORDER BY id DESC`, [],
            (_, res) => {
                    setNotes(res.rows._array)
                    setLoadingNote(false)
                },
                (_, error) => console.log(error)
            )
        )
    }

    const saveInputs = (title, description, grade, dt, isComplete) => {
        let datetime = null
        if (dt) datetime = Date.parse(dt)
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE assignments SET title = ?, description = ?, grade = ?, deadline = ?, isComplete = ? WHERE id = ? AND subject_id = ?`,
                [title, description, grade, datetime, isComplete, selectedAssignment.assignments_id, selectedAssignment.subjects_id],
                (_, res) => {
                    loadTasks()
                },
                (_, error) => console.log(error)
            )
        )
    }
    
    const saveInputsNote = (title, description) => {
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE notes SET title = ?, description = ? WHERE id = ?`,
                [title, description, selectedNote.id],
                (_, res) => {
                    loadNote()
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
            showsVerticalScrollIndicator={false}
        >
            {
                !modalEdit ? null :
                <ModalEdit show={() => setModalEdit(false)}
                    title={selectedAssignment.assignments_title}
                    isComplete={selectedAssignment.assignments_isComplete}
                    grade={selectedAssignment.assignments_grade.toString()}
                    description={selectedAssignment.assignments_description}
                    deadline={selectedAssignment.assignments_deadline}
                    descriptionShow={true} extraShow={true}
                    saveInputs={(t, d, g, dt, ic) => saveInputs(t, d, g, dt, ic)}
                />
            }
            {
                !modalEditNote ? null :
                <ModalEdit show={() => setModalEditNote(false)}
                    title={selectedNote.title} isComplete={null}
                    descriptionShow={true}
                    description={selectedNote.description}
                    saveInputs={(t, d) => saveInputsNote(t, d)}
                />
            }
            <View style={StylesContainers.default}>
                <View style={[Styles.background, {backgroundColor: StylesTexts.linkColor.color}]}>
                    <View style={{margin: 30}}>
                        <Text style={[StylesTexts.big, StylesTexts.lightColor]}>
                            Сегодня: {moment().format('dddd, D MMMM')}
                        </Text>
                    </View>
                </View>
                <View style={[Styles.content]}>

                    <View style={{padding: 15, gap: 10}}>
                        <Text style={[StylesTexts.big]}> Расписание </Text>
                        <View style={Styles.scrollViewItemsContainer}>
                            <FlashList
                                data={schedule}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={100}
                                contentContainerStyle={{padding: StylesContainers.screen.padding}}
                                ListEmptyComponent={() => (
                                    <View style={StylesContainers.default}>
                                        <View style={[StylesContainers.alert, {width: 200, height: 110}]}>
                                            <Text style={StylesTexts.default}>
                                                Нет записей
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                renderItem={({item}) => (
                                    <View style={{flexDirection: 'row', marginBottom: 15, alignItems: 'center', gap: 15}}>
                                        <Text style={StylesTexts.default}>{item.place}</Text>
                                        <View style={StylesSchedule.dayItemContainer}>
                                            <View style={StylesSchedule.dayItem}>
                                                <View style={StylesSchedule.daySubject}>
                                                    <Text style={StylesTexts.default} numberOfLines={1}>{item.title}</Text>
                                                </View>
                                                <View style={StylesSchedule.dayInfoContainer}>
                                                    { !item.courseType ? null :
                                                        <View style={StylesSchedule.dayInfo}>
                                                            <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Тип занятия</Text>
                                                            <Text style={StylesTexts.default} numberOfLines={1}>{item.courseType}</Text>
                                                        </View>
                                                    }
                                                    { !item.location ? null :
                                                        <View style={StylesSchedule.dayInfo}>
                                                            <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Кабинет</Text>
                                                            <Text style={StylesTexts.default} numberOfLines={1}>{item.location}</Text>
                                                        </View>
                                                    }
                                                    { !item.instructor ? null :
                                                        <View style={[StylesSchedule.dayInfo, {flex: 2}]}>
                                                            <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Преподаватель</Text>
                                                            <Text style={StylesTexts.default} numberOfLines={1}>{item.instructor}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                            <TouchableRipple style={Styles.buttonFooterContainer}
                                onPress={() => navigation.navigate("ScheduleStack")}
                            >
                                <View style={Styles.buttonFooter}>
                                    <Text style={StylesTexts.default}> Посмотреть все </Text>
                                    <Chevron size={20} color={'black'}/>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>

                    <View style={{padding: 15, gap: 10}}>
                        <Text style={[StylesTexts.big]}> Задачи </Text>
                        <View style={Styles.scrollViewItemsContainer}>
                            <ScrollView horizontal={true} style={Styles.scrollViewItemsHeader}
                                contentContainerStyle={{paddingHorizontal: 10}}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Button mode='contained-tonal'
                                    onPress={() => setFilterTasks(Object.assign({}, filterTasks, {upcoming: !filterTasks.upcoming}))}
                                    buttonColor={filterTasks.upcoming ? Colors.primary : Colors.inactive}
                                    icon={filterTasks.upcoming ? Check : null}
                                    style={Styles.buttonHeader}
                                >
                                    <Text style={StylesTexts.small}> Предстоящие </Text>
                                </Button>

                                <Button mode='contained-tonal'
                                    onPress={() => setFilterTasks(Object.assign({}, filterTasks, {past: !filterTasks.past}))}
                                    buttonColor={filterTasks.past ? Colors.primary : Colors.inactive}
                                    icon={filterTasks.past ? Check : null}
                                    style={Styles.buttonHeader}
                                >
                                    <Text style={StylesTexts.small}> Прошедшие </Text>
                                </Button>

                                <Button mode='contained-tonal'
                                    onPress={() => setFilterTasks(Object.assign({}, filterTasks, {undone: !filterTasks.undone}))}
                                    buttonColor={filterTasks.undone ? Colors.primary : Colors.inactive}
                                    icon={filterTasks.undone ? Check : null}
                                    style={Styles.buttonHeader}
                                >
                                    <Text style={StylesTexts.small}> Не выполненные </Text>
                                </Button>

                                <Button mode='contained-tonal'
                                    onPress={() => setFilterTasks(Object.assign({}, filterTasks, {done: !filterTasks.done}))}
                                    buttonColor={filterTasks.done ? Colors.primary : Colors.inactive}
                                    icon={filterTasks.done ? Check : null}
                                    style={Styles.buttonHeader}
                                >
                                    <Text style={StylesTexts.small}> Выполненные </Text>
                                </Button>
                            </ScrollView>
                            <View style={Styles.scrollViewItems}>
                                <View style={{paddingVertical: 15}}>
                                    {
                                        !loadingTasks ? null :
                                        <ActivityIndicator size={30} color={'black'} style={Styles.loading} />
                                    }
                                    { tasks?.length === 0 ?
                                        <View style={[StylesContainers.default, {marginVertical: 5}]}>
                                            <View style={[StylesContainers.alert, {width: 200, height: 110}]}>
                                                <Text style={StylesTexts.default}>
                                                    Нет записей
                                                </Text>
                                            </View>
                                        </View>
                                        :
                                        <FlashList
                                            data={tasks}
                                            keyExtractor={(item) => `${item.assignments_id}_${item.subjects_id}`}
                                            estimatedItemSize={210}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{paddingHorizontal: StylesContainers.screen.padding}}
                                            renderItem={
                                                ({item}) => (
                                                    <TouchableOpacity activeOpacity={1}
                                                        style={{marginVertical: 5, marginRight: 15}}
                                                        onPress={() => {setSelectedAssignment(item); setModalEdit(true)}}
                                                    >
                                                        <TaskItem item={item}/>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        />
                                    }
                                </View>
                                <TouchableRipple style={Styles.buttonFooterContainer}
                                    onPress={() => navigation.navigate("SubjectsStack")}
                                >
                                    <View style={Styles.buttonFooter}>
                                        <Text style={StylesTexts.default}> Посмотреть все </Text>
                                        <Chevron size={20} color={'black'}/>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                    
                    <View style={{padding: 15, gap: 10}}>
                        <Text style={[StylesTexts.big]}> Заметки </Text>
                        <View style={Styles.scrollViewItemsContainer}>
                            <View style={Styles.scrollViewItems}>
                                <View style={{paddingVertical: 15}}>
                                    {
                                        !loadingNote ? null :
                                        <ActivityIndicator size={30} color={'black'} style={Styles.loading} />
                                    }
                                    { notes?.length === 0 ?
                                        <View style={[StylesContainers.default, {marginVertical: 5}]}>
                                            <View style={[StylesContainers.alert, {width: 200, height: 110}]}>
                                                <Text style={StylesTexts.default}>
                                                    Нет записей
                                                </Text>
                                            </View>
                                        </View>
                                        :
                                        <FlashList
                                            data={notes}
                                            keyExtractor={(item) => item.id}
                                            estimatedItemSize={210}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{paddingHorizontal: StylesContainers.screen.padding}}
                                            renderItem={
                                                ({item}) => (
                                                    <TouchableOpacity activeOpacity={1}
                                                        style={{marginVertical: 5, marginRight: 15}}
                                                        onPress={() => {setSelectedNote(item); setModalEditNote(true)}}
                                                    >
                                                        <View style={Styles.noteItem}>
                                                            <Text style={StylesTexts.medium} numberOfLines={2}>
                                                                {item.title}
                                                            </Text>
                                                            {
                                                                !item.description ? null :
                                                                <Text style={[StylesTexts.small, {color: Colors.darkFade}]}
                                                                    numberOfLines={4}
                                                                >
                                                                    {item.description}
                                                                </Text>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        />
                                    }
                                </View>
                                <TouchableRipple style={Styles.buttonFooterContainer}
                                    onPress={() => navigation.navigate("Notes")}
                                >
                                    <View style={Styles.buttonFooter}>
                                        <Text style={StylesTexts.default}> Посмотреть все </Text>
                                        <Chevron size={20} color={'black'}/>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeRoute;
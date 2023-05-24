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
import Styles from './styles';

import TaskItem from './TaskItem';
import NoteItem from './NoteItem';

import Chevron from 'assets/svg/chevron';
import Check from 'assets/svg/check';


const HomeRoute = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    
    const [loadingTasks, setLoadingTasks] = useState(true)
    const [filterTasks, setFilterTasks] = useState({
        upcoming: false,
        past: false,
        done: false,
        undone: false,
    })

    const [loadingCourse, setLoadingCourse] = useState(true)

    const refresh = () => {
        loadTasks()
        setLoading(false)
    };

    useEffect(() => {
        refresh()
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

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}>
            <View style={StylesContainers.default}>
                <View style={[Styles.background, {backgroundColor: StylesTexts.linkColor.color}]}>
                    <View style={{margin: 30}}>
                        <Text style={[StylesTexts.big, StylesTexts.lightColor]}> Сегодня: {moment().format('DD MMMM')} </Text>
                    </View>
                </View>
                <View style={[Styles.content]}>
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
                                {/* <TouchableRipple onPress={() => {}}
                                    style={[Styles.buttonHeader, {backgroundColor: Colors.primary}]}
                                >
                                    <Text style={StylesTexts.default}> Заметки </Text>
                                </TouchableRipple>
                                <TouchableRipple onPress={() => {}}
                                    style={[Styles.buttonHeader, {backgroundColor: Colors.light}]}
                                >
                                    <Text style={StylesTexts.default}> Предметы </Text>
                                </TouchableRipple> */}
                            <View style={Styles.scrollViewItems}>
                                <View style={{paddingVertical: 15}}>
                                    {
                                        !loadingTasks ? null :
                                        <ActivityIndicator size={30} color={'black'} style={Styles.loading} />
                                    }
                                    { tasks.length === 0 ?
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
                                                        onPress={() => {
                                                            alert(`${item.assignments_title}, ${item.assignments_description}, ${moment(item.assignments_deadline).format('LLLL')}`)
                                                        }}
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
                    
                    {/* <View style={{padding: 15, gap: 10}}>
                        <Text style={[StylesTexts.big]}> Заметки </Text>
                        <View style={Styles.scrollViewItemsContainer}>
                            <View style={Styles.scrollViewItems}>
                                <ScrollView horizontal={true} style={{}}
                                    contentContainerStyle={{paddingVertical: 15}}
                                >
                                    <View style={Styles.scrollView}>
                                        {
                                            tasks.map(
                                                (task) => {
                                                    return (
                                                        <View key={task.id} style={{flex: 1}}>
                                                            <NoteItem item={task}/>
                                                        </View>
                                                    )
                                                }
                                            )
                                        }
                                    </View>
                                </ScrollView>
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
                    </View> */}

                    <View style={{gap: 20}}>

                        {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
                        
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                            onPress={() => navigation.navigate("ClassesStack")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Курсы </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeRoute;
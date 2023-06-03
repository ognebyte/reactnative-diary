import React, { useState, useRef, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { FlashList } from "@shopify/flash-list";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, FAB } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'
import StylesReport from './styles/report'

import Assignment from "./Assignment";
import ModalEdit from '../Modals/ModalEdit'
import ModalAdd from '../Modals/ModalAdd'

import IconPlus from '../../assets/svg/plus'


const SubjectScreen = ({ route, navigation }) => {
    const subject_id = route.params.subjectId
    const subjectTitle = route.params.subjectTitle

    const db = SQLite.openDatabase('diary.db')
    const table = 'assignments'
    const screenPadding = StylesContainers.screen.padding
    const [subjectAssignment, setSubjectAssignment] = useState([])
    const [assignmentsCount, setAssignmentsCount] = useState(0)
    const [assignmentsCountDone, setAssignmentsCountDone] = useState(0)
    const [loading, setLoading] = useState(true)

    const [modalMore, setModalMore] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    
    const [itemId, setItemId] = useState('')
    const [item, setItem] = useState({})

    const refresh = React.useCallback(() => {
        getAllSubjectAssignment()
        getAssignmentCount()
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);
    
    useEffect(() => {
        getAssignmentCount()
    }, [subjectAssignment])

    useEffect(() => {
        navigation.setOptions({ headerTitle: subjectTitle })
        refresh()
    }, [])
    
    const getAllSubjectAssignment = () => {
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM ${table} WHERE subject_id = ? ORDER BY id DESC`, [subject_id],
                (_, res) => {
                    setSubjectAssignment(res.rows._array)
                },
                (_, error) => console.log(error)
            );
        })
    }
    
    const getAssignmentCount = () => {
        db.transaction(tx => {
            tx.executeSql(`SELECT COUNT(id) as count FROM ${table} WHERE subject_id = ?;`, [subject_id],
                (_, res) => {
                    setAssignmentsCount(res.rows.item(0).count)
                },
                (_, error) => console.log(error)
            );
            tx.executeSql(`SELECT COUNT(id) as countDone FROM ${table} WHERE subject_id = ? AND isComplete = 1;`, [subject_id],
                (_, res) => {
                    setAssignmentsCountDone(res.rows.item(0).countDone)
                },
                (_, error) => console.log(error)
            );
        })
    }

    const addSubjectAssignment = (title, description, grade, dt) => {
        let datetime = null
        if (dt) datetime = Date.parse(dt)
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (subject_id, title, description, grade, isComplete, createdAt, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [subject_id, title, description, grade, 0, Date.now(), datetime],
                (_, res) => {
                    setSubjectAssignment(
                        item => [
                            {id: res.insertId, title: title, description: description, grade: grade, isComplete: 0, createdAt: Date.now(), deadline: datetime},
                            ...item
                        ]
                    )
                },
                (_, error) => console.log(error)
            );
        });
        setModalAdd(false)
    }

    const deleteSubjectAssignment = (id) => {
        db.transaction(tx =>
            tx.executeSql(`DELETE FROM ${table} WHERE id = ? AND subject_id = ?`, [id, subject_id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        let items = [...subjectAssignment]
                        items.splice(subjectAssignment.findIndex((item) => { return item.id === id }), 1)
                        setSubjectAssignment(items)
                    }
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
                `UPDATE ${table} SET title = ?, description = ?, grade = ?, deadline = ?, isComplete = ? WHERE id = ? AND subject_id = ?`,
                [title, description, grade, datetime, isComplete, itemId, subject_id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        // Обновляем данные
                        var rows = [...subjectAssignment];
                        const indexToUpdate = rows.findIndex(item => item.id === itemId);
                        rows[indexToUpdate].title = title;
                        rows[indexToUpdate].description = description;
                        rows[indexToUpdate].grade = grade;
                        rows[indexToUpdate].deadline = datetime;
                        rows[indexToUpdate].isComplete = isComplete;
                        setSubjectAssignment(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    const setIsComplete = (id, value) => {
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET isComplete = ? WHERE id = ? AND subject_id = ?`, [value, id, subject_id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...subjectAssignment];
                        const indexToUpdate = rows.findIndex(item => item.id === id);
                        rows[indexToUpdate].isComplete = value;
                        setSubjectAssignment(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            <View style={StylesReport.reportRow}>
                <View style={StylesReport.count}>
                    <Text style={StylesReport.textBig}> {assignmentsCount} </Text>
                    <Text style={StylesReport.textSmall}> Задач </Text>
                </View>
                <View style={StylesContainers.verticalSeparator}/>
                <View style={StylesReport.count}>
                    <Text style={StylesReport.textBig}> {assignmentsCountDone} </Text>
                    <Text style={StylesReport.textSmall}> Сделано </Text>
                </View>
            </View>

            <FlashList
                data={subjectAssignment}
                estimatedItemSize={130}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{paddingTop: screenPadding, paddingBottom: screenPadding*3}}
                refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
                ListEmptyComponent={() => (
                    <View style={[StylesContainers.screen, StylesContainers.default]}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            onPress={
                                () => {
                                    setItemId(item.id)
                                    setItem({
                                        title: item.title,
                                        grade: item.grade,
                                        description: item.description,
                                        deadline: item.deadline,
                                        isComplete: item.isComplete
                                    })
                                    setModalEdit(true);
                                }
                            }
                            style={{marginBottom: screenPadding}}
                        >
                            <Assignment
                                item={item}
                                setDelete={() => deleteSubjectAssignment(item.id)}
                                setComplete={() => setIsComplete(item.id, item.isComplete ? 0 : 1)}
                            />
                        </TouchableOpacity>
                    )
                }
            />

            {/* Modal Edit */}
            {
                !modalEdit ? null :
                <ModalEdit show={() => setModalEdit(false)}
                    title={item.title}
                    isComplete={item.isComplete}
                    grade={item.grade.toString()}
                    description={item.description}
                    deadline={item.deadline}
                    descriptionShow={true} extraShow={true}
                    saveInputs={(t, d, g, dt, ic) => saveInputs(t, d, g, dt, ic)}
                />
            }

            {/* Modal Add */}
            {
                !modalAdd ? null :
                <ModalAdd show={() => setModalAdd(false)}
                    descriptionShow={true} extraShow={true}
                    addInputs={(t, d, g, dt) => addSubjectAssignment(t, d, g, dt)}
                />
            }
            

            {/* Button Add */}
            <FAB icon={IconPlus}
                size='medium'
                color='black'
                style={[StylesButtons.active, StylesButtons.buttonFloat]}
                onPress={() => setModalAdd(true)}
            />
        </View>
    );
};

export default SubjectScreen;
import React, { useState, useRef, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { FlashList } from "@shopify/flash-list";
import { Modal, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl, Switch } from 'react-native';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'

import Task from "./Task";
import ModalEdit from '../Modals/ModalEdit'
import ModalAdd from '../Modals/ModalAdd'

import IconPlus from '../../assets/svg/plus'


const Tasks = (props) => {
    const table = 'subject'
    const db = SQLite.openDatabase(`${table}.db`)
    const subject_id = props.subjectId
    const screenPadding = StylesContainers.screen.padding
    const [subjectTask, setSubjectTask] = useState([])
    const [loading, setLoading] = useState(true)

    const [modalMore, setModalMore] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    
    const [itemId, setItemId] = useState('')
    const [itemTitle, setItemTitle] = useState('')
    const [itemGrade, setItemGrade] = useState('')
    const [itemDescription, setItemDescription] = useState("")
    const [itemDeadline, setItemDeadline] = useState("")

    const refresh = React.useCallback(() => {
        getAllSubjectTask()
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);

    useEffect(
        () => {
            refresh()
        }, []
    )
    
    const getAllSubjectTask = () => {
        setSubjectTask([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} WHERE subject_id = ? ORDER BY id DESC`, [subject_id],
                (_, res) => {
                    var rows = []
                    for (let i = 0; i < res.rows.length; i++) {
                        rows.push(res.rows.item(i))
                    }
                    setSubjectTask(rows)
                },
                (_, error) => console.log(error)
            )
        )
    }

    const addSubjectTask = (title, description, grade, dt) => {
        let datetime = null
        if (dt) datetime = Date.parse(dt)
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (subject_id, title, description, grade, isComplete, createdAt, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [subject_id, title, description, grade, 0, Date.now(), datetime],
                (_, res) => {
                    setSubjectTask(
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

    const deleteSubjectTask = (id) => {
        db.transaction(tx =>
            tx.executeSql(`DELETE FROM ${table} WHERE id = ? AND subject_id = ?`, [id, subject_id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        let items = [...subjectTask]
                        items.splice(subjectTask.findIndex((item) => { return item.id === id }), 1)
                        setSubjectTask(items)
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }
    
    const saveInputs = (title, description, grade, dt) => {
        let datetime = null
        if (dt) datetime = Date.parse(dt)
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET title = ?, description = ?, grade = ?, deadline = ? WHERE id = ? AND subject_id = ?`,
                [title, description, grade, datetime, itemId, subject_id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...subjectTask];
                        const indexToUpdate = rows.findIndex(item => item.id === itemId);
                        rows[indexToUpdate].title = title;
                        rows[indexToUpdate].description = description;
                        rows[indexToUpdate].grade = grade;
                        rows[indexToUpdate].deadline = datetime;
                        setSubjectTask(rows);
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
                        var rows = [...subjectTask];
                        const indexToUpdate = rows.findIndex(item => item.id === id);
                        rows[indexToUpdate].isComplete = value;
                        setSubjectTask(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            {
                !subjectTask ? null : subjectTask.length === 0 ?
                <View style={[StylesContainers.screen, StylesContainers.default]}>
                    <Text style={[StylesTexts.default, StylesContainers.alert]}> Нет записей </Text>
                </View>
                :
                <FlashList
                    data={subjectTask}
                    estimatedItemSize={130}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{padding: screenPadding, paddingBottom: screenPadding*3}}
                    refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
                    renderItem={
                        ({item}) => (
                            <TouchableOpacity activeOpacity={1}
                                onLongPress={
                                    () => {
                                        setItemId(item.id)
                                        setItemTitle(item.title)
                                        setItemGrade(item.grade)
                                        setItemDescription(item.description)
                                        setItemDeadline(item.deadline)
                                        setModalMore(true)
                                    }
                                }
                                onPress={
                                    () => {
                                        setItemId(item.id)
                                        setItemTitle(item.title)
                                        setItemGrade(item.grade)
                                        setItemDescription(item.description)
                                        setItemDeadline(item.deadline);
                                        setModalEdit(true);
                                    }
                                }
                                style={{marginBottom: screenPadding}}
                            >
                                <Task
                                    title={item.title}
                                    grade={item.grade}
                                    description={item.description}
                                    isComplete={item.isComplete}
                                    createdAt={item.createdAt}
                                    deadline={item.deadline}
                                    setDelete={() => deleteSubjectTask(item.id)}
                                    setComplete={() => setIsComplete(item.id, item.isComplete ? 0 : 1)}
                                />
                            </TouchableOpacity>
                        )
                    }
                />
            }

            {/* Modal More */}
            <Modal
                visible={modalMore}
                animationType='fade'
                transparent={true}
                statusBarTranslucent={true}
            >
                <View style={[{flex: 1, justifyContent: 'center'}, StylesContainers.modalBackground]}>
                    <View style={[StylesContainers.modal, { gap: 20 }]}>
                        <TouchableOpacity activeOpacity={ 0.5 }
                            onPress={() => { deleteSubjectTask(itemId); setModalMore(false); }}
                            style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.delete]}
                            >
                            <Text style={StylesTexts.default}> Удалить </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={ 0.5 }
                            onPress={() => { setModalEdit(true); setModalMore(false); }}
                            style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.edit]}
                        > 
                            <Text style={StylesTexts.default}> Изменить </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={ 0.5 }
                            onPress={() => setModalMore(false)}
                            style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.cancel]}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Закрыть </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            {/* Modal Edit */}
            {
                !modalEdit ? null :
                <ModalEdit show={() => setModalEdit(false)}
                    title={itemTitle}
                    grade={itemGrade.toString()}
                    description={itemDescription}
                    deadline={itemDeadline}
                    descriptionShow={true} extraShow={true}
                    saveInputs={(t, d, g, dt) => saveInputs(t, d, g, dt)}
                />
            }

            {/* Modal Add */}
            {
                !modalAdd ? null :
                <ModalAdd show={() => setModalAdd(false)}
                    descriptionShow={true} extraShow={true}
                    addInputs={(t, d, g, dt) => addSubjectTask(t, d, g, dt)}
                />
            }
            

            {/* Button Add */}
            <View style={[StylesButtons.buttonFooter, modalAdd ? {display: 'none'} : {display: 'flex'}]}>
                <TouchableOpacity
                    activeOpacity={ 0.5 }
                    style={StylesButtons.addButton}
                    onPress={() => setModalAdd(true)}
                >
                    <IconPlus size={30} color={'black'}/>
                    <Text style={StylesTexts.small}> Создать новое задание </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Tasks;
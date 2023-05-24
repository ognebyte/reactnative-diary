import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import { Modal, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { FlashList } from "@shopify/flash-list";

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'

import Subject from './Subject'
import ModalEdit from '../Modals/ModalEdit'
import ModalAdd from '../Modals/ModalAdd'

import IconPlus from '../../assets/svg/plus'


const SubjectsScreen = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'subjects'
    const tableAssignments = 'assignments'
    const tableWeek = 'week'
    const screenPadding = StylesContainers.screen.padding
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    
    const [modalEdit, setModalEdit] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    
    const [itemId, setItemId] = useState('')
    const [itemTitle, setItemTitle] = useState('')

    const refresh = React.useCallback(() => {
        getAllSubjects()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);

    useEffect(
        () => {
            refresh()
        }, []
    )

    const getAllSubjects = () => {
        setSubjects([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} ORDER BY id DESC`, [],
                (_, res) => setSubjects(res.rows._array),
                (_, error) => console.log(error)
            )
        )
    }

    const deleteSubject = (id) => {
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM ${table} WHERE id = ?`, [id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        let items = [...subjects]
                        items.splice(subjects.findIndex((item) => { return item.id === id }), 1)
                        setSubjects(items)
                    }
                },
                (_, error) => console.log(error)
            );
        })
        db.transaction(tx => {tx.executeSql(`DELETE FROM ${tableAssignments} WHERE subject_id = ?`, [id])})
        db.transaction(tx => {tx.executeSql(`DELETE FROM ${tableWeek} WHERE subject_id = ?`, [id])})
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
    
    const saveInputs = (title) => {
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET title = ? WHERE id = ?`, [title, itemId],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...subjects];
                        const indexToUpdate = rows.findIndex(item => item.id === itemId);
                        rows[indexToUpdate].title = title;
                        setSubjects(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            <FlashList
                data={subjects}
                estimatedItemSize={80}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{paddingBottom: screenPadding*3}}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={[StylesContainers.screen, StylesContainers.default]}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            onPress={
                                () => { navigation.navigate('SubjectScreen', { subjectId: item.id, subjectTitle: item.title }) }
                            }
                            style={{marginBottom: screenPadding}}
                        >
                            <Subject
                                title={item.title}
                                createdBy={item.createdBy}
                                edit={() => {setItemId(item.id); setItemTitle(item.title); setModalEdit(true)}}
                                setDelete={() => deleteSubject(item.id)}
                            />
                        </TouchableOpacity>
                    )
                }
            />

            {/* Modal Edit */}
            {
                !modalEdit ? null :
                <ModalEdit show={() => setModalEdit(false)}
                    title={itemTitle}
                    saveInputs={(t) => saveInputs(t)}
                />
            }

            {/* Modal Add */}
            {
                !modalAdd ? null :
                <ModalAdd show={() => setModalAdd(false)}
                    addInputs={(t) => addSubject(t)}
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
                    <Text style={StylesTexts.small}> Добавить предмет </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SubjectsScreen;
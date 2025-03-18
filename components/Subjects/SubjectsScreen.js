import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import { Modal, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { FAB } from 'react-native-paper';

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
    const tableSchedule = 'schedule'
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
        db.transaction(tx => {
            tx.executeSql(`SELECT
                subjects.id as subjects_id,
                subjects.title as subjects_title,
                COUNT(assignments.id) as count,
                COUNT(CASE WHEN assignments.isComplete = 1 THEN 1 END) as countDone
                FROM subjects
                LEFT JOIN assignments ON subjects.id = assignments.subject_id
                GROUP BY subjects.id, subjects.title
                ORDER BY subjects.id DESC`, [],
                (_, res) => {
                    const subjectsData = res.rows._array.map(item => ({
                        id: item.subjects_id,
                        title: item.subjects_title,
                        count: item.count,
                        countDone: item.countDone
                    }));
                    setSubjects(subjectsData);
                },
                (_, error) => console.log(error)
            );
        })
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
        db.transaction(tx => {tx.executeSql(`DELETE FROM ${tableSchedule} WHERE subject_id = ?`, [id])})
    }

    const addSubject = (title) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (title) VALUES (?)`, [title],
                (_, res) => {
                    getAllSubjects()
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
                                item={item}
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
                    title={itemTitle} isComplete={null}
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
            <FAB icon={IconPlus}
                size='medium'
                color='black'
                style={[StylesButtons.active, StylesButtons.buttonFloat]}
                onPress={() => setModalAdd(true)}
            />
        </View>
    );
};

export default SubjectsScreen;
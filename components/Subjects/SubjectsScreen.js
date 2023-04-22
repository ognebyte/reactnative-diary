import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const screenPadding = StylesContainers.screen.padding
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    
    const [modalMore, setModalMore] = useState(false)
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
            getAuth()
            refresh()
        }, []
    )

    const getAuth = async () => {
        try {
            let value = await AsyncStorage.getItem('auth')
            if (value !== null) {
                setUser(value)
            }
            // else console.log('user not auth')
        } catch (e) {
            alert('ERROR: getAuth');
        }
    }

    
    const getAllSubjects = () => {
        setSubjects([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} ORDER BY id DESC`, [],
                (_, res) => setSubjects(res.rows._array),
                (_, error) => console.log(error)
            )
        )
    }

    const addSubject = (title) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (title, createdBy) VALUES (?, ?)`, [title, user],
                (_, res) => {
                    setSubjects(
                        item => [
                            {id: res.insertId, title: title, createdBy: user},
                            ...item
                        ]
                    )
                },
                (_, error) => console.log(error)
            );
        });
        setModalAdd(false)
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
        const dbChild = SQLite.openDatabase(`subject.db`)
        dbChild.transaction(tx => {tx.executeSql(`DELETE FROM subject WHERE subject_id = ?`, [id])})
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
            {
                !subjects ? null : subjects.length === 0 ?
                <View style={[StylesContainers.screen, StylesContainers.default]}>
                    <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                </View>
                :
                <FlashList
                    data={subjects}
                    estimatedItemSize={80}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{padding: screenPadding, paddingBottom: screenPadding*3}}
                    refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
                    renderItem={
                        ({item}) => (
                            <TouchableOpacity activeOpacity={1}
                                onLongPress={
                                    () => {
                                        setModalMore(true)
                                        setItemId(item.id)
                                        setItemTitle(item.title)
                                    }
                                }
                                onPress={
                                    () => { navigation.navigate('SubjectScreen', { subjectId: item.id, createdBy: item.createdBy }) }
                                }
                                style={{marginBottom: screenPadding}}
                            >
                                <Subject
                                    title={item.title}
                                    createdBy={item.createdBy}
                                    // user={user}
                                    setDelete={() => deleteSubject(item.id)}
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
                            onPress={() => { deleteSubject(itemId); setModalMore(false); }}
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
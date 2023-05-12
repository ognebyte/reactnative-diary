import React, { useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, View, TextInput, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { FlashList } from "@shopify/flash-list";

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import ModalEdit from '../Modals/ModalEdit'
import ModalAdd from '../Modals/ModalAdd'
import ScheduleItem from "./ScheduleItem";

import IconPlus from '../../assets/svg/plus'


const ScheduleScreen = ({ navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'schedule'
    const screenPadding = StylesContainers.screen.padding
    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)
    
    const [modalEdit, setModalEdit] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    
    const [itemId, setItemId] = useState('')
    const [item, setItem] = useState('')

    const refresh = React.useCallback(() => {
        getAllSchedule()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);

    useEffect(
        () => {
            refresh()
        }, []
    )

    const getAllSchedule = () => {
        setSchedule([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${table} ORDER BY id DESC`, [],
                (_, res) => setSchedule(res.rows._array),
                (_, error) => console.log(error)
            )
        )
    }

    const deleteSchedule = (id) => {
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM ${table} WHERE id = ?`, [id],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        let items = [...schedule]
                        items.splice(schedule.findIndex((item) => { return item.id === id }), 1)
                        setSchedule(items)
                    }
                },
                (_, error) => console.log(error)
            );
            tx.executeSql(`DELETE FROM days WHERE schedule_id = ?`, [id])
        })
    }

    const addSchedule = (title, saturday) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${table} (title, saturday) VALUES (?, ?, ?)`, [title, saturday],
                (_, res) => {
                    setSchedule(
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
    
    const saveInputs = (title, saturday) => {
        db.transaction(tx =>
            tx.executeSql(
                `UPDATE ${table} SET title = ?, saturday = ? WHERE id = ?`, [title, saturday, itemId],
                (_, res) => {
                    if (res.rowsAffected > 0) {
                        var rows = [...schedule];
                        const indexToUpdate = rows.findIndex(item => item.id === itemId);
                        rows[indexToUpdate].title = title;
                        rows[indexToUpdate].saturday = saturday;
                        setSchedule(rows);
                    }
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            <FlashList
                data={schedule}
                estimatedItemSize={80}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{padding: screenPadding, paddingBottom: screenPadding*3}}
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
                                () => {
                                    navigation.navigate('DaysScreen', { id: item.id, title: item.title, saturday: item.saturday })
                                }
                            }
                            style={{marginBottom: screenPadding}}
                        >
                            <ScheduleItem
                                title={item.title}
                                edit={() => {
                                    setItemId(item.id);
                                    setItem({title: item.title, saturday: item.saturday});
                                    setModalEdit(true)}
                                }
                                setDelete={() => deleteSchedule(item.id)}
                            />
                        </TouchableOpacity>
                    )
                }
            />

            {/* Modal Edit */}
            {
                !modalEdit ? null :
                <ModalEdit show={() => setModalEdit(false)}
                    title={item.title} saturday={item.saturday}
                    saveInputs={(t, saturday) => saveInputs(t, saturday)}
                    schedule={true}
                />
            }

            {/* Modal Add */}
            {
                !modalAdd ? null :
                <ModalAdd show={() => setModalAdd(false)}
                    addInputs={(t, saturday) => addSchedule(t, saturday)}
                    schedule={true}
                />
            }

            {/* Button Add */}
            <View style={[StylesButtons.buttonFooter, modalAdd ? {display: 'none'} : {display: 'flex'}]}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={StylesButtons.addButton}
                    onPress={() => setModalAdd(true)}
                >
                    <IconPlus size={30} color={'black'}/>
                    <Text style={StylesTexts.small}> Добавить расписание </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ScheduleScreen;
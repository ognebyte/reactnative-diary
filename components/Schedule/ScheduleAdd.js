import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as SQLite from 'expo-sqlite'
import { Text, View, ScrollView, Keyboard } from 'react-native';
import { IconButton, TouchableRipple, TextInput, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import Colors from '../style/colors';
import StylesPaper from '../style/paper';
import StylesNavigation from '../style/navigation';
import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './styles';

import ModalDefault from '../Modals/ModalDefault';

import IconPlus from '../../assets/svg/plus';
import Chevron from '../../assets/svg/chevron'
import IconDelete from '../../assets/svg/delete';
import IconDone from '../../assets/svg/done';
import IconUndone from '../../assets/svg/undone';

const ScheduleAdd = ({ route, navigation }) => {
    const db = SQLite.openDatabase('diary.db')
    const props = route.params.props
    const week = route.params.week
    const [subjects, setSubjects] = useState([])
    const [dropDownShow, setDropDownShow] = useState(false);
    const [dropDownValue, setDropDownValue] = useState(null);
    const [subject, setSubject] = useState('');

    const [modalAddSubject, setModalAddSubject] = useState(false)

    const [courseType, setCourseType] = useState('')
    const [instructor, setInstructor] = useState('')
    const [location, setLocation] = useState('')
    const [note, setNote] = useState('')

    
    useEffect(() => {
        getAllSubjects()
    }, [])

    const getAllSubjects = () => {
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM subjects ORDER BY id DESC`, [],
                (_, res) => {
                    var rows = []
                    res.rows._array.map(row => rows.push({label: row.title, value: row.id}))
                    setSubjects(rows)
                },
                (_, error) => console.log(error)
            )
        )
    }

    const addSubject = () => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO subjects (title) VALUES (?)`, [subject],
                (_, res) => {
                    setDropDownValue(res.insertId)
                    getAllSubjects()
                },
                (_, error) => console.log(error)
            );
        });
    }
    
    const addSchedule = () => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO schedule (subject_id, week, place, courseType, location, instructor, note) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [dropDownValue, week.key, props.place, courseType, location, instructor, note],
                (_, res) => navigation.goBack(),
                (_, error) => console.log(error)
            );
        });
    }

    return (
        <View style={{flex: 1}}>
            <Button mode='contained-tonal'
                style={StylesButtons.buttonFloat}
                buttonColor={StylesButtons.active.backgroundColor}
                labelStyle={StylesTexts.default}
                onPress={addSchedule}
                disabled={dropDownValue === null}
            >
                Добавить
            </Button>
            <ModalDefault modal={modalAddSubject} hideModal={() => setModalAddSubject(false)}
                content={
                    <View style={{gap: 15}}>
                        <TextInput mode="outlined"
                            inputMode="text"
                            label={"Название предмета"}
                            value={subject}
                            onChangeText={(v) => setSubject(v)}
                            maxLength={50}
                            style={[StylesTexts.default, {margin: 15}]}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                        />
                        <TouchableRipple onPress={addSubject}
                            style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={[StylesTexts.header]}> Создать </Text>
                        </TouchableRipple>
                    </View>
                }
            />
            <ScrollView
                style={{paddingHorizontal: StylesContainers.screen.padding}}
                contentContainerStyle={StylesContainers.scrollViewContainer}
            >
                <View style={{}}>
                    <View style={{gap: 30}}>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <DropDownPicker
                                open={dropDownShow} setOpen={setDropDownShow}
                                value={dropDownValue} setValue={setDropDownValue}
                                items={subjects} setItems={setSubjects}
                                theme='LIGHT'
                                listMode='MODAL'
                                modalAnimationType='slide'

                                containerStyle={{flex: 1}}
                                labelStyle={StylesTexts.default}
                                placeholder='Выбрать существующий'

                                autoScroll={true}
                                searchable={true}
                                searchPlaceholder='Поиск...'
                                ListEmptyComponent={() => (
                                    <View style={StylesContainers.default}>
                                        <Text style={[StylesContainers.alert, StylesTexts.default, {paddingHorizontal: 80, paddingVertical: 40}]}>
                                            Ничего не найдено
                                        </Text>
                                    </View>
                                )}
                                modalContentContainerStyle={{backgroundColor: StylesNavigation.colors.background}}
                                listItemLabelStyle={[StylesTexts.default, {marginHorizontal: 10}]}
                                listParentContainerStyle={{height: 60, marginHorizontal: 20, backgroundColor: '#ffffff', borderRadius: 10}}
                                itemSeparator={true}
                                itemSeparatorStyle={{marginVertical: 10, backgroundColor: 'transparent'}}
                            />
                            <View style={{justifyContent: 'center'}}>
                                <IconButton mode='contained-tonal'
                                    icon={IconPlus}
                                    containerColor={Colors.primary}
                                    size={30}
                                    onPress={() => setModalAddSubject(true)}
                                    style={{borderRadius: 10, margin: 0, padding: 0}}
                                />
                            </View>
                        </View>
                        
                        <TextInput mode='outlined'
                            inputMode="text"
                            label="Тип занятия"
                            value={courseType}
                            onChangeText={(v) => setCourseType(v)}
                            style={StylesTexts.default}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                        />
                        <TextInput mode='outlined'
                            inputMode="text"
                            label="Кабинет"
                            value={location}
                            onChangeText={(v) => setLocation(v)}
                            style={StylesTexts.default}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                        />
                        <TextInput mode='outlined'
                            inputMode="text"
                            label="Преподаватель"
                            value={instructor}
                            onChangeText={(v) => setInstructor(v)}
                            style={StylesTexts.default}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                        />
                        <TextInput mode='outlined'
                            inputMode="text"
                            label="Заметка"
                            value={note}
                            onChangeText={(v) => setNote(v)}
                            style={StylesTexts.default}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                            multiline={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default ScheduleAdd;
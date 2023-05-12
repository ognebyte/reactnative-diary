import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as SQLite from 'expo-sqlite'
import { Text, View, TouchableOpacity, ScrollView, RefreshControl, TextInput, Dimensions, Keyboard } from 'react-native';
import Modal from "react-native-modal";
import DropDownPicker from 'react-native-dropdown-picker';

import StylesNavigation from '../style/navigation';
import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './styles';

import IconPlus from '../../assets/svg/plus';
import Chevron from '../../assets/svg/chevron'
import IconDelete from '../../assets/svg/delete';
import IconDone from '../../assets/svg/done';
import IconUndone from '../../assets/svg/undone';

const WeekItem = ({route, scheduleId}) => {
    const db = SQLite.openDatabase('diary.db')
    const table = 'subjects'

    const [loading, setLoading] = useState(true)
    const [modalAddDay, setModalAddDay] = useState(false)

    const [subjects, setSubjects] = useState([])
    const [courseType, setCourseType] = useState('')
    const [instructor, setInstructor] = useState('')
    const [location, setLocation] = useState('')
    const [timeStart, setTimeStart] = useState('')
    const [timeEnd, setTimeEnd] = useState('')

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    
    const refresh = () => {
        setTimeout(() => setLoading(false), 500)
    }

    useEffect(() => {
        refresh()
        getAllSubjects()
    }, [])

    const getAllSubjects = () => {
        setSubjects([])
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM subjects ORDER BY id DESC`, [],
                (_, res) => {
                    var rows = []
                    res.rows._array.map(
                        row => {
                            rows.push({label: row.title, value: row.id})
                        }
                    )
                    setItems(rows)
                    setSubjects(res.rows._array)
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                contentContainerStyle={{alignItems: 'center'}}
            >
                <View style={[StylesContainers.screen, StylesContainers.default, {gap: 30, width: '100%'}]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => setModalAddDay(true)}
                        style={[StylesContainers.default, Styles.daysItem, {opacity: 0.4}]}
                    >
                        <IconPlus size={40} color={'black'}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <Modal isVisible={modalAddDay}
                backdropOpacity={0.5}
                animationOutTiming={300}
                style={{justifyContent: 'flex-end', margin: 0}}
            >
                <View>
                    <ScrollView contentContainerStyle={{paddingTop: 150}}>
                        <View style={StylesContainers.modal}>
                            <View style={{gap: 30}}>
                                <Text style={StylesTexts.big}>
                                    Создание новой записи
                                </Text>

                                {/*
                                // schedule_id INTEGER,
                                // subject_id INTEGER,
                                // place INTEGER,
                                // weekNumber INTEGER,
                                // timeStart TEXT,
                                // timeEnd TEXT,
                                // courseType TEXT,
                                // instructor TEXT,
                                // location TEXT,
                                // note TEXT
                                */}

                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    theme='LIGHT'
                                    listMode='MODAL'
                                    modalAnimationType='slide'

                                    containerStyle={{width: Dimensions.get('window').width-60, zIndex: 10, alignSelf: 'center'}}
                                    labelStyle={StylesTexts.default}
                                    placeholder='Выберите предмет'

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
                                
                                <TextInput
                                    blurOnSubmit={true}
                                    inputMode="text"
                                    placeholder="Тип занятия"
                                    returnKeyType='done'
                                    value={courseType}
                                    onChangeText={(v) => setCourseType(v)}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    style={[StylesTexts.default, StylesTexts.inputExtra, {width: 200}]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    multiline={true}
                                    maxLength={40}
                                />
                                <TextInput
                                    blurOnSubmit={true}
                                    inputMode="text"
                                    placeholder="Преподаватель"
                                    returnKeyType='done'
                                    value={instructor}
                                    onChangeText={(v) => setInstructor(v)}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    style={[StylesTexts.default, StylesTexts.inputExtra, {width: 200}]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    multiline={true}
                                    maxLength={40}
                                />
                                <TextInput
                                    blurOnSubmit={true}
                                    inputMode="text"
                                    placeholder="Кабинет"
                                    returnKeyType='done'
                                    value={location}
                                    onChangeText={(v) => setLocation(v)}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    style={[StylesTexts.default, StylesTexts.inputExtra, {width: 200}]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    multiline={true}
                                    maxLength={40}
                                />
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput
                                        blurOnSubmit={true}
                                        inputMode="text"
                                        placeholder="Время начала"
                                        returnKeyType='done'
                                        value={timeStart}
                                        onChangeText={(v) => setTimeStart(v)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        style={[StylesTexts.default, StylesTexts.inputExtra, {width: 100}]}
                                        placeholderTextColor={StylesTexts.placeholder.color}
                                        multiline={true}
                                        maxLength={40}
                                    />
                                    <TextInput
                                        blurOnSubmit={true}
                                        inputMode="text"
                                        placeholder="Время конца"
                                        returnKeyType='done'
                                        value={timeStart}
                                        onChangeText={(v) => setTimeStart(v)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        style={[StylesTexts.default, StylesTexts.inputExtra, {width: 100}]}
                                        placeholderTextColor={StylesTexts.placeholder.color}
                                        multiline={true}
                                        maxLength={40}
                                    />

                                </View>
                            </View>

                            <View style={{flexDirection: 'row', width: '100%', marginTop: 100, gap: 10}}>
                                <TouchableOpacity
                                    activeOpacity={ 0.5 }
                                    style={[StylesButtons.default, StylesButtons.bottom, { flex: 0.5, backgroundColor: 'black' }]}
                                    onPress={() => setModalAddDay(false)}
                                >
                                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Закрыть </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={ 0.5 }
                                    style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept, { flex: 0.5 }]}
                                    onPress={() => addDay()}
                                >
                                    <Text style={[StylesTexts.default]}> Создать </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

export default WeekItem;
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as SQLite from 'expo-sqlite';
import { FlashList } from "@shopify/flash-list";
import { Text, View, TouchableOpacity, ScrollView, RefreshControl, TextInput, Dimensions, Keyboard } from 'react-native';
import { IconButton, TouchableRipple, Checkbox } from 'react-native-paper';

import Colors from '../style/colors';
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

const Week = ({ route, navigate }) => {
    const db = SQLite.openDatabase('diary.db')
    const [days, setDays] = useState([])

    const [loading, setLoading] = useState(true)

    
    useEffect(() => {
        refresh()
    }, [])

    const refresh = () => {
        setLoading(true)
        getSchedule()
    }
    
    const getSchedule = () => {
        let length = 7
        var arr = Array.from({ length }, (_, index) => ({place: index + 1, params: null}))
        db.transaction(tx =>
            tx.executeSql(
                `SELECT schedule.*, subjects.title FROM schedule
                JOIN subjects ON schedule.subject_id = subjects.id
                WHERE schedule.week = ?`,
                [route.key],
                (_, res) => {
                    res.rows._array?.map(row => {
                        let index = (arr.findIndex(day => day.place === row.place))
                        arr[index].params = row
                    })
                    setDays(arr)
                    setLoading(false)
                },
                (_, error) => console.log(error)
            )
        )
    }

    return (
        <View style={{flex: 1}}>
            <FlashList
                data={days}
                estimatedItemSize={70}
                keyExtractor={(item) => item.place}
                contentContainerStyle={StylesContainers.contentContainerStyle}
                refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
                renderItem={({item}) => (
                    <View style={Styles.weekDay}>
                        <View style={Styles.weekDayLeft}>
                            <Text style={StylesTexts.medium}>{item.place}</Text>
                        </View>

                        {
                            item.params === null ?
                            <View style={Styles.dayItemContainer}>
                                <TouchableRipple onPress={() => navigate('ScheduleAdd', item)}
                                    style={[StylesContainers.default, {padding: 5}]}
                                >
                                    <IconPlus size={40} color={Colors.darkFade}/>
                                </TouchableRipple>
                            </View>
                            :
                            <View style={Styles.dayItemContainer}>
                                <TouchableRipple onPress={() => navigate('ScheduleEdit', item)}
                                    style={[{padding: 5}]}
                                >
                                    <View style={Styles.dayItem}>
                                        <View style={Styles.daySubject}>
                                            <Text style={StylesTexts.default} numberOfLines={1}>{item.params.title}</Text>
                                        </View>
                                        <View style={Styles.dayInfoContainer}>
                                            { !item.params.courseType ? null :
                                                <View style={Styles.dayInfo}>
                                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Тип занятия</Text>
                                                    <Text style={StylesTexts.default} numberOfLines={1}>{item.params.courseType}</Text>
                                                </View>
                                            }
                                            { !item.params.location ? null :
                                                <View style={Styles.dayInfo}>
                                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Кабинет</Text>
                                                    <Text style={StylesTexts.default} numberOfLines={1}>{item.params.location}</Text>
                                                </View>
                                            }
                                            { !item.params.instructor ? null :
                                                <View style={[Styles.dayInfo, {flex: 2}]}>
                                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>Преподаватель</Text>
                                                    <Text style={StylesTexts.default} numberOfLines={1}>{item.params.instructor}</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </TouchableRipple>
                            </View>
                        }
                    </View>
                )}
            />
        </View>
    );
}

export default Week;
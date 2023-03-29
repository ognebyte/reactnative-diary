import React, { useState, useEffect, useMemo, Component } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { Agenda, DateData, AgendaEntry, AgendaSchedule, LocaleConfig } from 'react-native-calendars';
import { Alert, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from 'react-native';

import StylesContainers from './style/containers';
import StylesButtons from './style/buttons';
import StylesTexts from './style/texts';

import ArrowForward from '../assets/svg/arrow-forward'
import ArrowBack from '../assets/svg/arrow-back'

LocaleConfig.locales['ru'] = {
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
LocaleConfig.defaultLocale = 'ru';


const CalendarScreen = () => {
    const [state, setState] = useState({ items: undefined })

    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    const loadItems = (day) => {
        const items = state.items || {};

        setTimeout(() => {
            for (let i = -31; i < 50; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];
                    
                    const numItems = 1;
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                        name: '',
                        height: 100,
                        day: strTime
                        });
                    }
                }
            }
            
            const newItems = {};
            Object.keys(items).map(key => {
                newItems[key] = items[key];
            });
            setState({ items: newItems });
        }, 500);
    }

    const renderItem = (reservation, isFirst) => {
        return (
            <View style={[StylesContainers.default, {height: reservation.height, paddingRight: 20, paddingVertical: 10}]}>
                { reservation.name === '' ?
                <View style={[StylesContainers.fill, StylesContainers.alert]}>
                    <Text style={[StylesTexts.default, StylesTexts.fadeColor]}> Empty </Text>
                </View>
                :
                <TouchableOpacity
                    style={[StylesContainers.fill, StylesContainers.default, {backgroundColor: '#ffffff', borderRadius: 10}]}
                    onPress={() => Alert.alert(reservation.name)}
                >
                    <Text style={StylesTexts.default}> {reservation.name} </Text>
                </TouchableOpacity>
                }
            </View>
        );
    }

    return (
        <Agenda
            minDate='2000-01-01'
            maxDate='2050-01-01'

            items={state.items}
            loadItemsForMonth={loadItems}
            renderItem={renderItem}
            rowHasChanged={ (r1, r2) => { return r1.name !== r2.name }}

            firstDay={1}
            showClosingKnob={true}
            theme={{
                calendarBackground: 'white',
                todayBackgroundColor: StylesButtons.active.backgroundColor,
                todayTextColor: StylesTexts.linkColor.color,
                agendaDayTextColor: 'black',
                agendaDayNumColor: 'black',
                agendaTodayColor: StylesTexts.linkColor.color,
                selectedDayBackgroundColor: StylesTexts.linkColor.color,
                dotColor: 'red'
            }}
            // markingType={'period'}
            // markedDates={{
            //    '2017-05-08': {textColor: '#43515c'},
            //    '2017-05-09': {textColor: '#43515c'},
            //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
            //    '2017-05-21': {startingDay: true, color: 'blue'},
            //    '2017-05-22': {endingDay: true, color: 'gray'},
            //    '2017-05-24': {startingDay: true, color: 'gray'},
            //    '2017-05-25': {color: 'gray'},
            //    '2017-05-26': {endingDay: true, color: 'gray'}}}
            // monthFormat={'yyyy'}
            // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
            //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
            // hideExtraDays={false}
            // showOnlySelectedDayItems
            // reservationsKeyExtractor={this.reservationsKeyExtractor}
        />
    );
}

export default CalendarScreen;
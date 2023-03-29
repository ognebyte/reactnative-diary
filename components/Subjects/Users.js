import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'
import StylesReport from './styles/report'


const Users = (props) => {
    const created_by = props.createdBy
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const refresh = React.useCallback(() => {
        getAuth()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);

    useEffect(
        () => {
            refresh()
        }, []
    )

    const getAuth = async () => {
        try {
            let value = await AsyncStorage.getItem('auth')
            if (value !== null) {
                setUser(value)
            }
        } catch (e) {
            return alert('ERROR: getAuth');
        }
    }

    return (
        <ScrollView
            refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }
        >
            <View style={[StylesContainers.screen, {flex: 1, gap: 40}]}>
                <View style={{gap: 20}}>
                    <Text style={[StylesTexts.big, StylesTexts.borderBottom]}> Создан </Text>
                    <Text style={StylesTexts.default}> {created_by} {created_by !== user ? null : `(Вы)`} </Text>
                </View>
                <View style={{gap: 20}}>
                    <Text style={[StylesTexts.big, StylesTexts.borderBottom]}> Учащиеся </Text>
                    {
                        created_by !== user ? null :
                        <TouchableOpacity activeOpacity={0.5} style={StylesContainers.alert}>
                            <Text style={[StylesTexts.big, StylesTexts.linkColor]}> Пригласить </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

export default Users
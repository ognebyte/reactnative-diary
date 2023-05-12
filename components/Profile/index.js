import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';

import Auth from './Auth';

const Profile = () => {
    const [isAuth, setIsAuth] = useState('')

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            let itemValue = await AsyncStorage.getItem('auth')
            if (itemValue !== null) {
                setIsAuth(itemValue)
            }
        } catch (e) {
            return alert('ERROR: checkAuth');
        }
    }

    const logOut = async () => {
        try {
            await AsyncStorage.removeItem('auth')
            setIsAuth('')
            console.log('Log Out');
        } catch (e) {
            return alert('ERROR: logOut');
        }
    }

    return (
        <View style={{flex: 1}}>
            {
                isAuth.length === 0 ?
                <Auth checkAuth={() => checkAuth()}/> :
                <View style={{flex: 1}}>
                    <Text style={StylesTexts.big}>
                        Hello {isAuth}
                    </Text>
                    <TouchableOpacity onPress={() => logOut()}>
                        <Text style={[StylesTexts.default, StylesTexts.linkColor]}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
};

export default Profile;

import React, { useState, useRef, useEffect } from "react";
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';

const Auth = (props) => {
    const table = 'users'
    const db = SQLite.openDatabase(`${table}.db`)
    const [isLogIn, setIsLogIn] = useState(true)

    const [inputLogin, setInputLogin] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordSecond, setInputPasswordSecond] = useState('')
    const inputSecond = useRef(null)
    const inputThird = useRef(null)
    const [securityPassword, setSecurityPassword] = useState(true)

    const setAuth = async (login) => {
        try {
            await AsyncStorage.setItem('auth', login)
            props.checkAuth()
        } catch (e) {
            return alert('ERROR: setAuth');
        }
    }

    const addUser = () => {
        if(inputLogin.length > 0) {
            if (inputPassword.length < 8) alert('Длина пароля меньше 8!')
            else {
                if(inputPassword !== inputPasswordSecond) alert('Пароли не совпадают')
                else {
                    let exist = false
                    db.transaction(tx => {
                        tx.executeSql(
                            `SELECT * FROM ${table} WHERE login = ?`, [inputLogin],
                            (_, res) => {
                                if(res.rows.length != 0) exist = true
                            },
                            (_, error) => console.log(error)
                        );
                    });
                    db.transaction(tx => {
                        if(exist) { alert('Логин существует!') }
                        else {
                            tx.executeSql(
                                `INSERT INTO ${table} (login, password) VALUES (?, ?)`, [inputLogin, inputPassword],
                                (_, res) => {
                                    if(res.rowsAffected > 0) {
                                        setAuth(inputLogin)
                                    }
                                },
                                (_, error) => console.log(error)
                            );
                            setInputLogin('')
                            setInputPassword('')
                            setInputPasswordSecond('')
                        }
                    });
                }
            }
        } else {
            alert("Логин пустой!")
        }
    }
    
    const checkUser = () => {
        if(inputLogin.length > 0) {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE login = ? AND password = ?`, [inputLogin, inputPassword],
                    (_, res) => {
                        if(res.rows.length != 0) {
                            setAuth(res.rows.item(0).login)
                        } else {
                            alert('Логин или пароль неправильный')
                        }
                    },
                    (_, error) => console.log(error)
                );
            });
        } else {
            alert("Логин пустой!")
        }
    }

    return (
        <KeyboardAvoidingView
                contentContainerStyle={{flex: 1}}
                behavior='padding'
                enabled
            >
            <View style={[StylesContainers.modal, { gap: 30 }]}>
                <Text style={StylesTexts.big}>
                    {isLogIn ? 'Авторизация' : 'Регистрация'}
                </Text>
                <View style={{ gap: 20 }}>
                    <TextInput
                        inputMode="text"
                        placeholder="Логин"
                        blurOnSubmit={false}
                        onSubmitEditing={() => inputSecond.current.focus()}
                        returnKeyType={'next'}
                        value={inputLogin}
                        onChangeText={(v) => setInputLogin(v)}
                        style={StylesTexts.input}
                        placeholderTextColor={StylesTexts.placeholder.color}
                        maxLength={50}
                    />
                    <TextInput
                        ref={inputSecond}
                        secureTextEntry={securityPassword}
                        inputMode="text"
                        placeholder="Пароль"
                        blurOnSubmit={false}
                        onSubmitEditing={() => isLogIn ? checkUser() : inputThird.current.focus()}
                        returnKeyType={isLogIn ? 'next' : 'done'}
                        value={inputPassword}
                        onChangeText={(v) => setInputPassword(v)}
                        style={StylesTexts.input}
                        placeholderTextColor={StylesTexts.placeholder.color}
                        maxLength={50}
                    />
                    {
                        isLogIn ? null :
                        <TextInput
                            ref={inputThird}
                            secureTextEntry={securityPassword}
                            inputMode="text"
                            placeholder={"Введите пароль еще раз"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => addUser()}
                            returnKeyType={'done'}
                            value={inputPasswordSecond}
                            onChangeText={(v) => setInputPasswordSecond(v)}
                            style={StylesTexts.input}
                            placeholderTextColor={StylesTexts.placeholder.color}
                            maxLength={50}
                        />
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Switch
                            trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                            thumbColor={!securityPassword ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor }
                            onValueChange={() => setSecurityPassword(!securityPassword)}
                            value={!securityPassword}
                        />
                        <Text> {securityPassword ? 'Показать пароль' : 'Скрыть пароль'} </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'column', width: '100%', gap: 10 }}>

                    {/* <TouchableOpacity
                        activeOpacity={ 0.5 }
                        style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.cancel, { flex: 0.5 }]}
                    >
                        <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Отменить </Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        activeOpacity={ 0.5 }
                        style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept, { flex: 1 }]}
                        onPress={() => isLogIn ? checkUser() : addUser()}
                    >
                        <Text style={[StylesTexts.default]}>
                            {isLogIn ? 'Войти' : 'Зарегистрироваться'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignItems: 'center'}}
                        activeOpacity={ 0.5 }
                        onPress={() => setIsLogIn(!isLogIn)}
                    >
                        <Text style={[StylesTexts.default, StylesTexts.linkColor]}>
                            {isLogIn ? 'Зарегистрироваться' : 'Войти'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
};

export default Auth;
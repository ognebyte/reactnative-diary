import React, { useState, useRef, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, ScrollView, Switch } from 'react-native';

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';

const Auth = (props) => {
    const [isLogIn, setIsLogIn] = useState(true)
    const [loading, setLoading] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const inputSecond = useRef(null)
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
        if(email.length > 0) {
            if (password.length < 8) alert('Длина пароля меньше 8!')
            else {
                createUserWithEmailAndPassword(auth, email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    setAuth(user.email)
                })
                .catch(error => alert(error.message));
            }
        } else {
            alert("Введите почту")
        }
    }
    
    const checkUser = () => {
        if(email.length > 0) {
            signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setAuth(email)
            })
            .catch(error => alert(error.message));
        } else {
            alert("Введите почту")
        }
    }
    
    const resetPassword = () => {
        if(email.length > 0) {
            sendPasswordResetEmail(auth, email)
            .then(() => alert('Запрос для сброса пароля отправлено!'))
            .catch(error => alert(error.message));
        } else {
            alert("Введите почту")
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'space-between'}}>
            <ScrollView contentContainerStyle={StylesContainers.screen}>
                <View style={[{ gap: 30 }]}>
                    <Text style={[StylesTexts.big, {alignSelf: 'center'}]}>
                        {
                            forgotPassword ? 'Сброс пароля' :
                            isLogIn ? 'Авторизация' : 'Регистрация'
                        }
                    </Text>

                    <View style={{ gap: 20 }}>
                        <TextInput
                            inputMode="email"
                            placeholder="Электронная почта"
                            blurOnSubmit={true}
                            onSubmitEditing={() => forgotPassword ? resetPassword() : inputSecond.current.focus()}
                            returnKeyType={forgotPassword ? 'done' : 'next'}
                            value={email}
                            onChangeText={(v) => setEmail(v)}
                            style={[StylesTexts.input, StylesTexts.default]}
                            placeholderTextColor={StylesTexts.placeholder.color}
                            maxLength={50}
                        />
                        {
                            forgotPassword ? null :
                            <>
                                <TextInput
                                    ref={inputSecond}
                                    secureTextEntry={securityPassword}
                                    inputMode="text"
                                    placeholder="Пароль"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => isLogIn ? checkUser() : addUser()}
                                    returnKeyType={'done'}
                                    value={password}
                                    onChangeText={(v) => setPassword(v)}
                                    style={[StylesTexts.input, StylesTexts.default]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    maxLength={50}
                                />
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Switch
                                        trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                                        thumbColor={!securityPassword ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor }
                                        onValueChange={() => setSecurityPassword(!securityPassword)}
                                        value={!securityPassword}
                                    />
                                    <Text> {securityPassword ? 'Показать пароль' : 'Скрыть пароль'} </Text>
                                </View>
                            </>
                        }
                    </View>

                    <View style={{ flexDirection: 'column', width: '100%', gap: 20 }}>
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept]}
                            onPress={() => forgotPassword ? resetPassword() : isLogIn ? checkUser() : addUser()}
                        >
                            <Text style={[StylesTexts.default]}>
                                {
                                    forgotPassword ? 'Отправить' :
                                    isLogIn ? 'Войти' : 'Зарегистрироваться'
                                }
                            </Text>
                        </TouchableOpacity>
                        {
                            !isLogIn ? null :
                            <TouchableOpacity
                                style={{justifyContent: 'center', alignItems: 'center', height: 40}}
                                activeOpacity={ 0.5 }
                                onPress={() => setForgotPassword(!forgotPassword)}
                            >
                                <Text style={[StylesTexts.default, {textDecorationLine: 'underline'}]}>
                                    {!forgotPassword ? 'Забыли пароль?' : 'Назад'}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
            {
                forgotPassword ? null :
                <View style={{justifyContent: 'center', alignItems: 'center', height: 50, borderTopWidth: 1, borderColor: '#00000040'}}>
                    <TouchableOpacity
                        style={[StylesContainers.fill, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}
                        activeOpacity={ 0.5 }
                        onPress={() => setIsLogIn(!isLogIn)}
                    >
                        <Text style={StylesTexts.default}>
                            {isLogIn ? 'У вас нет аккаунта? ' : 'Уже есть аккаунт? '}
                        </Text>
                        <Text style={[StylesTexts.default, StylesTexts.linkColor]}>
                            {isLogIn ? 'Зарегистрироваться' : 'Войти'}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
};

export default Auth;
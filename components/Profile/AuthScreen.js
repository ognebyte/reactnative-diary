import React, { useState, useRef, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, collection, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from 'config/firebase'
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, ScrollView, Switch } from 'react-native';
import Modal from "react-native-modal";

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './styles'

import Loading from "../Modals/Loading";

import EyeClosed from "assets/svg/eyeClosed";
import EyeOpen from "assets/svg/eyeOpen";

const AuthScreen = ({ navigation }) => {
    const [isLogIn, setIsLogIn] = useState(true)
    const [loading, setLoading] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const inputLastname = useRef(null)
    const inputEmail = useRef(null)
    const inputPassword = useRef(null)
    const [securityPassword, setSecurityPassword] = useState(true)


    const auth = async (bool) => {
        if(email.length > 0) {
            if (bool) {
                setLoading(true)
                await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
                .then(() => navigation.navigate('ProfileScreen'))
                .catch(error => alert(error.message));
                setLoading(false)
            } else {
                if (firstname.length === 0 && firstname.length === 0) alert('Имя или фамилия не были записаны')
                if (password.length < 8) alert('Длина пароля меньше 8!')
                else {
                    setLoading(true)
                    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
                    .then(async () => {
                        await setDoc(doc(collection(FIREBASE_DB, 'users'), email), {firstname: firstname, lastname: lastname, birthday: null});
                        navigation.navigate('ProfileScreen');
                    })
                    .catch(error => alert(error.message));
                    setLoading(false)
                }
            }
        } else {
            alert("Введите почту")
        }
    }
    
    const resetPassword = async () => {
        if(email.length > 0) {
            setLoading(true)
            await sendPasswordResetEmail(FIREBASE_AUTH, email)
            .then(() => alert('Запрос для сброса пароля отправлено!'))
            .catch(error => alert(error.message));
            setLoading(false)
        } else {
            alert("Введите почту")
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'space-between'}}>
            <Loading loading={loading}/>

            <ScrollView contentContainerStyle={StylesContainers.screen}>
                <View style={[{ gap: 30 }]}>
                    <Text style={[StylesTexts.big, {alignSelf: 'center'}]}>
                        {
                            forgotPassword ? 'Сброс пароля' :
                            isLogIn ? 'Авторизация' : 'Регистрация'
                        }
                    </Text>

                    <View style={{ gap: 20 }}>
                        {
                            isLogIn ? null :
                            <>
                                <TextInput
                                    inputMode="text"
                                    placeholder="Фамилия"
                                    onSubmitEditing={() => inputLastname.current.focus()}
                                    returnKeyType={forgotPassword ? 'done' : 'next'}
                                    value={firstname}
                                    onChangeText={(v) => setFirstname(v)}
                                    style={[StylesTexts.input, StylesTexts.default]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    maxLength={50}
                                />
                                <TextInput
                                    ref={inputLastname}
                                    inputMode="text"
                                    placeholder="Имя"
                                    onSubmitEditing={() => inputEmail.current.focus()}
                                    returnKeyType={forgotPassword ? 'done' : 'next'}
                                    value={lastname}
                                    onChangeText={(v) => setLastname(v)}
                                    style={[StylesTexts.input, StylesTexts.default]}
                                    placeholderTextColor={StylesTexts.placeholder.color}
                                    maxLength={50}
                                />
                            </>
                        }
                        <TextInput
                            ref={inputEmail}
                            inputMode="email"
                            placeholder="Электронная почта"
                            onSubmitEditing={() => forgotPassword ? resetPassword() : inputPassword.current.focus()}
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
                                <View style={{justifyContent: 'center'}}>
                                    <TextInput
                                        ref={inputPassword}
                                        secureTextEntry={securityPassword}
                                        inputMode="text"
                                        placeholder="Пароль"
                                        onSubmitEditing={() => auth(isLogIn ? true : false)}
                                        returnKeyType={'done'}
                                        value={password}
                                        onChangeText={(v) => setPassword(v)}
                                        style={[StylesTexts.input, StylesTexts.default, {paddingRight: 40}]}
                                        placeholderTextColor={StylesTexts.placeholder.color}
                                        maxLength={50}
                                    />
                                    <TouchableOpacity style={{position: 'absolute', right: 0, padding: 10}}
                                        onPress={() => setSecurityPassword(!securityPassword)}
                                    >
                                        { securityPassword ? <EyeClosed size={25}/> : <EyeOpen size={25}/> }
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                    </View>

                    <View style={{ flexDirection: 'column', width: '100%', gap: 20 }}>
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept]}
                            onPress={() => forgotPassword ? resetPassword() : auth(isLogIn ? true : false)}
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

export default AuthScreen;
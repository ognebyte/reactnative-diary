import React, { useState, useRef, useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, collection, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, ScrollView, Switch } from 'react-native';
import Modal from "react-native-modal";

import StylesContainers from '../style/containers';
import StylesButtons from '../style/buttons';
import StylesTexts from '../style/texts';
import Styles from './styles'

import User from "../../assets/svg/user";

const ProfileScreen = ({ navigation }) => {
    const [isAuth, setIsAuth] = useState(false)
    const [currentUser, setCurrentUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, async user => {
            if (user) {
                const docSnap = await getDoc(doc(FIREBASE_DB, 'users', user.email));
                const docData = docSnap.data()

                var value = {email: user.email, firstname: docData.firstname, lastname: docData.lastname, birthday: docData.birthday};
                await AsyncStorage.setItem('currentUser', JSON.stringify(value));
                setIsAuth(true);
                setCurrentUser(value);
            } else {
                checkAsyncStorageAuth();
            }
        })
    }, [])

    const checkAsyncStorageAuth = async () => {
        try {
            let itemValue = await AsyncStorage.getItem('currentUser')
            if (itemValue !== null) {
                setIsAuth(true);
                setCurrentUser(JSON.parse(itemValue))
            }
        } catch (e) {
            return alert('ERROR: checkAsyncStorageAuth');
        }
    }

    const logOut = async () => {
        setLoading(true)
        await signOut(FIREBASE_AUTH);
        await AsyncStorage.removeItem('currentUser');
        setIsAuth(false);
        setLoading(false);
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView style={StylesContainers.screen} contentContainerStyle={{alignItems: 'center'}}>
                <View style={Styles.profileCardContainer}>
                    <View style={[StylesContainers.photoContainer, {width: 100, height: 100}]}>
                        <User size={'80%'} color={'#00000080'}/>
                    </View>
                    {
                        isAuth ? <Text style={[StylesTexts.medium]}> {currentUser.firstname} {currentUser.lastname} </Text> :
                        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AuthScreen')}
                            style={[Styles.authButton, {backgroundColor: StylesTexts.linkColor.color}]}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Авторизоваться </Text>
                        </TouchableOpacity>
                    }
                </View>

                {
                    !isAuth ? null :
                    <TouchableOpacity onPress={logOut}>
                        <Text style={[StylesTexts.default, StylesTexts.linkColor, {color: StylesButtons.delete.backgroundColor}]}> Выйти </Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    )
};

export default ProfileScreen;
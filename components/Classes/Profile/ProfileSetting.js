import React, { useState, useContext } from "react";
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, TouchableRipple, Button, FAB } from 'react-native-paper';

import Colors from 'components/style/colors';
import StylesPaper from 'components/style/paper';
import StylesContainers from 'components/style/containers';
import StylesButtons from 'components/style/buttons';
import StylesTexts from 'components/style/texts';
import Styles from './styles'

import Context from 'config/context';
import Loading from "components/Modals/Loading";

import LogOut from "assets/svg/log-out";
import Inbox from "assets/svg/inbox";

const ProfileSetting = ({ navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser
    } = useContext(Context);
    const [loading, setLoading] = useState(false)
    const [firstname, setFirstname] = useState(contextCurrentUser.firstname)
    const [lastname, setLastname] = useState(contextCurrentUser.lastname)

    const userSave = async () => {
        setLoading(true)
        try {
            var value = {
                firstname: firstname,
                lastname: lastname
            }
            var updated = Object.assign({}, contextCurrentUser, value)
            await updateDoc(doc(FIREBASE_DB, 'users', contextCurrentUser.email), value);
            updateContextCurrentUser(updated)
            await AsyncStorage.setItem('currentUser', JSON.stringify(updated))
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    const logOut = async () => {
        setLoading(true)
        try {
            await AsyncStorage.removeItem('currentUser')
            await signOut(FIREBASE_AUTH);
            updateContextCurrentUser({})
            setTimeout(() => {
                navigation.goBack()
            }, 500);
        }
        catch (error) {
            alert(error)
        }
        setLoading(false);
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                onPress={userSave}
                disabled={firstname.length === 0 || lastname.length === 0}
                style={StylesButtons.buttonFloat}
                labelStyle={StylesTexts.default}
                buttonColor={Colors.primary}
            >
                Сохранить
            </Button>

            <ScrollView style={StylesContainers.screen} contentContainerStyle={{paddingBottom: 100}}>
                <View style={{gap: 30}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Inbox size={30} color={'#000000'}/>
                        <Text style={StylesTexts.default} selectable={true}>
                            {contextCurrentUser.email}
                        </Text>
                    </View>

                    <TextInput mode="outlined"
                        inputMode="text"
                        label={"Фамилия"}
                        value={firstname}
                        onChangeText={(v) => setFirstname(v)}
                        maxLength={50}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                        selectionColor={Colors.needAttention}
                    />
                    
                    <TextInput mode="outlined"
                        inputMode="text"
                        label={"Имя"}
                        value={lastname}
                        onChangeText={(v) => setLastname(v)}
                        maxLength={50}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                        selectionColor={Colors.needAttention}
                    />

                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                        onPress={() => (
                            Alert.alert(
                                'Подтвердите',
                                'Вы уверены, что хотите выйти из аккаунта?',
                                [
                                    { text: 'Отмена', style: 'cancel' },
                                    { text: 'Да', style: 'destructive', onPress: logOut },
                                ],
                            )
                        )}
                    >
                        <LogOut size={30} color={Colors.alarm}/>
                        <Text style={[StylesTexts.default, StylesTexts.linkColor, {color: Colors.alarm}]}>
                            Выйти из аккаунта
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
};

export default ProfileSetting;
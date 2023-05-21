import React, { useState, useEffect, useContext } from "react";
import { doc, setDoc, addDoc, getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { TextInput, TouchableRipple, IconButton, Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'
import StylesPaper from '../style/paper'
import Styles from './styles'

import Context from 'config/context';

import IconClipboard from 'assets/svg/clipboard'
import IconMore from 'assets/svg/more-vertical'


const Members = () => {
    const { contextSubject, updateContextSubject } = useContext(Context);

    const [instructors, setInstructors] = useState([])
    const [pupils, setPupils] = useState([])
    
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        refresh()
    }, [])

    const refresh = async () => {
        setLoading(true)
        try {
            const email = await getUser()
            if (email === null) return alert('Login')
            await getMembers()
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }
        
    const getUser = async () => {
        let item = await AsyncStorage.getItem('currentUser')
        if (item !== null) {
            let value = JSON.parse(item)
            setCurrentUser(value)
            return value.email
        }
        return null
    }
    
    const getMembers = async () => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'members'),
            where('subjectId', '==', contextSubject.id)
        ));
        const dataInstructors = [];
        const dataPupils = [];
        const dataMembers = [];
        querySnapshot.forEach(doc => {
            dataMembers.push(doc.data());
        });
        await Promise.all(dataMembers.map(async (member) => {
            const docSnap = await getDoc(doc(FIREBASE_DB, 'users', member.userId));
            var value = Object.assign(docSnap.data(), member)
            member.role == 'pupil' ? dataPupils.push(value) : dataInstructors.push(value)
        }));

        setInstructors(dataInstructors)
        setPupils(dataPupils)
    }

    const memberItem = (id, firstname, lastname) => {
        return (
            <View key={id} style={[Styles.memberItem]}>
                <Text style={StylesTexts.default}>
                    {firstname} {lastname}
                </Text>
                { contextSubject.role !== 'admin' || currentUser.email === id ? null :
                    <IconButton
                        style={{position: 'absolute', right: 0}}
                        icon={IconMore}
                        size={20}
                        onPress={() => console.log('Pressed')}
                    />
                }
            </View>
        )
    }

    return (
        <ScrollView refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh}/> }>
            <View style={[StylesContainers.screen, {flex: 1, gap: 40}]}>
                { contextSubject.role !== 'admin' ? null : !contextSubject.canJoin ? null :
                    <Button mode='contained-tonal' dark={false} icon={IconClipboard}
                        onPress={() => Clipboard.setString(contextSubject.id)}
                        buttonColor={StylesButtons.active.backgroundColor}
                        labelStyle={StylesTexts.small}
                    >
                        Скопировать код на класс
                    </Button>
                }
                <View style={{gap: 20}}>
                    <Text style={[StylesTexts.big, StylesTexts.borderBottom]}> Преподаватели </Text>
                    { instructors.map(instructor => memberItem(instructor.userId, instructor.firstname, instructor.lastname)) }
                </View>
                <View style={{gap: 20}}>
                    <Text style={[StylesTexts.big, StylesTexts.borderBottom]}> Учащиеся </Text>
                    { pupils.map(pupil => memberItem(pupil.userId, pupil.firstname, pupil.lastname)) }
                </View>
            </View>
        </ScrollView>
    )
}

export default Members
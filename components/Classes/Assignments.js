import React, { useState, useEffect, useContext } from "react";
import { FlashList } from "@shopify/flash-list";
import { doc, setDoc, addDoc, getDocs, getDoc, collection, query, where, FieldPath, disableNetwork, enableNetwork, orderBy } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, FAB } from 'react-native-paper';
import moment from 'moment';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import ModalDefault from '../Modals/ModalDefault'
import ModalScreen from '../Modals/ModalScreen'
import Loading from "../Modals/Loading";

import IconMore from 'assets/svg/more-vertical'
import IconPlus from 'assets/svg/plus'


const Assignments = () => {
    const { contextSubject, updateContextSubject } = useContext(Context);

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    
    const [assignments, setAssignments] = useState([])
    const [assignmentsTitle, setAssignmentsTitle] = useState('')
    const [assignmentsDescription, setAssignmentsDescription] = useState('')
    
    useEffect(() => {
        refresh()
    }, [])
    
    const refresh = async () => {
        setLoading(true)
        try {
            const email = await getUser()
            if (email === null) return alert('Login')
            await getAssignments()
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
    
    const getAssignments = async () => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'assignments'),
            where('subjectId', '==', contextSubject.id)
        ));
        const data = [];
        querySnapshot.forEach(doc => {
            data.push(Object.assign(doc.data(), {id: doc.id}));
        });
        setAssignments(data)
    }

    const createAssignment = async () => {
        if (className.length === 0) return alert('Введите название класса!')
        setLoading(true)
        try {
            if (modalAdd.isCreate) {
                let currentDate = new Date();
                const subjectRef = await addDoc(
                    collection(FIREBASE_DB, 'subjects'), {
                        name: className,
                        description: null,
                        createdBy: currentUser.email,
                        createdAt: currentDate
                    }
                );
                await addDoc(
                    collection(FIREBASE_DB, 'members'), {
                        subjectId: subjectRef.id,
                        userId: currentUser.email,
                        role: 'admin',
                        joined: currentDate
                    }
                );
            } else {
                const subjectDocSnapshot = await getDoc(doc(FIREBASE_DB, 'subjects', className))

                if (!subjectDocSnapshot.exists()) throw Error('Класс с таким кодом не найдено')
                else {
                    const membersCollectionRef = collection(FIREBASE_DB, 'members');
                    const q = query(
                        membersCollectionRef,
                        where('subjectId', '==', className),
                        where('userId', '==', currentUser.email)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) throw Error('Вы уже были записаны на этот класс')
                    else {
                        await addDoc(membersCollectionRef, {
                            subjectId: className,
                            userId: currentUser.email,
                            role: 'pupil',
                            joined: new Date()
                        });
                    }
                }
            }
            setModalAdd({show: false, isCreate: false})
        } catch (e) {
            setLoading(false)
            return alert(e);
        }
        refresh()
        setClassName('')
    }


    return (
        <View style={{flex: 1}}>
            <FAB icon={IconPlus}
                size='medium'
                color='black'
                style={[StylesButtons.active, StylesButtons.buttonFloat]}
                onPress={() => setModalAdd(true)}
            />
            <ModalScreen modal={modalAdd} hideModal={() => setModalAdd(false)}
                content={
                    <View style={{gap: 15}}>
                        <TextInput mode="outlined"
                            inputMode="text"
                            label="Заголовок"
                            value={assignmentsTitle}
                            onChangeText={(v) => setClassName(v)}
                            maxLength={50}
                            style={[StylesTexts.default, {margin: 15}]}
                            theme={StylesPaper.input}
                            right={<TextInput.Affix text={`${assignmentsTitle.length}/50`}/>}
                        />
                        <TouchableRipple onPress={createAssignment}
                            style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={[StylesTexts.header]}> Создать </Text>
                        </TouchableRipple>
                    </View>
                }
            />

            <Button mode='contained' style={{width: 200, marginTop: 10, alignSelf: 'center'}} onPress={() => disableNetwork(FIREBASE_DB)}>disableNetwork</Button>
            <Button mode='contained' style={{width: 200, marginTop: 10, alignSelf: 'center'}} onPress={() => enableNetwork(FIREBASE_DB)}>enableNetwork</Button>
            
            <FlashList
                data={assignments}
                keyExtractor={(item) => item.id}
                estimatedItemSize={80}
                contentContainerStyle={{padding: 30}}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            // onPress={
                            //     () => { navigation.navigate('Assignments', { contextSubject: item.contextSubject, user: item.user }) }
                            // }
                            style={{marginBottom: 30}}
                        >
                            {/* <ClassesItem item={item}/> */}
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default Assignments;
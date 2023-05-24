import React, { useState, useEffect, useContext } from "react";
import { FlashList } from "@shopify/flash-list";
import { doc, addDoc, getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, IconButton, FAB, Portal } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import ClassItem from "./ClassItem";
import ModalEdit from '../Modals/ModalEdit'
import ModalDefault from '../Modals/ModalDefault'
import Loading from "../Modals/Loading";

import IconPlus from 'assets/svg/plus'
import IconUserGroup from 'assets/svg/user-group'
import IconAddToList from 'assets/svg/add-to-list'


const ClassesScreen = ({ route, navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser
    } = useContext(Context);
    const [loading, setLoading] = useState(false)
    const [modalMore, setModalMore] = useState(false)
    const [modalJoin, setModalJoin] = useState(false)
    
    const [subjects, setSubjects] = useState([])
    const [classCode, setClassCode] = useState('')
    
    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        if (Object.keys(contextSubject).length !== 0) {
            var data = [...subjects]
            let index = data.findIndex(v => v.subject.id === contextSubject.id)
            if (data[index].subject != contextSubject) {
                data[index].subject = contextSubject
                setSubjects(data)
            }
        }
    }, [contextSubject])

    useEffect(() => {
        if (route.params?.update) {
            refresh()
            updateContextSubject({})
        }
    }, [route.params])
    
    const refresh = async () => {
        setLoading(true)
        try {
            const email = await getUser()
            if (email === null) return alert('Login')
            await getSubjects(email)
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }

    const getUser = async () => {
        let item = await AsyncStorage.getItem('currentUser')
        if (item !== null) {
            let value = JSON.parse(item)
            updateContextCurrentUser(value)
            return value.email
        }
        return null
    }
    
    const getSubjects = async (email) => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'members'),
            where('userId', '==', email)
        ));

        const subjectIds = [];
        const subjectData = [];
        let countPupil = 0;

        querySnapshot.forEach(doc => {
            subjectIds.push({id: doc.data().subjectId, role: doc.data().role});
        });

        await Promise.all(subjectIds.map(async (subjectId) => {
            const subjectDocSnap = await getDoc(doc(FIREBASE_DB, 'subjects', subjectId.id));
            const userDocSnap = await getDoc(doc(FIREBASE_DB, 'users', subjectDocSnap.data().createdBy));

            const membersSnapshot = await getDocs(query(collection(FIREBASE_DB, 'members'),
                where('subjectId', '==', subjectId.id),
            ));
            if (!membersSnapshot.empty) {
                membersSnapshot.docs.forEach(member => {
                    if (member.data().role === 'pupil') countPupil += 1;
                })
            }
            var subjectDocData = Object.assign(subjectDocSnap.data(), {id: subjectDocSnap.id, role: subjectId.role})
            var userDocData = userDocSnap.data()
            subjectData.push({subject: subjectDocData, user: userDocData, countPupil: countPupil});
        }));

        setSubjects(subjectData);
    }

    const joinClass = async () => {
        if (classCode.length === 0) return alert('Введите название класса!')
        setLoading(true)
        try {
            const subjectDocSnapshot = await getDoc(doc(FIREBASE_DB, 'subjects', classCode))

            if (!subjectDocSnapshot.exists()) throw Error('Класс с таким кодом не найдено')
            else {
                if (!subjectDocSnapshot.data().canJoin) throw Error('Класс с таким кодом не найдено')
                const membersCollectionRef = collection(FIREBASE_DB, 'members');
                const q = query(
                    membersCollectionRef,
                    where('subjectId', '==', classCode),
                    where('userId', '==', contextCurrentUser.email)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) throw Error('Вы уже были записаны на этот класс')
                else {
                    await addDoc(membersCollectionRef, {
                        subjectId: classCode,
                        userId: contextCurrentUser.email,
                        role: 'pupil',
                        joined: new Date()
                    });
                }
            }
            setModalJoin(false)
        } catch (e) {
            setLoading(false)
            return alert(e);
        }
        refresh()
        setClassCode('')
    }


    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <FAB icon={IconPlus}
                size='medium'
                color='black'
                style={[StylesButtons.active, StylesButtons.buttonFloat]}
                onPress={() => setModalMore(true)}
            />
            <ModalDefault modal={modalMore} hideModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); navigation.navigate('ClassAdd')}}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <IconAddToList size={25}/>
                                <Text style={StylesTexts.default}> Создать </Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); setModalJoin(true)}}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <IconUserGroup size={25}/>
                                <Text style={StylesTexts.default}> Присоединиться </Text>
                            </View>
                        </TouchableRipple>
                    </>
                }
            />
            <ModalDefault modal={modalJoin} hideModal={() => setModalJoin(false)}
                content={
                    <View style={{gap: 15}}>
                        <TextInput mode="outlined"
                            inputMode="text"
                            label={"Код класса"}
                            value={classCode}
                            onChangeText={(v) => setClassCode(v)}
                            maxLength={50}
                            style={[StylesTexts.default, {margin: 15}]}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                        />
                        <TouchableRipple onPress={joinClass}
                            style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={[StylesTexts.header]}> Присоединиться </Text>
                        </TouchableRipple>
                    </View>
                }
            />
            
            <FlashList
                data={subjects}
                keyExtractor={(item) => item.subject.id}
                estimatedItemSize={130}
                contentContainerStyle={StylesContainers.screen}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={0.5}
                            onPress={() => {
                                updateContextSubject(item.subject);
                                navigation.navigate('ClassScreen');
                            }}
                            style={StylesContainers.flashListItemContainer}
                        >
                            <ClassItem item={item} refresh={() => refresh()}/>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default ClassesScreen;
import React, { useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDocs, getDoc, deleteDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { TextInput, TouchableRipple, IconButton, Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'
import StylesButtons from '../style/buttons'
import StylesPaper from '../style/paper'
import Styles from './styles'

import Context from 'config/context';
import ModalDefault from '../Modals/ModalDefault';
import Loading from '../Modals/Loading';

import IconClipboard from 'assets/svg/clipboard'
import IconMore from 'assets/svg/more-vertical'
import IconDelete from 'assets/svg/delete'
import IconStudent from 'assets/svg/student'


const MembersScreen = () => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess
    } = useContext(Context);

    const [loading, setLoading] = useState(false)
    const [modalMore, setModalMore] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [pupils, setPupils] = useState([])
    const [selectedMember, setSelectedMember] = useState('')

    useEffect(() => {
        const membersRef = collection(FIREBASE_DB, 'members');
        const membersCommentsQuery = query(
            membersRef,
            where('subjectId', '==', contextSubject.id)
        );

        const unsubscribe = onSnapshot(membersCommentsQuery, async (snapshot) => {
            const dataPupils = []
            const dataTeachers = []
            const dataMembers = [];
            snapshot.docs.forEach(doc => {
                dataMembers.push(doc.data());
            });
            await Promise.all(dataMembers.map(async (member) => {
                const docSnap = await getDoc(doc(FIREBASE_DB, 'users', member.userId));
                var value = Object.assign(docSnap.data(), member)
                member.role == 'pupil' ? dataPupils.push(value) : dataTeachers.push(value)
            }));
            setPupils(dataPupils);
            setTeachers(dataTeachers)
        });

        return () => {
            // Отписываемся от подписки при размонтировании компонента
            unsubscribe();
        };
    }, [])

    const refresh = async () => {
        setLoading(true)
        try {
            await getMembers()
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }
    
    const getMembers = async () => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'members'),
            where('subjectId', '==', contextSubject.id)
        ));
        const dataTeachers = [];
        const dataPupils = [];
        const dataMembers = [];
        querySnapshot.forEach(doc => {
            dataMembers.push(doc.data());
        });
        await Promise.all(dataMembers.map(async (member) => {
            const docSnap = await getDoc(doc(FIREBASE_DB, 'users', member.userId));
            var value = Object.assign(docSnap.data(), member)
            member.role == 'pupil' ? dataPupils.push(value) : dataTeachers.push(value)
        }));

        setTeachers(dataTeachers)
        setPupils(dataPupils)
    }

    const memberItem = (member) => {
        return (
            <View key={member.userId} style={[Styles.memberItem]}>
                <Text style={StylesTexts.default} numberOfLines={1}>
                    {member.firstname} {member.lastname}
                </Text>
                { contextSubject.role !== 'admin' || contextCurrentUser.email === member.userId ? null :
                    <IconButton
                        style={{position: 'absolute', right: 0}}
                        icon={IconMore}
                        size={20}
                        onPress={() => {
                            setSelectedMember(member)
                            setModalMore(true);
                        }}
                    />
                }
            </View>
        )
    }

    const setMember = async () => {
        setModalMore(false)
        setLoading(true)
        try {
            if (!(await checkUserAccess())) throw Error('Нет доступа!')
            var updatedRole = {
                role: selectedMember.role === 'pupil' ? 'teacher' : 'pupil'
            }
            const membersCollectionRef = collection(FIREBASE_DB, 'members');
            const q = query(membersCollectionRef,
                where('userId', '==', selectedMember.userId),
                where('subjectId', '==', selectedMember.subjectId)
            );

            // Получаем снимок запроса и обновляем документ
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docRef = doc(FIREBASE_DB, 'members', querySnapshot.docs[0].id);
                await updateDoc(docRef, updatedRole)
            }
        } catch (error) {
            alert(error);
        }
        refresh()
    }

    const deleteMember = async () => {
        setModalMore(false)
        setLoading(true)
        try {
            if (!(await checkUserAccess())) throw Error('Нет доступа!')
            const membersCollectionRef = collection(FIREBASE_DB, 'members');
            const q = query(membersCollectionRef,
                where('userId', '==', selectedMember.userId),
                where('subjectId', '==', selectedMember.subjectId)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docRef = doc(FIREBASE_DB, 'members', querySnapshot.docs[0].id);
                await deleteDoc(docRef)
            }
        } catch (error) {
            alert(error);
        }
        refresh()
    }

    return (
        <View>
            <ModalDefault modal={modalMore} hideModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => setMember()}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <IconStudent size={25}/>
                                <Text style={StylesTexts.default}> {selectedMember.role == 'pupil' ? 'Сделать преподавателем' : 'Сделать учеником'} </Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => deleteMember()}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <IconDelete size={25} color={StylesButtons.delete.backgroundColor}/>
                                <Text style={[StylesTexts.default, {color: StylesButtons.delete.backgroundColor}]}> Удалить с класса </Text>
                            </View>
                        </TouchableRipple>
                    </>
                }
            />
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
                        { teachers.map(teacher => memberItem(teacher)) }
                    </View>
                    <View style={{gap: 20}}>
                        <Text style={[StylesTexts.big, StylesTexts.borderBottom]}> Учащиеся </Text>
                        { pupils.map(pupil => memberItem(pupil)) }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default MembersScreen
import React, { useState, useEffect, useContext } from "react";
import { getDocs, deleteDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, IconButton, FAB, Portal } from 'react-native-paper';

import Colors from '../style/colors'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import Context from 'config/context';
import ModalEdit from '../Modals/ModalEdit'
import ModalDefault from '../Modals/ModalDefault'
import Loading from "../Modals/Loading";

import IconDelete from 'assets/svg/delete'
import IconMore from 'assets/svg/more-vertical'


const ClassesItem = ({ item, refresh }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser
    } = useContext(Context);
    const [modalMore, setModalMore] = useState(false)
    const subject = item.subject
    const user = item.user

    const clearCollection = async (bool) => {
        if (bool) {
            ['assignments', 'comments', 'members', 'submissions'].map(async (value) => {
                var q = query(collection(FIREBASE_DB, value),
                    where('subjectId', '==', subject.id)
                );
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            })
            await deleteDoc(doc(collection(FIREBASE_DB, 'subjects'), subject.id))
        } else {
            ['comments', 'members', 'submissions'].map(async (value) => {
                var q = query(collection(FIREBASE_DB, value),
                    where('userId', '==', contextCurrentUser.email),
                    where('subjectId', '==', subject.id)
                );
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            })
        }
        refresh()
    }

    return (
        <View style={Styles.classItem}>
            <ModalDefault modal={modalMore} hideModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => {
                                setModalMore(false);
                                contextCurrentUser.email === subject.createdBy ?
                                clearCollection(true)
                                :
                                clearCollection(false)
                            }}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <IconDelete size={25} color={Colors.alarm}/>
                                <Text style={[StylesTexts.default, {color: Colors.alarm}]}>
                                    { contextCurrentUser.email === subject.createdBy ? 'Удалить класс' : 'Выйти из класса' }
                                </Text>
                            </View>
                        </TouchableRipple>
                    </>
                }
            />
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={StylesTexts.big} numberOfLines={1}>
                    {subject.name}
                </Text>
                <Text style={StylesTexts.small}>
                    Учеников: {item.countPupil}
                </Text>
                <Text style={StylesTexts.small} numberOfLines={1}>
                    {user.firstname} {user.lastname}
                </Text>
            </View>
            <View style={{}}>
                <IconButton icon={IconMore} size={22} iconColor="black"
                    style={StylesButtons.buttonFloatTopRight}
                    onPress={() => setModalMore(true)}
                />
            </View>
        </View>
    );
};

export default ClassesItem;
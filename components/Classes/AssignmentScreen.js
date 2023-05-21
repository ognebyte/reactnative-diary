import React, { useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDocs, getDoc, deleteDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import moment from 'moment';

import StylesPaper from '../style/paper'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import Context from 'config/context';

import IconMore from 'assets/svg/more-vertical'


const AssignmentScreen = ({ route, navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess
    } = useContext(Context);
    const assignment = route.params.assignment
    const [createdByLoading, setCreatedByLoading] = useState(true)
    const [createdBy, setCreatedBy] = useState({})

    useEffect(() => {
        getTeacher()
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                    {contextSubject.role !== 'admin' ? null :
                        <IconButton icon={IconMore}
                            onPress={() => console.log('Я кнопка')}
                        />
                    }
                </View>
            )
        })
    }, [])

    const convertToTime = (value) => ((value.seconds * 1000) + (value.nanoseconds / 1000000));

    const getTeacher = async () => {
        try {
            const querySnapshot = await getDoc(doc(FIREBASE_DB, 'users', assignment.createdBy))
            if (querySnapshot.exists()) {
                setCreatedBy(querySnapshot.data())
                setCreatedByLoading(false)
            }
        } catch (error) {
            alert('Ошибка при получении документа:', error);
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={[StylesContainers.screen, Styles.assignmentHeader]}>
                <View style={{gap: 10}}>
                    <Text style={[StylesTexts.big, {borderBottomWidth: 2, paddingHorizontal: 5}]}>
                        {assignment.title}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={StylesTexts.small}> Создан: {moment(convertToTime(assignment.createdAt)).format('DD MMMM')} </Text>
                        {
                            createdByLoading ? <ActivityIndicator color={'black'} size={20} style={{position: 'absolute', right: 5}}/> :
                            <Text style={StylesTexts.small}> {createdBy.firstname} {createdBy.lastname} </Text>
                        }
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[StylesTexts.default, assignment.maxPoints ? null : StylesTexts.fadeColor]}>
                        {assignment.maxPoints ? `${assignment.maxPoints} баллов` : 'Без баллов'}
                    </Text>
                    <Text style={[StylesTexts.default, assignment.dueDate ? null : StylesTexts.fadeColor]}>
                        {assignment.dueDate ? `Срок сдачи: ${moment(convertToTime(assignment.dueDate)).format('DD MMMM, HH:mm')}` : 'Без срока сдачи'}
                    </Text>
                </View>
            </View>
            <View style={{flex: 1}}>
                
            </View>
        </View>
    );
};

export default AssignmentScreen;
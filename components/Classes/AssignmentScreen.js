import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, getDocs, addDoc, deleteDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { FlashList } from "@shopify/flash-list";
import { View, ScrollView, Text, ActivityIndicator, FlatList, TextInput, Alert, Platform } from 'react-native';
import { Button, IconButton, TouchableRipple } from 'react-native-paper';
import moment from 'moment';

import StylesPaper from '../style/paper'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import Context from 'config/context';
import ModalDefault from '../Modals/ModalDefault';
import Loading from '../Modals/Loading';

import IconMore from 'assets/svg/more-vertical'
import IconRefresh from 'assets/svg/refresh'
import IconSend from 'assets/svg/send'
import IconUserGroup from 'assets/svg/user-group'
import IconSettings from 'assets/svg/settings'
import IconDelete from 'assets/svg/delete'


const AssignmentScreen = ({ route, navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess,
        clearCollection
    } = useContext(Context);
    const [assignment, setAssignment] = useState(route.params.assignment)
    const [createdByLoading, setCreatedByLoading] = useState(true)
    const [createdBy, setCreatedBy] = useState({})
    
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [selectedComment, setSelectedComment] = useState({})
    const [loading, setLoading] = useState(false)
    const [modalMoreComment, setModalMoreComment] = useState(false)


    useEffect(() => {
        setAssignment(route.params.assignment)
        navigation.setOptions({
            headerStyle: StylesButtons.active,
            headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                    {contextSubject.role === 'pupil' ? null :
                        <IconButton icon={IconSettings}
                            onPress={() => navigation.navigate('AssignmentSettings', { assignment: route.params.assignment })}
                        />
                    }
                    <IconButton icon={IconRefresh}
                        onPress={refresh}
                    />
                </View>
            )
        })
    }, [route.params])

    const refresh = async () => {
        setLoading(true)
        const assignmentDoc = await getDoc(doc(FIREBASE_DB, 'assignments', assignment.id))
        setAssignment(Object.assign({}, assignment, assignmentDoc.data()))
        setLoading(false)
    }
    
    const getTeacher = async () => {
        try {
            const querySnapshot = await getDoc(doc(FIREBASE_DB, 'users', assignment.createdBy))
            if (querySnapshot.exists()) {
                setCreatedBy(querySnapshot.data())
                setCreatedByLoading(false)
            }
        } catch (error) {
            alert(error);
        }
    }

    const convertToTime = (value) => ((value.seconds * 1000) + (value.nanoseconds / 1000000));

    useEffect(() => {
        getTeacher()
        const commentsRef = collection(FIREBASE_DB, 'comments');
        const assignmentCommentsQuery = query(
            commentsRef,
            where('assignmentId', '==', assignment.id),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(assignmentCommentsQuery, async (snapshot) => {
            const commentsData = [];
            
            snapshot.docs.forEach(doc => {
                commentsData.unshift(Object.assign(doc.data(), {
                    id: doc.id, createdAt: convertToTime(doc.data().createdAt)
                }));
            });

            await Promise.all(commentsData.map(async (commentData) => {
                const userRef = doc(FIREBASE_DB, 'users', commentData.userId);
                const userDoc = await getDoc(userRef);
                Object.assign(commentData, userDoc.data());
            }));
            
            setComments(commentsData);
        });

        return () => {
            // Отписываемся от подписки при размонтировании компонента
            unsubscribe();
        };
    }, []);

    const sendComment = async () => {
        setComment('')
        try {
            await addDoc(
                collection(FIREBASE_DB, 'comments'), {
                    subjectId: contextSubject.id,
                    assignmentId: assignment.id,
                    userId: contextCurrentUser.email,
                    createdAt: new Date(),
                    comment: comment.replace(/^\s*\n/gm, "")
                }
            );
        } catch (error) {
            alert(error);
        }
    }

    const deleteComment = async () => {
        setModalMoreComment(false)
        try {
            await deleteDoc(doc(collection(FIREBASE_DB, 'comments'), selectedComment.id))
        } catch (error) {
            alert(error);
        }
    }

    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            <Loading loading={loading}/>
            <ScrollView style={{flex: 1}} contentContainerStyle={{gap: 30, paddingBottom: 100}} overScrollMode='never'>
                <View style={!assignment.description ? null : Styles.withDescription}>
                    <View style={[StylesContainers.screen, Styles.assignmentHeader]}>
                        <View style={{gap: 10}}>
                            <Text style={[StylesTexts.big, {borderBottomWidth: 1, paddingHorizontal: 5}]}>
                                {assignment.title}
                            </Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={StylesTexts.small}> Создан: {moment(assignment.createdAt).format('DD MMMM')} </Text>
                                {
                                    createdByLoading ? <ActivityIndicator color={'black'} size={20} style={{position: 'absolute', right: 5}}/> :
                                    <Text style={StylesTexts.small} numberOfLines={1}> {createdBy.firstname} {createdBy.lastname} </Text>
                                }
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[StylesTexts.default, assignment.dueDate ? null : StylesTexts.fadeColor]}>
                                {assignment.dueDate ? `Срок сдачи: ${moment(assignment.dueDate).format('DD MMMM, HH:mm')}` : 'Без срока сдачи'}
                            </Text>
                            <Text style={[StylesTexts.default, assignment.maxPoints ? null : StylesTexts.fadeColor]}>
                                {assignment.maxPoints ? `${assignment.maxPoints} баллов` : 'Без баллов'}
                            </Text>
                        </View>
                    </View>
                    {!assignment.description ? null :
                        <View style={[StylesContainers.screen]}>
                            <Text>
                                {assignment.description}
                            </Text>
                        </View>
                    }
                </View>
                <View style={[StylesContainers.screen, {gap: 15}]}>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        <IconUserGroup size={30}/>
                        <Text style={StylesTexts.big}> Комментарии ({comments.length}) </Text>
                    </View>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={90}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View style={Styles.commentContainer}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
                                        <Text style={StylesTexts.default} numberOfLines={1}> {item.firstname} {item.lastname} </Text>
                                        <Text style={[StylesTexts.small, StylesTexts.fadeColor]}> {moment(item.createdAt).format('DD MMMM, HH:mm')} </Text>
                                    </View>
                                    { contextSubject.role === 'pupil' && contextCurrentUser.email !== item.userId ? null :
                                        <IconButton icon={IconMore}
                                            size={20}
                                            onPress={() => {setModalMoreComment(true); setSelectedComment(item)}}
                                            style={{margin: -5, padding: 0}}
                                        />
                                    }
                                </View>
                                <Text style={StylesTexts.medium}>
                                    {item.comment}
                                </Text>
                            </View>
                        )}
                    />
                    <ModalDefault modal={modalMoreComment} hideModal={() => setModalMoreComment(false)}
                        content={
                            <>
                                <TouchableRipple style={StylesContainers.modalButton}
                                    onPress={() => (
                                        Alert.alert(
                                            'Удаление',
                                            'Вы уверены, что хотите удалить?',
                                            [
                                                { text: 'Отмена', style: 'cancel' },
                                                { text: 'Удалить', style: 'destructive', onPress: deleteComment },
                                            ],
                                        )
                                    )}
                                >
                                    <View style={StylesContainers.modalButtonWithIcon}>
                                        <IconDelete size={25} color={StylesButtons.delete.backgroundColor}/>
                                        <Text style={[StylesTexts.default, {color: StylesButtons.delete.backgroundColor}]}> Удалить </Text>
                                    </View>
                                </TouchableRipple>
                            </>
                        }
                    />
                </View>
            </ScrollView>
            <View style={Styles.commentInput}>
                <TextInput
                    inputMode='text'
                    placeholder='Введите комментарий'
                    returnKeyType='send'
                    value={comment}
                    onChangeText={v => setComment(v)}
                    onSubmitEditing={sendComment}
                    maxLength={200}
                    style={[StylesTexts.default, StylesTexts.inputMessage, {flex: 1}]}
                    selectionColor={StylesButtons.activeBack.backgroundColor}
                    multiline={true}
                />
                <IconButton mode='contained' onPress={sendComment}
                    icon={IconSend} size={30}
                    disabled={comment.trim().length === 0}
                    containerColor={StylesButtons.active.backgroundColor}
                    style={{margin: 0}}
                />
            </View>
        </View>
    );
};

export default AssignmentScreen;
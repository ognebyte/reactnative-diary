import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, getDocs, addDoc, deleteDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { FlashList } from "@shopify/flash-list";
import { View, ScrollView, Text, ActivityIndicator, FlatList, TextInput, Alert, Platform } from 'react-native';
import { Button, IconButton, TouchableRipple } from 'react-native-paper';
import moment from 'moment';

import Colors from '../style/colors'
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
        clearCollection,
        contextAssignment,
        updateContextAssignment,
        contextSubmissions,
        updateContextSubmissions,
    } = useContext(Context);
    const isPupil = contextSubject.role === 'pupil' ? true : false
    const [createdByLoading, setCreatedByLoading] = useState(true)
    const [createdBy, setCreatedBy] = useState({})
    
    const [submissionLoading, setSubmissionLoading] = useState(true)
    const [submissionExists, setSubmissionExists] = useState(false)
    const [submission, setSubmission] = useState({})
    const [submissionsCount, setSubmissionsCount] = useState({submitted: 0, graded: 0})
    
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [selectedComment, setSelectedComment] = useState({})
    const [commentLoading, setCommentLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [modalMoreComment, setModalMoreComment] = useState(false)

    useEffect(() => {
        isPupil ? getSubmission() : getSubmissions()
    }, [route.params])

    useEffect(() => {
        getTeacher()
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                    {isPupil ? null :
                        <IconButton icon={IconSettings}
                            onPress={() => navigation.navigate('AssignmentSettings')}
                        />
                    }
                    <IconButton icon={IconRefresh} onPress={refresh}/>
                </View>
            )
        })
    }, [])

    useEffect(() => {
        const commentsRef = collection(FIREBASE_DB, 'comments');
        const assignmentCommentsQuery = query(
            commentsRef,
            where('assignmentId', '==', contextAssignment.id),
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
            setCommentLoading(false)
            setComments(commentsData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const refresh = async () => {
        setLoading(true)
        isPupil ? getSubmission() : getSubmissions()
        const assignmentDoc = await getDoc(doc(FIREBASE_DB, 'assignments', contextAssignment.id))
        var value = {
            title: assignmentDoc.data().title,
            description: assignmentDoc.data().description,
            maxPoints: assignmentDoc.data().maxPoints,
            dueDate: convertToTime(assignmentDoc.data().dueDate)
        }
        updateContextAssignment(Object.assign({}, contextAssignment, value))
        setLoading(false)
    }

    const getSubmission = async () => {
        setSubmissionExists(false)
        setSubmissionLoading(true)
        const q = query(collection(FIREBASE_DB, 'submissions'),
            where('assignmentId', '==', contextAssignment.id),
            where('submittedBy', '==', contextCurrentUser.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            var submissionData = querySnapshot.docs[0].data()
            if (!submissionData.gradedBy) setSubmission(submissionData)
            else {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', submissionData.gradedBy))
                setSubmission(Object.assign(submissionData, userDoc.data()))
            }
            setSubmissionExists(true)
        }
        setSubmissionLoading(false)
    }
    
    const getSubmissions = async () => {
        setSubmissionLoading(true)
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'submissions'),
            where('assignmentId', '==', contextAssignment.id)
        ));

        var submissionsData = []
        querySnapshot.forEach(doc => {
            submissionsData.push(Object.assign(doc.data(), {id: doc.id}))
        });
        await Promise.all(submissionsData.map(async (sub) => {
            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', sub.submittedBy))
            Object.assign(sub, userDoc.data())
        }));
        updateContextSubmissions(submissionsData)
        setSubmissionsCount({
            submitted: submissionsData.length,
            graded: submissionsData.filter((obj) => obj.gradedBy !== null).length
        })
        setSubmissionLoading(false)
    }

    const deleteSubmission = async () => {
        setSubmissionLoading(true)
        try {
            const q = query(collection(FIREBASE_DB, 'submissions'),
                where('assignmentId', '==', contextAssignment.id),
                where('submittedBy', '==', contextCurrentUser.email)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setSubmissionExists(false)
                await deleteDoc(querySnapshot.docs[0].ref)
            }
        } catch (error) {
            alert(error);
        }
        setSubmissionLoading(false)
    }
    
    const getTeacher = async () => {
        try {
            const querySnapshot = await getDoc(doc(FIREBASE_DB, 'users', contextAssignment.createdBy))
            if (querySnapshot.exists()) {
                setCreatedBy(querySnapshot.data())
                setCreatedByLoading(false)
            }
        } catch (error) {
            alert(error);
        }
    }

    const convertToTime = (value) => {
        if (value === null) return null
        return ((value.seconds * 1000) + (value.nanoseconds / 1000000))
    };

    const sendComment = async () => {
        setComment('')
        try {
            await addDoc(
                collection(FIREBASE_DB, 'comments'), {
                    subjectId: contextSubject.id,
                    assignmentId: contextAssignment.id,
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
            <ScrollView style={{flex: 1}} contentContainerStyle={{gap: 60, paddingBottom: 100}} overScrollMode='never'>

                {/* Задание */}
                <View style={!contextAssignment.description ? null : Styles.withDescription}>
                    <View style={[StylesContainers.screen, Styles.assignmentHeader]}>
                        <View style={{gap: 10}}>
                            <Text style={[StylesTexts.big, {borderBottomWidth: 1, paddingHorizontal: 5}]}>
                                {contextAssignment.title}
                            </Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                {
                                    createdByLoading ? <ActivityIndicator color={'black'} size={15}/> :
                                    <Text style={[StylesTexts.small, {flex: 1}]} numberOfLines={1}> {createdBy.firstname} {createdBy.lastname} </Text>
                                }
                                <Text style={StylesTexts.small}> Создан: {moment(contextAssignment.createdAt).format('DD MMMM')} </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[StylesTexts.default, contextAssignment.dueDate ? null : StylesTexts.fadeColor]}>
                                {contextAssignment.dueDate ? `Срок сдачи: ${moment(contextAssignment.dueDate).format('DD MMMM, HH:mm')}` : 'Без срока сдачи'}
                            </Text>
                            <Text style={[StylesTexts.default, contextAssignment.maxPoints ? null : StylesTexts.fadeColor]}>
                                {contextAssignment.maxPoints ? `${contextAssignment.maxPoints} баллов` : 'Без баллов'}
                            </Text>
                        </View>
                    </View>
                    {!contextAssignment.description ? null :
                        <View style={[StylesContainers.screen]}>
                            <Text>
                                {contextAssignment.description}
                            </Text>
                        </View>
                    }
                </View>


                {/* Работа */}
                <View style={StylesContainers.screen}>
                    { isPupil ?
                        // Ученик
                        <View style={{gap: 15}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={StylesTexts.big}> Ваша работа </Text>
                                {
                                    submissionLoading ? <ActivityIndicator color={'black'} size={20}/>
                                    :
                                    <Text style={[StylesTexts.default, submissionExists ? null : {color: Colors.darkFade}]}>
                                        {
                                            !submissionExists ? 'Не сдано' :
                                            !submission.gradedBy ? 'На рассмотрении' :
                                            'Оценено'
                                        }
                                    </Text>
                                    
                                }
                            </View>
                            {
                                !submissionExists ? null :
                                <>
                                    <View style={Styles.submissionRight}>
                                        <Text style={StylesTexts.default} selectable={true} dataDetectorType={'all'}>
                                            {submission.comment}
                                        </Text>
                                        <Text style={[StylesTexts.small, {color: Colors.darkFade, alignSelf: 'flex-end'}]}>
                                            {moment(convertToTime(submission.submittedAt)).format('DD MMMM, HH:mm')}
                                        </Text>
                                    </View>
                                    {
                                        !submission.gradedBy ? null :
                                        <View style={Styles.submissionLeft}>
                                            <Text style={StylesTexts.default} numberOfLines={1}>
                                                {submission.firstname} {submission.lastname}
                                            </Text>
                                            <Text style={StylesTexts.small} selectable={true} dataDetectorType={'all'}>
                                                {submission.feedback}
                                            </Text>
                                            { submission.point === null ?
                                                <Text style={StylesTexts.small}>
                                                    Принято
                                                </Text>
                                                :
                                                <Text style={StylesTexts.small}>
                                                    Оценка: <Text style={StylesTexts.medium}>{submission.point}</Text>
                                                    {contextAssignment.maxPoints ? ` из ${contextAssignment.maxPoints}` : null}
                                                </Text>
                                            }
                                            <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>
                                                {moment(convertToTime(submission.gradedAt)).format('DD MMMM, HH:mm')}
                                            </Text>
                                        </View>
                                    }
                                </>
                            }
                            <View style={{borderRadius: 10, overflow: 'hidden', backgroundColor: !submissionExists ? Colors.needAttention : Colors.alarm}}>
                                <TouchableRipple mode='contained-tonal' disabled={submissionLoading}
                                    onPress={() => !submissionExists ? navigation.navigate('SubmissionAdd') :
                                    submission.gradedBy ? navigation.navigate('SubmissionAdd', { retake: true }) :
                                        Alert.alert(
                                            'Удаление',
                                            'Ваша работа будет удалена \nВы уверены, что хотите удалить?',
                                            [
                                                { text: 'Отмена', style: 'cancel' },
                                                { text: 'Удалить', style: 'destructive', onPress: deleteSubmission },
                                            ],
                                        )
                                    }
                                    style={{alignItems: 'center', padding: 10}}
                                >
                                    <Text style={[StylesTexts.medium, {color: Colors.light}]}>
                                        { !submissionExists ? 'Сдать' : !submission.gradedBy ? 'Отменить' : 'Пересдать' }
                                    </Text>
                                </TouchableRipple>
                            </View>
                        </View>
                        :
                        // Учитель
                        <View style={{gap: 15}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <View style={Styles.submissionsInfo}>
                                    { submissionLoading ? <ActivityIndicator color={'black'} size={28}/> :
                                        <Text style={StylesTexts.big}> {submissionsCount.submitted} </Text>
                                    }
                                    <Text style={StylesTexts.default}> Сдано </Text>
                                </View>
                                <View style={StylesContainers.verticalSeparator}/>
                                <View style={Styles.submissionsInfo}>
                                    { submissionLoading ? <ActivityIndicator color={'black'} size={28}/> :
                                        <Text style={StylesTexts.big}> {submissionsCount.graded} </Text>
                                    }
                                    <Text style={StylesTexts.default}> Оценено </Text>
                                </View>
                            </View>
                            
                            <View style={{borderRadius: 10, overflow: 'hidden', backgroundColor: !submissionExists ? Colors.needAttention : Colors.alarm}}>
                                <TouchableRipple mode='contained-tonal' disabled={submissionLoading}
                                    onPress={() => navigation.navigate('SubmissionsScreen')}
                                    style={{alignItems: 'center', padding: 10}}
                                >
                                    <Text style={[StylesTexts.medium, {color: Colors.light}]}>
                                        Посмотреть
                                    </Text>
                                </TouchableRipple>
                            </View>
                        </View>
                    }
                </View>

                {/* Комментарии */}
                <View style={[StylesContainers.screen, {gap: 15}]}>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        <IconUserGroup size={30}/>
                        <Text style={StylesTexts.big}> Комментарии ({comments.length}) </Text>
                        {
                            !commentLoading ? null :
                            <ActivityIndicator color={'black'} size={20} style={{right: 5}}/>
                        }
                    </View>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={90}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View style={Styles.commentContainer}>
                                <View style={{gap: 5}}>
                                    { isPupil && contextCurrentUser.email !== item.userId ? null :
                                        <IconButton icon={IconMore}
                                            size={20}
                                            onPress={() => {setModalMoreComment(true); setSelectedComment(item)}}
                                            style={StylesButtons.buttonFloatTopRight}
                                        />
                                    }
                                    <Text style={[StylesTexts.medium, {flex: 1, marginRight: 40}]} numberOfLines={1}>
                                        {item.firstname} {item.lastname}
                                    </Text>
                                    <Text style={StylesTexts.default}>
                                        {item.comment}
                                    </Text>
                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>
                                        {moment(item.createdAt).format('DD MMMM, HH:mm')}
                                    </Text>
                                </View>
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
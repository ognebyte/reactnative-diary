import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { doc, addDoc, getDocs, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, FAB } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import AssignmentItem from "./AssignmentItem";
import ModalDefault from '../Modals/ModalDefault'
import ModalScreen from '../Modals/ModalScreen'
import Loading from "../Modals/Loading";

import IconMore from 'assets/svg/more-vertical'
import IconPlus from 'assets/svg/plus'


const AssignmentsScreen = ({ navigate }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess,
        clearCollection,
        contextAssignment,
        updateContextAssignment,
    } = useContext(Context);

    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const isPupil = contextSubject.role === 'pupil' ? true : false
    
    const convertToTime = (value) => {
        if (value === null) return null
        return ((value.seconds * 1000) + (value.nanoseconds / 1000000))
    };

    useEffect(() => {
        const assignmentsRef = collection(FIREBASE_DB, 'assignments');
        const assignmentsCommentsQuery = query(
            assignmentsRef,
            where('subjectId', '==', contextSubject.id),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(assignmentsCommentsQuery, async (snapshot) => {
            setLoading(true)
            const assignmentsData = [];
            snapshot.docs.forEach(doc => {
                var docData = doc.data()
                assignmentsData.unshift(Object.assign(docData, {
                    id: doc.id,
                    createdAt: convertToTime(docData.createdAt),
                    dueDate: convertToTime(docData.dueDate)
                }));
            });

            await Promise.all(assignmentsData.map(async (assignment) => {
                if (isPupil) {
                    var submission = null
                    const q = query(collection(FIREBASE_DB, 'submissions'),
                        where('assignmentId', '==', assignment.id),
                        where('submittedBy', '==', contextCurrentUser.email)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        submission = querySnapshot.docs[0].data()
                    }
                    Object.assign(assignment, {
                        submission: submission
                    })
                } else {
                    var submissionSubmitted = 0
                    var submissionGraded = 0
                    const querySubmissions = await getDocs(query(
                        collection(FIREBASE_DB, 'submissions'),
                        where('assignmentId', '==', assignment.id)
                    ))
                    if (!querySubmissions.empty) {
                        submissionSubmitted = querySubmissions.docs.length
                        submissionGraded = querySubmissions.docs.filter((obj) => obj.data().gradedBy !== null).length
                    }
                    
                    var commentCount = 0
                    const queryComments = await getDocs(query(
                        collection(FIREBASE_DB, 'comments'),
                        where('assignmentId', '==', assignment.id)
                    ))
                    if (!queryComments.empty) {
                        commentCount = queryComments.docs.length
                    }
                    Object.assign(assignment, {
                        submissionSubmitted: submissionSubmitted,
                        submissionGraded: submissionGraded,
                        commentCount: commentCount,
                    })
                }
            }));
            setLoading(false)
            setAssignments(assignmentsData);
        });

        return () => {
            unsubscribe();
        };
    }, [])

    return (
        <View style={{flex: 1}}>
            {
                isPupil ? null :
                <FAB icon={IconPlus}
                    size='medium'
                    color='black'
                    style={[StylesButtons.active, StylesButtons.buttonFloat]}
                    onPress={() => navigate('AssignmentAdd')}
                />
            }
            <FlashList
                data={assignments}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={loading} enabled={false}/>}
                estimatedItemSize={isPupil ? 180 : 190}
                contentContainerStyle={StylesContainers.contentContainerStyle}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            onPress={
                                () => {
                                    updateContextAssignment(item)
                                    navigate('AssignmentScreen')
                                }
                            }
                            style={StylesContainers.flashListItemContainer}
                        >
                            <AssignmentItem item={item}/>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default AssignmentsScreen;
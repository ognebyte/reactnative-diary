import React, { useState, useContext, useEffect } from "react";
import { updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import moment from 'moment';

import Colors from '../style/colors'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'
import Styles from './styles'

import Context from 'config/context';
import Loading from "../Modals/Loading";

import IconMore from 'assets/svg/more-vertical'
import IconRefresh from 'assets/svg/refresh'
import IconSend from 'assets/svg/send'
import IconUserGroup from 'assets/svg/user-group'
import IconSettings from 'assets/svg/settings'
import IconDelete from 'assets/svg/delete'

const SubmissionGrade = ({ route, navigation }) => {
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
    const submission = route.params.submission
    const screenPadding = StylesContainers.screen.padding;
    const [loading, setLoading] = useState(false)
    const [point, setPoint] = useState(submission.point)
    const [feedback, setFeedback] = useState(submission.feedback)

    useEffect(() => {
        navigation.setOptions({
            title: `${submission.firstname} ${submission.lastname}`
        })
    }, [])

    const convertToTime = (value) => {
        if (value === null) return null
        return ((value.seconds * 1000) + (value.nanoseconds / 1000000))
    };

    const gradeSubmission = async () => {
        setLoading(true)
        try {
            await updateDoc(
                doc(FIREBASE_DB, 'submissions', submission.id), {
                    point: point ? point : null,
                    feedback: feedback ? feedback.replace(/^\s*\n/gm, "") : null,
                    gradedBy: contextCurrentUser.email,
                    gradedAt: new Date(),
                }
            );
            var updatedSubmissions = contextSubmissions.map(sub => {
                if (sub.id === submission.id) {
                    return Object.assign({}, sub, {
                        point: point ? point : null,
                        feedback: feedback ? feedback.replace(/^\s*\n/gm, "") : null,
                        gradedBy: contextCurrentUser.email,
                        gradedAt: moment(new Date()).valueOf(),
                    })
                }
                return sub
            })
            updateContextSubmissions(updatedSubmissions)
            navigation.goBack()
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                onPress={gradeSubmission}
                style={StylesButtons.buttonFloat}
                labelStyle={StylesTexts.default}
                buttonColor={StylesButtons.active.backgroundColor}
            >
                Отправить
            </Button>
            <ScrollView
                style={{paddingHorizontal: screenPadding}}
                contentContainerStyle={StylesContainers.scrollViewContainer}
            >
                <View style={{gap: 15}}>
                    {
                        !contextAssignment.dueDate ? 
                        <Text style={[StylesTexts.medium, {color: Colors.darkFade}]}>
                            {moment(convertToTime(submission.submittedAt)).format('DD MMMM, HH:mm')}
                        </Text>
                        : !moment(convertToTime(submission.submittedAt)).isAfter(moment(contextAssignment.dueDate)) ?
                        <Text style={[StylesTexts.medium, {color: Colors.darkFade}]}>
                            Сдано заранее: {moment(convertToTime(submission.submittedAt)).format('DD MMMM, HH:mm')}
                        </Text>
                        :
                        <Text style={[StylesTexts.medium, {color: Colors.alarm}]}>
                            Сдано с опозданием: {moment(convertToTime(submission.submittedAt)).format('DD MMMM, HH:mm')}
                        </Text>
                    }
                    <Text style={StylesTexts.medium} dataDetectorType={'all'}>
                        {submission.comment}
                    </Text>
                    <TextInput mode='outlined'
                        inputMode='decimal'
                        label='Оценка'
                        value={point}
                        onChangeText={v => setPoint(v)}
                        maxLength={50}
                        style={[StylesTexts.default, {flex: 1}]}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        right={!contextAssignment.maxPoints ? null :
                            <TextInput.Affix text={` из ${contextAssignment.maxPoints}`}/>
                        }
                    />
                    <TextInput mode='outlined'
                        inputMode='text'
                        label='Комментарий'
                        value={feedback}
                        onChangeText={v => setFeedback(v)}
                        maxLength={50}
                        style={[StylesTexts.default, {flex: 1}]}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        multiline={true}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default SubmissionGrade;
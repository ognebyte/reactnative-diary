import React, { useState, useContext } from "react";
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, ScrollView } from 'react-native';
import 'moment/locale/ru'
import { TextInput, Button, Chip, TouchableRipple } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import Loading from "../Modals/Loading";


const SubmissionAdd = ({ navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess,
        clearCollection,
        contextAssignment,
        updateContextAssignment
    } = useContext(Context);
    const screenPadding = StylesContainers.screen.padding;
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState('')

    const assignmentMark = async () => {
        setLoading(true)
        try {
            await addDoc(
                collection(FIREBASE_DB, 'submissions'), {
                    subjectId: contextSubject.id,
                    assignmentId: contextAssignment.id,
                    submittedBy: contextCurrentUser.email,
                    submittedAt: new Date(),
                    comment: comment ? comment.replace(/^\s*\n/gm, "") : null,
                    point: null,
                    gradedBy: null,
                    gradedAt: null,
                    feedback: null
                }
            );
            navigation.navigate('AssignmentScreen', { mark: true })
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                onPress={assignmentMark}
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
                <View style={{gap: 30}}>
                    <TextInput mode="outlined"
                        inputMode="text"
                        label={"Текст"}
                        value={comment}
                        onChangeText={(v) => setComment(v)}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        multiline={true}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default SubmissionAdd;
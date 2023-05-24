import React, { useState, useContext, useEffect } from "react";
import { updateDoc, doc, deleteDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/ru'
import { View, Text, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Chip, TouchableRipple } from 'react-native-paper';

import NavigationTheme from '../style/navigation';
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import Loading from "../Modals/Loading";
import ModalDefault from "../Modals/ModalDefault";

import IconClose from 'assets/svg/close'


const AssignmentSettings = ({ navigation }) => {
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
    const [title, setTitle] = useState(contextAssignment.title)
    const [description, setDescription] = useState(contextAssignment.description)
    const [dueDate, setDueDate] = useState(contextAssignment.dueDate)
    const [maxPoints, setMaxPoints] = useState(contextAssignment.maxPoints)
    
    const [modalDate, setModalDate] = useState(false)
    const [modalScore, setModalScore] = useState(false)

    const assignmentSave = async () => {
        setLoading(true)
        try {
            if (!(await checkUserAccess())) throw Error('Нет доступа!')
            await updateDoc(
                doc(FIREBASE_DB, 'assignments', contextAssignment.id), {
                    title: title,
                    description: description ? description : null,
                    dueDate: dueDate ? dueDate : null,
                    maxPoints: maxPoints
                }
            );
            updateContextAssignment(Object.assign({}, contextAssignment, {
                title: title,
                description: description,
                dueDate: dueDate ? moment(dueDate).valueOf() : null,
                maxPoints: maxPoints
            }))
            navigation.navigate('AssignmentScreen')
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    const deleteAssignment = async () => {
        try {
            if (!(await checkUserAccess())) throw Error('Нет доступа!')
            navigation.navigate('ClassScreen')
            await clearCollection('comments')
            await clearCollection('submissions')
            await deleteDoc(doc(collection(FIREBASE_DB, 'assignments'), contextAssignment.id))
        } catch (error) {
            alert(error);
        }
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                onPress={assignmentSave}
                disabled={title.length === 0}
                style={StylesButtons.buttonFloat}
                labelStyle={StylesTexts.default}
                buttonColor={StylesButtons.active.backgroundColor}
            >
                Сохранить
            </Button>
            <ScrollView
                style={{paddingHorizontal: screenPadding, backgroundColor: 'white'}}
                contentContainerStyle={StylesContainers.scrollViewContainer}
            >
                <View style={{gap: 30}}>
                    <TextInput mode="outlined"
                        inputMode='text'
                        label='Заголовок задания'
                        value={title}
                        onChangeText={v => setTitle(v)}
                        maxLength={50}
                        style={[StylesTexts.default]}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        right={<TextInput.Affix text={`${title.length}/50`}/>}
                    />

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                        style={{flexDirection: 'row'}}
                    >
                        <Chip onPress={() => setModalDate(true)} onClose={() => setDueDate('')}
                            textStyle={[StylesTexts.default, {marginLeft: 0, padding: 10}]}
                            style={[StylesButtons.active, {justifyContent: 'center', marginRight: 15}]}
                        >
                            {!dueDate ? ' Без срока сдачи ' : ` Срок сдачи: ${moment(dueDate).format('D MMMM, HH:mm')} `}
                        </Chip>
                        <Chip onPress={() => setModalScore(true)} onClose={() => setMaxPoints(0)}
                            textStyle={[StylesTexts.default, {marginLeft: 0, padding: 10}]}
                            style={[StylesButtons.active, {justifyContent: 'center', marginRight: 15}]}
                        >
                            {!maxPoints ? 'Без баллов' : `Баллы: ${maxPoints}`}
                        </Chip>
                    </ScrollView>

                    <DateTimePickerModal isVisible={modalDate}
                        mode='datetime'
                        onHide={() => setModalDate(false)}
                        onConfirm={(d) => {
                            setDueDate(d)
                            setModalDate(false)
                        }}
                        onCancel={() => { setModalDate(false) }}
                    />
                    
                    <ModalDefault modal={modalScore} hideModal={() => setModalScore(false)}
                        content={
                            <>
                                <TextInput mode="outlined"
                                    inputMode='decimal'
                                    label='Баллов'
                                    blurOnSubmit={false}
                                    value={maxPoints.toString()}
                                    onChangeText={v => setMaxPoints(v)}
                                    onSubmitEditing={() => setModalScore(false)}
                                    style={[StylesTexts.default, {margin: StylesContainers.screen.padding}]}
                                    theme={StylesPaper.input}
                                    selectionColor={StylesButtons.activeBack.backgroundColor}
                                />
                                <TouchableRipple onPress={() => setModalScore(false)}
                                    style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                                >
                                    <Text style={[StylesTexts.header]}> Сохранить </Text>
                                </TouchableRipple>
                            </>
                        }
                    />
                    
                    <TextInput mode="outlined"
                        inputMode="text"
                        label={"Описание"}
                        value={description}
                        onChangeText={(v) => setDescription(v)}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        multiline={true}
                    />
                    
                    <View style={{height: 50, borderRadius: 10, overflow: 'hidden'}}>
                        <TouchableRipple style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => (
                                Alert.alert(
                                    'Удаление',
                                    'Вы уверены, что хотите удалить?',
                                    [
                                        { text: 'Отмена', style: 'cancel' },
                                        { text: 'Удалить', style: 'destructive', onPress: deleteAssignment },
                                    ],
                                )
                            )}
                        >
                            <Text style={[StylesTexts.medium, {color: StylesButtons.delete.backgroundColor}]}> Удалить задание </Text>
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AssignmentSettings;
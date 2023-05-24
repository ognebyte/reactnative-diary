import React, { useState, useContext } from "react";
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, Text, ScrollView } from 'react-native';
import moment from 'moment';
import 'moment/locale/ru'
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


const AssignmentAdd = ({ navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess
    } = useContext(Context);
    const screenPadding = StylesContainers.screen.padding;
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState(null)
    const [dueDate, setDueDate] = useState(null)
    const [maxPoints, setMaxPoints] = useState(0)
    
    const [modalDate, setModalDate] = useState(false)
    const [modalScore, setModalScore] = useState(false)

    const assignmentAdd = async () => {
        setLoading(true)
        try {
            if (!(await checkUserAccess())) throw Error('Нет доступа!')
            await addDoc(
                collection(FIREBASE_DB, 'assignments'), {
                    subjectId: contextSubject.id,
                    createdBy: contextCurrentUser.email,
                    createdAt: new Date(),
                    title: title,
                    description: description ? description : null,
                    dueDate: dueDate ? dueDate : null,
                    maxPoints: maxPoints,
                }
            );
            navigation.navigate('ClassScreen')
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                onPress={assignmentAdd}
                disabled={title.length === 0}
                style={StylesButtons.buttonFloat}
                buttonColor={StylesButtons.active.backgroundColor}
            >
                Добавить
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
                            {!dueDate ? ' Без срока сдачи ' : ` Срок сдачи: ${moment(dueDate).locale('ru').format('D MMMM, HH:mm')} `}
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
                </View>
            </ScrollView>
        </View>
    );
};

export default AssignmentAdd;
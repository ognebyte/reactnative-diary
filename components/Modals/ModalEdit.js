import React, { useState, useRef, useEffect } from "react";
import moment from 'moment';
import 'moment/locale/ru'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Dimensions, Keyboard, Switch } from 'react-native';
import Modal from "react-native-modal";
import { Checkbox } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'

import Close from '../../assets/svg/close'

const ModalEdit = (props) => {
    const windowDimensions = Dimensions.get('window');
    const windowWidth = windowDimensions.width
    
    const [modal, setModal] = useState(true)
    const [edited, setEdited] = useState(false)
    const [e, setE] = useState(false)

    const [inputTitle, setInputTitle] = useState(props.title)
    const [inputDescription, setInputDescription] = useState(props.description)
    const [inputGrade, setInputGrade] = useState(props.grade)
    const inputDeadline = props.deadline
    // const [saturday, setSaturday] = useState(props.saturday == 1 ? true : false)

    const [isComplete, setIsComplete] = useState(props.isComplete ? true : false)
    const [titleEdit, setTitleEdit] = useState(false)
    const [modalDate, setModalDate] = useState(false)
    const [date, setDate] = useState(inputDeadline)
    const [modalTime, setModalTime] = useState(false)
    const [time, setTime] = useState(inputDeadline)

    useEffect(() => {
        setEdited(true)
    }, [inputTitle, inputDescription, inputGrade, date, time, isComplete])

    return (
        <Modal isVisible={modal}
            onModalHide={() => props.show(e)}
            backdropOpacity={0.5}
            animationOutTiming={500}
            backdropTransitionOutTiming={500}
            style={{justifyContent: 'flex-end', margin: 0}}
        >
            <View>
                <ScrollView contentContainerStyle={{paddingTop: 150}}>
                    <View style={StylesContainers.modal}>
                        <View style={{gap: 30}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 30}}>
                                <View style={{flex: 1}}>
                                    <TextInput
                                        blurOnSubmit={true}
                                        onEndEditing={() => setTitleEdit(false)}
                                        onFocus={() => setTitleEdit(true)}
                                        inputMode="text"
                                        placeholder="Введите заголовок"
                                        returnKeyType='done'
                                        value={inputTitle}
                                        onChangeText={(v) => setInputTitle(v)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        style={[
                                            StylesTexts.big, StylesTexts.inputTitle,
                                            {
                                                textDecorationLine: isComplete ? 'line-through' : 'none',
                                                borderColor: titleEdit ? 'black' : 'transparent'
                                            }
                                        ]}
                                        placeholderTextColor={StylesTexts.placeholder.color}
                                        multiline={true}
                                        maxLength={50}
                                    />
                                </View>
                                { props.isComplete === null ? null :
                                    <Checkbox status={isComplete ? 'checked' : 'unchecked'}
                                        onPress={() => setIsComplete(!isComplete)}
                                    />
                                }
                            </View>

                            { !props.extraShow ? null :
                                <View style={StylesContainers.column}>
                                    <View style={{flexDirection: 'row', gap: 10}}>
                                        <TouchableOpacity onPress={() => {setModalDate(true)}} style={[StylesTexts.inputExtra]}>
                                            <Text style={[!date ? StylesTexts.fadeColor : null]}>
                                                {!date ? ' Без срока сдачи ' : ` Срок сдачи: ${moment(date).locale('ru').format('D MMMM')} `}
                                            </Text>
                                            {
                                                !date ? null : 
                                                <TouchableOpacity style={{}} onPress={() => setDate(null)}>
                                                    <Close size={22} color={'black'}/>
                                                </TouchableOpacity>
                                            }
                                        </TouchableOpacity>

                                        <DateTimePickerModal
                                            isVisible={modalDate}
                                            mode='date'
                                            onHide={() => setModalDate(false)}
                                            onConfirm={(d) => {setDate(d); setModalDate(false)}}
                                            onCancel={() => setModalDate(false)}
                                        />

                                        {
                                            !date ? null :
                                            <TouchableOpacity onPress={() => {setModalTime(true)}}
                                                style={[StylesTexts.inputExtra]}
                                            >
                                                <Text style={[!time || moment(time).format('HH:mm') == '23:59' ? StylesTexts.fadeColor : null]}>
                                                    {!time ? ' Время: 23:59 ' : ` Время: ${moment(time).format('HH:mm')} `}
                                                </Text>
                                                {
                                                    !time || moment(time).format('HH:mm') == '23:59' ? null : 
                                                    <TouchableOpacity onPress={() => setTime(null)}>
                                                        <Close size={22} color={'black'}/>
                                                    </TouchableOpacity>
                                                }
                                            </TouchableOpacity>
                                        }

                                        <DateTimePickerModal
                                            isVisible={modalTime}
                                            mode='time'
                                            onHide={() => setModalTime(false)}
                                            onConfirm={(d) => {setTime(d); setModalTime(false)}}
                                            onCancel={() => setModalTime(false)}
                                        />
                                    </View>

                                    <TextInput
                                        blurOnSubmit={false}
                                        inputMode="numeric"
                                        placeholder="Баллов"
                                        returnKeyType='done'
                                        value={inputGrade}
                                        onChangeText={(v) => setInputGrade(v)}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        style={[StylesTexts.small, StylesTexts.inputExtra, {width: 100}]}
                                        placeholderTextColor={StylesTexts.fadeColor.color}
                                        numberOfLines={1}
                                        maxLength={10}
                                    />
                                </View>
                            }
                            { !props.descriptionShow ? null :
                                <View style={{overflow: 'hidden'}}>
                                    <TextInput
                                        blurOnSubmit={false}
                                        inputMode="text"
                                        placeholder="Описание"
                                        value={inputDescription}
                                        onChangeText={(v) => setInputDescription(v)}
                                        style={[StylesTexts.inputMulti, StylesTexts.input]}
                                        placeholderTextColor={StylesTexts.fadeColor.color}
                                        multiline={true}
                                    />
                                </View>
                            }
                            {/* { !props.schedule ? null :
                                <View style={{alignItems: 'center'}}>
                                    <Text style={[StylesTexts.default, {color: saturday ? '#000000' : StylesTexts.fadeColor.color}]}> Суббота </Text>
                                    <Switch style={{margin: 0, padding: 0}}
                                        trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                                        thumbColor={saturday ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor}
                                        onValueChange={() => setSaturday(!saturday)}
                                        value={saturday}
                                    />
                                </View>
                            } */}
                        </View>
                        
                        <View style={{flexDirection: 'row', width: '100%', marginTop: 60, gap: 10}}>
                            <TouchableOpacity onPress={() => setModal(false)}
                                activeOpacity={0.5}
                                style={[StylesButtons.default, StylesButtons.bottom, { flex: 0.5, backgroundColor: 'black' }]}
                            >
                                <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Закрыть </Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={!edited}
                                onPress={() => {
                                    if(inputTitle.length === 0) alert('Заголовок пустой!')
                                    else {
                                        let datetime = null
                                        if(date) {
                                            datetime = `${!date ? '' : moment(date).format('YYYY-MM-DD')} ${!time ? '23:59:00' : moment(time).format('HH:mm:ss')}`
                                        }
                                        props.saveInputs(inputTitle, inputDescription, inputGrade, datetime, isComplete)
                                        setEdited(!edited)
                                        setE(true)
                                    }
                                }}
                                activeOpacity={0.5}
                                style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept, { flex: 0.5, opacity: edited ? 1 : 0.5 }]}
                            >
                                <Text style={[StylesTexts.default]}> Сохранить </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ModalEdit;
import React, { useState, useRef, useEffect } from "react";
import moment from 'moment';
import 'moment/locale/ru'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, TextInput, Text, TouchableOpacity, Keyboard, ScrollView, Switch } from 'react-native';
import Modal from "react-native-modal";

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'

import Close from '../../assets/svg/close'

const ModalAdd = (props) => {
    const [modal, setModal] = useState(true)
    const inputSecond = useRef(null)
    const inputThird = useRef(null)
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputDescription] = useState("")
    const [inputGrade, setInputGrade] = useState("")    

    const [modalDate, setModalDate] = useState(false)
    const [date, setDate] = useState('')
    const [modalTime, setModalTime] = useState(false)
    const [time, setTime] = useState('')
    
    const [saturday, setSaturday] = useState(true)
    const [sunday, setSunday] = useState(false)

    const checkTitle = () => {
        if(inputTitle.length === 0) alert('Заголовок пустой!')
        else {
            let datetime = null
            if(date) {
                datetime = `${!date ? '' : moment(date).format('YYYY-MM-DD')} ${!time ? '23:59:00' : moment(time).format('HH:mm:ss')}`
            }
            props.addInputs(inputTitle, inputDescription, inputGrade, datetime)
            setModal(false)
        }
    }

    return (
        <Modal isVisible={modal}
            onModalHide={() => props.show()}
            backdropOpacity={0.5}
            animationOutTiming={300}
            style={{justifyContent: 'flex-end', margin: 0}}
        >
            <View>
                <ScrollView contentContainerStyle={{paddingTop: 150}}>
                    <View style={[StylesContainers.modal, {padding: 30}]}>
                        <View style={{gap: 30}}>
                            <Text style={StylesTexts.big}>
                                Создание новой записи
                            </Text>
                            
                            <TextInput
                                autoFocus={true}
                                blurOnSubmit={true}
                                inputMode="text"
                                placeholder="Введите заголовок"
                                returnKeyType='done'
                                value={inputTitle}
                                onChangeText={(v) => setInputTitle(v)}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                style={[StylesTexts.big, StylesTexts.inputTitle, {borderColor: 'black'}]}
                                placeholderTextColor={StylesTexts.placeholder.color}
                                multiline={true}
                                maxLength={50}
                            />
                            
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
                                            onConfirm={(d) => {
                                                setDate(d)
                                                setModalDate(false)
                                            }}
                                            onCancel={() => { setModalDate(false) }}
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
                                            onConfirm={(d) => {
                                                setTime(d)
                                                setModalTime(false)
                                            }}
                                            onCancel={() => { setModalTime(false) }}
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
                                        ref={inputSecond}
                                        blurOnSubmit={false}
                                        inputMode="text"
                                        placeholder="Описание"
                                        value={inputDescription}
                                        onChangeText={(v) => setInputDescription(v)}
                                        style={[StylesTexts.input, StylesTexts.inputMulti]}
                                        placeholderTextColor={StylesTexts.placeholder.color}
                                        multiline={true}
                                    />
                                </View>
                            }
                            {/* { !props.week ? null :
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={[StylesTexts.default, {color: saturday ? '#000000' : StylesTexts.fadeColor.color}]}> Суббота </Text>
                                        <Switch style={{margin: 0, padding: 0}}
                                            trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                                            thumbColor={saturday ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor}
                                            onValueChange={() => setSaturday(!saturday)}
                                            value={saturday}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={[StylesTexts.default, {color: sunday ? '#000000' : StylesTexts.fadeColor.color}]}> Воскресенье </Text>
                                        <Switch style={{margin: 0, padding: 0}}
                                            trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                                            thumbColor={sunday ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor}
                                            onValueChange={() => setSunday(!sunday)}
                                            value={sunday}
                                        />
                                    </View>
                                </View>
                            } */}
                        </View>

                        <View style={{flexDirection: 'row', width: '100%', marginTop: 100, gap: 10}}>
                            <TouchableOpacity
                                activeOpacity={ 0.5 }
                                style={[StylesButtons.default, StylesButtons.bottom, { flex: 0.5, backgroundColor: 'black' }]}
                                onPress={() => setModal(false)}
                            >
                                <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Закрыть </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={ 0.5 }
                                style={[StylesButtons.default, StylesButtons.bottom, StylesButtons.accept, { flex: 0.5 }]}
                                onPress={() => checkTitle()}
                            >
                                <Text style={[StylesTexts.default]}> Создать </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ModalAdd;
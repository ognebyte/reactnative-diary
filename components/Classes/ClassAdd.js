import React, { useState, useEffect, useRef } from "react";
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import Modal from "react-native-modal";
import { TextInput, TouchableRipple, Button } from 'react-native-paper';

import StylesPaper from '../style/paper'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'

import ModalEdit from '../Modals/ModalEdit'
import ModalAdd from '../Modals/ModalAdd'

import IconPlus from 'assets/svg/plus'


const ClassAdd = ({ navigation }) => {
    const [modalMore, setModalMore] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    const inputLocation = useRef(null)
    
    const [className, setClassName] = useState('')

    // useEffect(() => {
    //     navigation.setOptions({ headerRight: null })
    // }, [navigation])

    const createClass = () => {
        if (className.length === 0) alert('Введите название класса!')
    }


    return (
        <View style={{flex: 1}}>
            <ScrollView style={StylesContainers.screen}>
                <View style={{gap: 15}}>
                    <TextInput mode="outlined"
                        inputMode="text"
                        label="Название класса (обязательно)"
                        returnKeyType={'next'}
                        onSubmitEditing={() => inputLocation.current.focus()}
                        value={className}
                        onChangeText={(v) => setClassName(v)}
                        maxLength={50}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                    />
                    <TextInput mode="outlined" ref={inputLocation}
                        inputMode="text"
                        label="Аудитория"
                        returnKeyType={'done'}
                        value={className}
                        onChangeText={(v) => setClassName(v)}
                        maxLength={50}
                        style={StylesTexts.default}
                        theme={StylesPaper.input}
                    />
                    <View style={{borderRadius: 10, overflow: 'hidden'}}>
                        <TouchableRipple onPress={createClass}
                            style={{padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={StylesTexts.header}> Создать </Text>
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ClassAdd;
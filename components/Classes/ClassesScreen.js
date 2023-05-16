import React, { useState, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { doc, setDoc, getDocs, getDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import ModalEdit from '../Modals/ModalEdit'
import ModalDefault from '../Modals/ModalDefault'
import Loading from "../Modals/Loading";

import ClassAdd from "./ClassAdd";

import IconPlus from 'assets/svg/plus'


const ClassesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [modalMore, setModalMore] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    const inputLocation = useRef(null)
    
    const [subjects, setSubjects] = useState([])
    const [className, setClassName] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{marginRight: 10, borderRadius: 100, overflow: 'hidden'}}>
                    <TouchableRipple style={{padding: 5}} onPress={() => setModalMore(true)}>
                        <IconPlus size={30} color={'black'}/>
                    </TouchableRipple>
                </View>
            )
        })
    }, [navigation])
    
    useEffect(() => {
        refresh()
    }, [])
    
    const refresh = async () => {
        setLoading(true)
        try {
            const email = await getUser()
            if (email === null) return alert('Login')
            await getSubjects(email)
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }

    const getUser = async () => {
        let item = await AsyncStorage.getItem('currentUser')
        if (item !== null) {
            let value = JSON.parse(item)
            setCurrentUser(value)
            return value.email
        }
        return null
    }

    const getSubjects = async (email) => {
        const q = query(collection(FIREBASE_DB, 'subjects'), where('createdBy', '==', doc(FIREBASE_DB, 'users', email)));
        const querySnapshot = await getDocs(q);
        var data = [] 
        querySnapshot.forEach(async (doc) => {
            data.push(Object.assign(doc.data(), {id: doc.id}));
            // var data = doc.data()
            // var queryUser = await getDoc(query(data.createdBy))
            // console.log(queryUser.data())
        });
        console.log(data.length)
        setSubjects(data)
    }

    const createClass = async () => {
        if (className.length === 0) return alert('Введите название класса!')
        setLoading(true)
        try {
            await setDoc(
                doc(collection(FIREBASE_DB, 'subjects')),
                {
                    className: className,
                    createdBy: doc(FIREBASE_DB, 'users', currentUser.email),
                    createdAt: new Date()
                }
            );
            setModalAdd(false)
        } catch (e) {
            alert(e);
        }
        setClassName('')
        setLoading(false)
    }


    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <ModalDefault modal={modalMore} setModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableOpacity activeOpacity={0.5} style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); setModalAdd(true)}}
                        >
                            <Text style={StylesTexts.default}> Создать </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); navigation.navigate('ClassAdd')}}
                        >
                            <Text style={StylesTexts.default}> Присоединиться </Text>
                        </TouchableOpacity>
                    </>
                }
            />
            <ModalDefault modal={modalAdd} setModal={() => setModalAdd(false)}
                content={
                    <View style={{gap: 15}}>
                        <TextInput mode="outlined"
                            inputMode="text"
                            label="Название класса"
                            value={className}
                            onChangeText={(v) => setClassName(v)}
                            maxLength={50}
                            style={[StylesTexts.default, {margin: 15}]}
                            theme={StylesPaper.input}
                            right={<TextInput.Affix text={`${className.length}/50`} />}
                            // right={() => (
                            //     <Text style={[StylesTexts.header]}> Создать </Text>
                            // )}
                        />
                        <TouchableRipple onPress={createClass}
                            style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={[StylesTexts.header]}> Создать </Text>
                        </TouchableRipple>
                    </View>
                }
            />
            
            <FlashList
                data={subjects}
                estimatedItemSize={80}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{padding: 30}}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            // onPress={
                            //     () => { navigation.navigate('SubjectScreen', { subjectId: item.id, subjectTitle: item.title }) }
                            // }
                            style={{marginBottom: 30}}
                        >
                            <Text> {item.className} </Text>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default ClassesScreen;
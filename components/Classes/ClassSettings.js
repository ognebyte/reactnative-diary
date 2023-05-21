import React, { useState, useEffect, useContext } from "react";
import { doc, getDocs, collection, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, ScrollView, Switch, Alert } from 'react-native';
import { TextInput, Button, TouchableRipple } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

import NavigationTheme from '../style/navigation';
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import Loading from "../Modals/Loading";

import IconClipboard from 'assets/svg/clipboard'


const ClassSettings = ({ navigation }) => {
    const { contextSubject, updateContextSubject } = useContext(Context);

    const [loading, setLoading] = useState(false)
    const [alertDelete, setAlertDelete] = useState(false)
    const [className, setClassName] = useState(contextSubject.name)
    const [classDescription, setClassDescription] = useState(contextSubject.description)
    const [canJoin, setCanJoin] = useState(contextSubject.canJoin)
    const screenPadding = StylesContainers.screen.padding;

    const saveClass = async () => {
        setLoading(true)
        var value = {
            name: className,
            description: classDescription,
            canJoin: canJoin
        }
        await updateDoc(doc(FIREBASE_DB, 'subjects', contextSubject.id), value);
        updateContextSubject(Object.assign({}, contextSubject, value));
        setLoading(false)
    }

    const deleteClass = async () => {
        setLoading(true)
        try {
            const q = query(collection(FIREBASE_DB, 'members'), where('subjectId', '==', contextSubject.id));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            await deleteDoc(doc(collection(FIREBASE_DB, 'subjects'), contextSubject.id))
            navigation.navigate('ClassesScreen', { update: true })
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <Button mode='contained-tonal'
                style={StylesButtons.buttonFloat}
                buttonColor={StylesButtons.active.backgroundColor}
                onPress={() => saveClass()}
                disabled={className.length === 0}
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
                        label='Название класса'
                        value={className}
                        onChangeText={v => setClassName(v)}
                        maxLength={50}
                        style={[StylesTexts.default]}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        right={<TextInput.Affix text={`${className.length}/50`}/>}
                    />
                    <TextInput mode="outlined"
                        inputMode="text"
                        label={"Описание"}
                        value={classDescription}
                        onChangeText={(v) => setClassDescription(v)}
                        style={[StylesTexts.default]}
                        theme={StylesPaper.input}
                        selectionColor={StylesButtons.activeBack.backgroundColor}
                        multiline={true}
                    />

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                        <Text style={StylesTexts.medium}> Можно присоединиться: </Text>
                        <Switch style={{margin: 0, padding: 0}}
                            trackColor={{false: StylesButtons.inactiveBack.backgroundColor, true: StylesButtons.activeBack.backgroundColor}}
                            thumbColor={canJoin ? StylesButtons.active.backgroundColor : StylesButtons.inactive.backgroundColor}
                            onValueChange={() => setCanJoin(!canJoin)}
                            value={canJoin}
                        />
                    </View>
                    {!canJoin ? null :
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                            <Text style={StylesTexts.medium}> Код класса: </Text>
                            <Button mode='contained-tonal' dark={false} icon={IconClipboard}
                                onPress={() => Clipboard.setString(contextSubject.id)}
                                buttonColor={StylesButtons.active.backgroundColor}
                                labelStyle={StylesTexts.small}
                            >
                                {contextSubject.id}
                            </Button>
                        </View>
                    }
                    <View style={{height: 50, borderRadius: 10, overflow: 'hidden'}}>
                        <TouchableRipple style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => (
                                Alert.alert(
                                    'Удаление класса',
                                    'Вы уверены, что хотите удалить класс?',
                                    [
                                        { text: 'Отмена', style: 'cancel' },
                                        { text: 'Удалить', style: 'destructive', onPress: deleteClass },
                                    ],
                                )
                            )}
                        >
                            <Text style={[StylesTexts.medium, {color: StylesButtons.delete.backgroundColor}]}> Удалить класс </Text>
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ClassSettings;
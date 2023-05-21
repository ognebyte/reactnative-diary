import React, { useState, useContext } from "react";
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import NavigationTheme from '../style/navigation';
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import Loading from "../Modals/Loading";


const ClassAdd = ({ navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser
    } = useContext(Context);
    const [loading, setLoading] = useState(false)
    const [className, setClassName] = useState('')
    const [classDescription, setClassDescription] = useState(null)
    const screenPadding = StylesContainers.screen.padding;

    const createClass = async () => {
        setLoading(true)
        try {
            let currentDate = new Date();
            const subjectRef = await addDoc(
                collection(FIREBASE_DB, 'subjects'), {
                    name: className,
                    description: classDescription,
                    createdBy: contextCurrentUser.email,
                    createdAt: currentDate,
                    canJoin: true
                }
            );
            await addDoc(
                collection(FIREBASE_DB, 'members'), {
                    subjectId: subjectRef.id,
                    userId: contextCurrentUser.email,
                    role: 'admin',
                    joined: currentDate
                }
            );
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
                onPress={createClass}
                disabled={className.length === 0}
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
                </View>
            </ScrollView>
        </View>
    );
};

export default ClassAdd;
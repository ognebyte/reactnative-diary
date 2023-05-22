import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { doc, getDocs, deleteDoc, collection, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'

import { Easing, Text } from 'react-native';

import NavigationTheme from '../style/navigation';
import StylesTexts from '../style/texts';

import Context from 'config/context';
import ClassesScreen from "./ClassesScreen";
import ClassScreen from './ClassScreen'
import ClassSettings from './ClassSettings'
import ClassAdd from './ClassAdd'
import AssignmentAdd from './AssignmentAdd'
import AssignmentScreen from './AssignmentScreen'
import AssignmentSettings from './AssignmentSettings'

const Stack = createStackNavigator();

const ClassesStack = () => {
    const [contextSubject, setContextSubject] = useState({});
    const [contextCurrentUser, setContextCurrentUser] = useState({});

    const updateContextSubject = (value) => setContextSubject(value)
    const updateContextCurrentUser = (value) => setContextCurrentUser(value)

    const checkUserAccess = async () => {
        const membersCollectionRef = collection(FIREBASE_DB, 'members');
        const q = query(membersCollectionRef,
            where('subjectId', '==', contextSubject.id),
            where('userId', '==', contextCurrentUser.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            if (querySnapshot.docs[0].data().role !== 'pupil') return true
        }
        return false
    }

    const clearCollection = async (collectionName) => {
        const q = query(collection(FIREBASE_DB, collectionName), where('subjectId', '==', contextSubject.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    }

    const contextValue = {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess,
        clearCollection
    }

    const transitionSpecConfig = {
        animation: 'timing',
        config: {
            duration: 150,
            easing: Easing.ease,
        },
    };

    return (
        <Context.Provider value={contextValue}>
            <Stack.Navigator screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',

                transitionSpec: {
                    open: transitionSpecConfig,
                    close: transitionSpecConfig,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

                headerStyle: { backgroundColor: NavigationTheme.colors.headerBackground },
            }}>
                <Stack.Screen name="ClassesScreen" component={ClassesScreen} options={{title: 'Классы'}} />
                <Stack.Screen name="ClassAdd" component={ClassAdd} options={{title: 'Создание класса'}} />
                <Stack.Screen name="ClassScreen" component={ClassScreen} options={{title: 'Класс'}} />
                <Stack.Screen name="ClassSettings" component={ClassSettings} options={{title: 'Настройки'}} />
                <Stack.Screen name="AssignmentAdd" component={AssignmentAdd} options={{title: 'Создание задания'}} />
                <Stack.Screen name="AssignmentScreen" component={AssignmentScreen} options={{headerTitleStyle: {display: 'none'}}} />
                <Stack.Screen name="AssignmentSettings" component={AssignmentSettings} options={{headerTitleStyle: {display: 'none'}}} />
            </Stack.Navigator>
        </Context.Provider>
    );
};

export default ClassesStack;
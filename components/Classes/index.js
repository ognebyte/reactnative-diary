import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing, Text } from 'react-native';

import NavigationTheme from '../style/navigation';
import StylesTexts from '../style/texts';

import Context from 'config/context';
import ClassesScreen from "./ClassesScreen";
import ClassScreen from './ClassScreen'
import ClassSettings from './ClassSettings'

const Stack = createStackNavigator();

const ClassesStack = () => {
    const [contextSubject, setContextSubject] = useState({});

    const updateContextSubject = (value) => {
        setContextSubject(value)
    };

    const transitionSpecConfig = {
        animation: 'timing',
        config: {
            duration: 150,
            easing: Easing.ease,
        },
    };

    return (
        <Context.Provider value={{ contextSubject, updateContextSubject }}>
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
                <Stack.Screen name="ClassScreen" component={ClassScreen} options={{title: 'Класс'}} />
                <Stack.Screen name="ClassSettings" component={ClassSettings} options={{title: 'Настройки'}} />
            </Stack.Navigator>
        </Context.Provider>
    );
};

export default ClassesStack;
import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing } from 'react-native';

import NavigationTheme from '../style/navigation';
import StylesTexts from '../style/texts';

import ScheduleScreen from './ScheduleScreen'
import ScheduleAdd from './ScheduleAdd'
import ScheduleEdit from './ScheduleEdit'

const Stack = createStackNavigator();

const ScheduleStack = () => {
    const transitionSpecConfig = {
        animation: 'timing',
        config: {
            duration: 150,
            easing: Easing.ease,
        },
    };

    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            
            transitionSpec: {
                open: transitionSpecConfig,
                close: transitionSpecConfig,
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

            headerStyle: { backgroundColor: NavigationTheme.colors.headerBackground },
        }}>
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{title: 'Расписание'}} />
            <Stack.Screen name="ScheduleAdd" component={ScheduleAdd} options={{title: 'Добавление'}} />
            <Stack.Screen name="ScheduleEdit" component={ScheduleEdit} options={{title: 'Редактирование'}} />
        </Stack.Navigator>
    );
};

export default ScheduleStack;
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing } from 'react-native';

import NavigationTheme from '../style/navigation';

import ScheduleScreen from "./ScheduleScreen";
import DaysScreen from "./DaysScreen";

const Stack = createStackNavigator();

const SubjectStack = () => {
    const transitionSpecConfig = {
        animation: 'timing',
        config: {
            duration: 150,
            easing: Easing.ease,
        },
    };

    return (
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
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{title: 'Расписание'}}/>
            <Stack.Screen name="DaysScreen" component={DaysScreen} options={{title: 'Расписание'}}/>
        </Stack.Navigator>
    );
};

export default SubjectStack;
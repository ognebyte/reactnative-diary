import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing } from 'react-native';

import NavigationTheme from '../style/navigation';

import ClassesScreen from "./ClassesScreen";
import ClassAdd from "./ClassAdd";


const Stack = createStackNavigator();

const ClassesStack = () => {
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
            <Stack.Screen name="ClassesScreen" component={ClassesScreen} options={{title: 'Классы'}} />
            <Stack.Screen name="ClassAdd" component={ClassAdd} options={{title: 'Создание класса'}} />
            {/* <Stack.Screen name="CourseScreen" component={CourseScreen} options={{title: 'Курс'}}  /> */}
        </Stack.Navigator>
    );
};

export default ClassesStack;
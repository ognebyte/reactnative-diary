import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing } from 'react-native';

import NavigationTheme from '../style/navigation';

import SubjectsScreen from "./SubjectsScreen";
import SubjectScreen from "./SubjectScreen";

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
            <Stack.Screen name="SubjectsScreen" component={SubjectsScreen} options={{title: 'Предметы'}}  />
            <Stack.Screen name="SubjectScreen" component={SubjectScreen} options={{title: 'Предмет'}}  />
        </Stack.Navigator>
    );
};

export default SubjectStack;
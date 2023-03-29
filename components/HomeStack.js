import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { Easing } from 'react-native';

import NavigationTheme from './style/navigation';
import StylesTexts from './style/texts';

import HomeScreen from './HomeScreen';
import Notes from './Notes';
import SubjectsStack from './Subjects'

const Stack = createStackNavigator();

const HomeStack = () => {
    
    const transitionSpecConfig = {
        animation: 'timing',
        config: {
            duration: 150,
            easing: Easing.ease,
        },
    };

    return (
        <Stack.Navigator screenOptions={({route}) => ({
            headerShown: route.name != 'SubjectsStack' ? true : false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            
            transitionSpec: {
                open: transitionSpecConfig,
                close: transitionSpecConfig,
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

            headerStyle: { backgroundColor: NavigationTheme.colors.headerBackground },
        })}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{title: 'Главная'}} />
            <Stack.Screen name="Notes" component={Notes} options={{title: 'Заметки'}}  />
            <Stack.Screen name="SubjectsStack" component={SubjectsStack} options={{title: 'Предметы'}}  />
        </Stack.Navigator>
    );
};

export default HomeStack;
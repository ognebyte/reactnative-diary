import React, { useState, useRef, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavigationTheme from '../style/navigation';

import AuthScreen from './AuthScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: NavigationTheme.colors.headerBackground },
        }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{title: 'Профиль'}} />
            <Stack.Screen name="AuthScreen" component={AuthScreen}
                options={{
                    title: 'Авторизация',
                    headerStyle: {backgroundColor: 'transparent'},
                    headerTitleStyle: {display: 'none'},
                }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Easing, View, Dimensions } from 'react-native';

import NavigationTheme from './style/navigation';
import StylesContainers from './style/containers';
import StylesTexts from './style/texts';

import Home from './Home';
import Setting from './Setting';
import Profile from './Profile';
import Calendar from './Calendar';

import IconInbox from '../assets/svg/inbox';
import IconHome from '../assets/svg/home';
import IconCalendar from '../assets/svg/calendar';
import IconWrench from '../assets/svg/wrench';
import IconUser from '../assets/svg/user';

const Tab = createBottomTabNavigator();

const windowHeight = Dimensions.get('window').height;

const App = () => {
    const size = windowHeight / 100 * 5
    const activeTintColor = NavigationTheme.colors.activeColor
    const inactiveTintColor = NavigationTheme.colors.inactiveColor

    const tabBarIconBackgroundAnim = new Animated.Value(1.1)

    const tabBarIconPressed = () => {
        tabBarIconBackgroundAnim.setValue(0)
        Animated.timing(tabBarIconBackgroundAnim, {
            toValue: 1.1,
            duration: 300,
            easing: Easing.elastic(1),
            useNativeDriver: true,
        }).start();
    };

    return (
        <NavigationContainer theme={NavigationTheme}>
            <Tab.Navigator initialRouteName='Main'
                screenListeners={{tabPress: tabBarIconPressed}}
                screenOptions={({route}) => ({
                    tabBarHideOnKeyboard: true,
                    headerShown: route.name != 'Home' ? true : false,
                    headerStyle: { backgroundColor: NavigationTheme.colors.headerBackground },
                    tabBarActiveTintColor: activeTintColor,
                    tabBarInactiveTintColor: inactiveTintColor,
                    tabBarShowLabel: false,
                    tabBarStyle: { height: '8%', overflow: 'hidden' },
                    tabBarBadgeStyle: { maxWidth: 40, minWidth: 'auto', height: 'auto' },
                    tabBarItemStyle: { flexDirection: 'column', justifyContent: 'center' },
                    tabBarIconStyle: { width: '100%', margin: 0 },
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <View style={[StylesContainers.default, StylesContainers.fill]}>
                                {
                                    focused ?
                                        <Animated.View style={[
                                            StylesContainers.default,
                                            {position: 'absolute'},
                                            NavigationTheme.tabBarIconBackground,
                                            { width: size, height: size, transform: [{ scale: tabBarIconBackgroundAnim }] }
                                        ]}/>
                                        : null
                                }
                                <View style={[StylesContainers.default, StylesContainers.fill]}>
                                    {
                                        route.name == 'Home' ?
                                        <IconHome size={size} color={color}/>
                                        // : (route.name == 'Notification') ?
                                        // <IconInbox size={size} color={color}/>
                                        : (route.name == 'Calendar') ?
                                        <IconCalendar size={size} color={color}/>
                                        : (route.name == 'Setting') ?
                                        <IconWrench size={size} color={color}/>
                                        : (route.name == 'Profile') ?
                                        <IconUser size={size} color={color}/>
                                        : "null"
                                    }
                                </View>
                            </View>
                        )
                    },
                })}
            >

                <Tab.Screen name='Home'
                    children={() => <Home />}
                />

                {/* <Tab.Screen name='Notification'
                    children={() => <Notification removeBarBadge={removeBarBadge}/>}
                    options={{ tabBarBadge: likeCount > 0 ? likeCount : null, }}
                /> */}
                
                <Tab.Screen name='Calendar' options={{title: 'Календарь'}}
                    children={() => <Calendar />}
                />
                
                <Tab.Screen name='Setting' options={{title: 'Настройки'}}
                    children={() => <Setting />}
                />
                <Tab.Screen name='Profile' options={{title: 'Профиль'}}
                    children={() => <Profile />}
                />

            </Tab.Navigator> 
        </NavigationContainer>
    );
};

export default App;
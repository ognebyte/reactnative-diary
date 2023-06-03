import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Easing, View, Dimensions } from 'react-native';

import NavigationTheme from './style/navigation';
import StylesContainers from './style/containers';

import Home from './Home';
import Classes from './Classes';
import Calendar from './Calendar';

import IconHome from 'assets/svg/home';
import IconCalendar from 'assets/svg/calendar';
import IconStudent from 'assets/svg/student';

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
                                    !focused ? null
                                    :
                                    <Animated.View style={[
                                        StylesContainers.default,
                                        { position: 'absolute' },
                                        NavigationTheme.tabBarIconBackground,
                                        { width: size, height: size, transform: [{ scale: tabBarIconBackgroundAnim }] }
                                    ]}/>
                                }
                                <View style={[StylesContainers.default, StylesContainers.fill]}>
                                    {
                                        route.name == 'Home' ?
                                        <IconHome size={size} color={color}/>
                                        : (route.name == 'Calendar') ?
                                        <IconCalendar size={size} color={color}/>
                                        : (route.name == 'Classes') ?
                                        <IconStudent size={size} color={color}/>
                                        : null
                                    }
                                </View>
                            </View>
                        )
                    },
                })}
            >

                <Tab.Screen name='Home' options={{headerShown: false}}
                    children={() => <Home />}
                />
                
                <Tab.Screen name='Calendar' options={{title: 'Календарь'}}
                    children={() => <Calendar />}
                />
                
                <Tab.Screen name='Classes' options={{title: 'Класс', headerShown: false}}
                    children={() => <Classes />}
                />
            </Tab.Navigator> 
        </NavigationContainer>
    );
};

export default App;
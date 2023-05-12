import { useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite'
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Modal from "react-native-modal";

import StylesNavigation from '../style/navigation'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import DaysItem from './DaysItem';

import MoreVertical from '../../assets/svg/more-vertical'

const DaysScreen = ({ route, navigation }) => {
    const scheduleId = route.params.id
    const scheduleTitle = route.params.title
    const scheduleSaturday = route.params.saturday

    const [screens, setScreens] = useState({
        index: 0,
        routes: [
            { key: 'monday', title: 'П' },
            { key: 'tuesday', title: 'В' },
            { key: 'wednesday', title: 'С' },
            { key: 'thursday', title: 'Ч' },
            { key: 'friday', title: 'П' },
        ],
    });

    useEffect(() => {
        var screen = {...screens}
        if (scheduleSaturday) screen.routes.push({ key: 'saturday', title: 'С' })
        setScreens(screen)
        navigation.setOptions({
            headerTitle: scheduleTitle,
        });
    }, [])

    // const getAllSchedule = () => {
    //     setSchedule([])
    //     db.transaction(tx =>
    //         tx.executeSql(`SELECT * FROM ${table} ORDER BY id DESC`, [],
    //             (_, res) => setSchedule(res.rows._array),
    //             (_, error) => console.log(error)
    //         )
    //     )
    // }

    return (
        <View style={{flex: 1}}>
            <TabView
                navigationState={screens}
                onIndexChange={index => screens.index = index}
                renderScene={({route}) => <DaysItem route={route} scheduleId={scheduleId}/>}

                initialLayout={{width: Dimensions.get('window').width}}
                renderTabBar={(props) => (
                    <TabBar {...props}
                        style={{
                            flexDirection: 'column',
                            backgroundColor: StylesNavigation.colors.headerBackground,
                        }}
                        indicatorStyle={{backgroundColor: '#6E7AFF'}}
                        pressColor='#00000010'
                        activeColor={StylesButtons.active.backgroundColor}
                        inactiveColor={StylesButtons.inactiveBack.backgroundColor}
    
                        renderLabel={({ route, focused, color }) => (
                            <View style={[Styles.tabLabel, {backgroundColor: focused ? '#6E7AFF' : '#E8E8E8'}]}>
                                <Text style={[StylesTexts.default, {color: color}]}>
                                    {route.title}
                                </Text>
                            </View>
                        )}
                    />
                )}
            />
        </View>
    );
};

export default DaysScreen;
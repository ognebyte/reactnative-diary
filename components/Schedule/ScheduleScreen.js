import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, View, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { IconButton, TouchableRipple, Checkbox } from 'react-native-paper';

import StylesNavigation from '../style/navigation'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import ModalDefault from '../Modals/ModalDefault'
import Week from './Week';

import MoreVertical from 'assets/svg/more-vertical'


const ScheduleScreen = ({ navigation }) => {
    const weeks = [
        { key: '1', title: 'П' },
        { key: '2', title: 'В' },
        { key: '3', title: 'С' },
        { key: '4', title: 'Ч' },
        { key: '5', title: 'П' },
    ]
    const [screens, setScreens] = useState({ index: 0, routes: weeks });
    const [modalMore, setModalMore] = useState(false)
    const [isWeeksWithSaturday, setIsWeeksWithSaturday] = useState(true)

    useEffect(() => {
        getAsyncStorageWeeks()
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon={MoreVertical} onPress={async () => setModalMore(true)}/>
            )
        });
    }, [])

    useEffect(() => {
        var screen = weeks
        if (isWeeksWithSaturday) screen.push({ key: '6', title: 'С' })
        setScreens({...screens, routes: screen})
    }, [isWeeksWithSaturday])
    
    const getAsyncStorageWeeks = async () => {
        try {
            let value = await AsyncStorage.getItem('weeksWithSaturday')
            if (value === null) {
                await AsyncStorage.setItem('weeksWithSaturday', 'true')
            } else {
                if (value === 'false') setIsWeeksWithSaturday(false)
            }
        } catch (error) {
            alert(error);
        }
    }

    const setAsyncStorageWeeks = async () => {
        try {
            if (!isWeeksWithSaturday) await AsyncStorage.setItem('weeksWithSaturday', 'true')
            else await AsyncStorage.setItem('weeksWithSaturday', 'false')
            setIsWeeksWithSaturday(!isWeeksWithSaturday)
        } catch (error) {
            alert(error);
        }
    }
    
    return (
        <View style={{flex: 1}}>
            <ModalDefault modal={modalMore} hideModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableRipple style={StylesContainers.modalButton}
                            onPress={() => setAsyncStorageWeeks()}
                        >
                            <View style={StylesContainers.modalButtonWithIcon}>
                                <Checkbox status={isWeeksWithSaturday ? 'checked' : 'unchecked'}/>
                                <Text style={StylesTexts.default}> 6 дней в неделе </Text>
                            </View>
                        </TouchableRipple>
                    </>
                }
            />
            <TabView
                navigationState={screens}
                onIndexChange={index => screens.index = index}
                renderScene={({route}) => <Week route={route} navigate={(v, p) => navigation.navigate(v, {week: route, props: p})}/>}

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

export default ScheduleScreen;
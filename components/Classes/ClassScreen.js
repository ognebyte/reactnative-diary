import React, { useEffect, useState, useMemo, useContext } from "react";
import { View, Dimensions } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from 'config/firebase'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { IconButton } from 'react-native-paper';

import StylesNavigation from '../style/navigation'
import StylesContainers from '../style/containers'
import StylesTexts from '../style/texts'

import Context from 'config/context';
import Loading from '../Modals/Loading'
import AssignmentsScreen from './AssignmentsScreen'
import MembersScreen from './MembersScreen'

import IconSettings from 'assets/svg/settings'
import IconRefresh from 'assets/svg/refresh'


const ClassScreen = ({ navigation }) => {
    const { contextSubject, updateContextSubject } = useContext(Context);

    const [loading, setLoading] = useState(false)

    const screens = {
        index: 0,
        routes: [
            { key: 'first', title: ' Задачи ' },
            { key: 'second', title: ' Участники ' },
        ],
    };

    useEffect(() => {
        navigation.setOptions({
            title: contextSubject.name,
        })
    }, [contextSubject])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                    {contextSubject.role !== 'admin' ? null :
                        <IconButton icon={IconSettings}
                            onPress={() => navigation.navigate('ClassSettings')}
                        />
                    }
                    <IconButton icon={IconRefresh}
                        onPress={refresh}
                    />
                </View>
            )
        })
    }, [])

    const refresh = async () => {
        setLoading(true)
        const docSnap = await getDoc(doc(FIREBASE_DB, 'subjects', contextSubject.id))
        var docData = Object.assign({}, contextSubject, docSnap.data())
        updateContextSubject(docData)
        setLoading(false)
    }

    const navigate = (screen, params) => {
        navigation.navigate(screen, params);
    }


    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <TabView
                swipeEnabled={true}
                navigationState={screens}
                renderScene={useMemo(
                    () =>
                        SceneMap({
                            first: () => <AssignmentsScreen navigate={navigate}/>,
                            second: () => <MembersScreen/>,
                        })
                    , [])
                }
                initialLayout={{ width: Dimensions.get('window').width }}
                onIndexChange={ index => screens.index = index }
                renderTabBar={ props =>
                    <TabBar {...props}
                        style={{
                            flexDirection: 'column',
                            backgroundColor: StylesNavigation.colors.headerBackground,
                        }}
                        activeColor={'#6E7AFF'}
                        inactiveColor={StylesNavigation.colors.inactiveColor}
                        pressColor={'#00000020'}
                        indicatorStyle={{backgroundColor: '#6E7AFF'}}
                    />
                }
            />
        </View>
    );
};

export default ClassScreen;
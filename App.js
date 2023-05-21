import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import MainTab from './components/MainTab'
import NavigationTheme from './components/style/navigation'
import Sqlite from './config/sqlite';

/*
    for build apk:
    eas build -p android --profile preview
*/

const App = () => {

    useEffect(
        () => {
            Sqlite()
        }
    , [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: NavigationTheme.colors.card }}>
            <StatusBar
                backgroundColor={NavigationTheme.colors.card}
                barStyle={NavigationTheme.dark ? 'light-content' : 'dark-content'}
            />
            <GestureHandlerRootView style={{flex: 1}}>
                <PaperProvider>
                    <MainTab/>
                </PaperProvider>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default App;
import React from "react";
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

import NavigationTheme from './style/navigation'
import StylesContainers from './style/containers'
import StylesButtons from './style/buttons'
import StylesTexts from './style/texts'

import Psycho from '../assets/img/psycho.png'

const windowDimensions = Dimensions.get('window');
const windowHeight = windowDimensions.height

const HomeRoute = ({ navigation }) => {

    return (
        <ScrollView>
            <View style={StylesContainers.default}>
                <ImageBackground source={Psycho} style={styles.background}>
                </ImageBackground>
                <View style={[styles.content]}>
                    <View style={{gap: 20}}>

                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault]}
                            onPress={() => navigation.navigate("Notes")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Заметки </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={[StylesButtons.default, StylesButtons.buttonsDefault]}
                            onPress={() => navigation.navigate("SubjectsStack")}
                        >
                            <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Предметы </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeRoute;

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        width: '100%',
        height: windowHeight / 100 * 15,
    },
    content: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
        paddingTop: 30,
        marginTop: windowHeight / 100 * 12,
        gap: 40,
        backgroundColor: NavigationTheme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
})
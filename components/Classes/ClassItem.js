import React from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { IconButton } from 'react-native-paper';

import StylesPaper from '../style/paper'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import IconMore from 'assets/svg/more-vertical'


const ClassesItem = ({ item }) => {
    const subject = item.subject
    const user = item.user

    return (
        <View style={Styles.classItem}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={StylesTexts.big}>
                    {subject.name}
                </Text>
                <Text style={StylesTexts.small}> {user.firstname} {user.lastname} </Text>
            </View>
            <View style={{}}>
                <IconButton icon={IconMore} size={22} iconColor="black"
                    style={{margin: 0, marginRight: -5}}
                    onPress={() => console.log('more')}
                />
            </View>
        </View>
    );
};

export default ClassesItem;
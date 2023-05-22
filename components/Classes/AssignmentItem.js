import React, {useEffect} from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import { IconButton } from 'react-native-paper';
import moment from 'moment';

import StylesPaper from '../style/paper'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import Styles from './styles'

import IconMore from 'assets/svg/more-vertical'


const AssignmentItem = ({ item }) => {

    return (
        <View style={Styles.assignmentItem}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={StylesTexts.big}>
                    {item.title}
                </Text>
                <Text style={StylesTexts.small}>
                    {item.dueDate ?
                    `Срок сдачи: ${moment(item.dueDate).format('DD MMMM')}`
                    :
                    `Создан: ${moment(item.createdAt).format('DD MMMM')}`
                    }
                </Text>
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

export default AssignmentItem;
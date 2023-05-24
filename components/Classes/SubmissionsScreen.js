import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { doc, addDoc, getDocs, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, FAB } from 'react-native-paper';
import moment from 'moment';

import Colors from '../style/colors'
import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'
import Styles from './styles'

import Context from 'config/context';
import Loading from "../Modals/Loading";


const SubmissionsScreen = ({ navigation }) => {
    const {
        contextSubject,
        updateContextSubject,
        contextCurrentUser,
        updateContextCurrentUser,
        checkUserAccess,
        clearCollection,
        contextAssignment,
        updateContextAssignment,
        contextSubmissions,
        updateContextSubmissions,
    } = useContext(Context);
    const [loading, setLoading] = useState(false)

    const convertToTime = (value) => {
        if (value === null) return null
        return ((value.seconds * 1000) + (value.nanoseconds / 1000000))
    };

    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <FlashList
                data={contextSubmissions}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={loading} enabled={false}/>}
                estimatedItemSize={115}
                contentContainerStyle={StylesContainers.contentContainerStyle}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            onPress={() => navigation.navigate('SubmissionGrade', { submission: item })}
                            style={Styles.submissionsItemContainer}
                        >
                            <View style={Styles.submissionsItem}>
                                <Text style={[StylesTexts.default, {flex: 1}]} numberOfLines={1}>
                                    {item.firstname} {item.lastname}
                                </Text>
                                {
                                    !contextAssignment.dueDate ? 
                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>
                                        {moment(convertToTime(item.submittedAt)).format('DD MMMM, HH:mm')}
                                    </Text>
                                    : moment(convertToTime(item.submittedAt)).isBefore(moment(contextAssignment.dueDate)) ?
                                    <Text style={[StylesTexts.small, {color: Colors.darkFade}]}>
                                        Сдано заранее: {moment(convertToTime(item.submittedAt)).format('DD MMMM, HH:mm')}
                                    </Text>
                                    :
                                    <Text style={[StylesTexts.small, {color: Colors.alarm}]}>
                                        Сдано с опозданием: {moment(convertToTime(item.submittedAt)).format('DD MMMM, HH:mm')}
                                    </Text>
                                }
                            </View>
                            <View style={Styles.gradeButton}>
                                { !item.gradedBy ? 
                                    <Text style={StylesTexts.small}>
                                        Не оценено
                                    </Text>
                                    :
                                    item.point === null ?
                                    <Text style={StylesTexts.small}>
                                        Принято
                                    </Text>
                                    :
                                    <Text style={StylesTexts.small}>
                                        Оценка: <Text style={StylesTexts.medium}>{item.point}</Text>
                                        {contextAssignment.maxPoints ? ` из ${contextAssignment.maxPoints}` : null}
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default SubmissionsScreen;
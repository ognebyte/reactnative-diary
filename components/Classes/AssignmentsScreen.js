import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { doc, addDoc, getDocs, getDoc, collection, query, where, disableNetwork, enableNetwork } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, FAB } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import AssignmentItem from "./AssignmentItem";
import ModalDefault from '../Modals/ModalDefault'
import ModalScreen from '../Modals/ModalScreen'
import Loading from "../Modals/Loading";

import IconMore from 'assets/svg/more-vertical'
import IconPlus from 'assets/svg/plus'


const AssignmentsScreen = ({ navigate }) => {
    const navigation = useNavigation();
    const { contextSubject } = useContext(Context);

    const [loading, setLoading] = useState(false)
    
    const [assignments, setAssignments] = useState([])
    
    useEffect(() => {
        refresh()
    }, [])
    
    const refresh = async () => {
        setLoading(true)
        try {
            await getAssignments()
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }
    
    const getAssignments = async () => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'assignments'),
            where('subjectId', '==', contextSubject.id)
        ));
        const data = [];
        querySnapshot.forEach(doc => {
            data.push(Object.assign(doc.data(), {id: doc.id}));
        });
        setAssignments(data)
    }


    return (
        <View style={{flex: 1}}>
            {
                contextSubject.role == 'pupil' ? null :
                <FAB icon={IconPlus}
                    size='medium'
                    color='black'
                    style={[StylesButtons.active, StylesButtons.buttonFloat]}
                    onPress={() => navigation.navigate('AssignmentAdd')}
                />
            }
            <FlashList
                data={assignments}
                keyExtractor={(item) => item.id}
                estimatedItemSize={80}
                contentContainerStyle={StylesContainers.screen}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={1}
                            onPress={
                                () => navigate('AssignmentScreen', { assignment: item })
                            }
                            style={{marginBottom: 30}}
                        >
                            <AssignmentItem item={item}/>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default AssignmentsScreen;
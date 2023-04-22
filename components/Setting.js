import React, { useState, useMemo } from 'react';
import * as SQLite from 'expo-sqlite'
import { View, Text, TouchableOpacity, Button } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import StylesContainers from './style/containers';
import StylesButtons from './style/buttons';
import StylesTexts from './style/texts';

const Setting = () => {
    const [showAlertDropTable, setShowAlertDropTable] = useState(false)
    const db = SQLite.openDatabase('diary.db')
    const tableNotes = 'notes'
    const tableSubjects = 'subjects'
    const tableSubject = 'subject'
    const tableUsers = 'users'
    
    // const [count, setCount] = useState(0)
    // const [count2, setCount2] = useState(0)

    // useMemo(
    //     () => {
    //         console.log('useMemo', count)
    //         let i = 100000000
    //         console.log(i)
    //         while(i >= 0) {
    //             i-=1
    //         }
    //         console.log(i)
    //     }, [count]
    // )

    const getTable = (t) => {
        db.transaction(tx =>
            tx.executeSql(`SELECT * FROM ${t} ORDER BY id`, [],
                (_, res) => {
                    console.log(t)
                    for (let i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i))
                    }
                },
                (_, error) => console.log(error)
            )
        );
    }

    const dropTable = (t) => {
        db.transaction(tx =>
            tx.executeSql(`DROP TABLE ${t}`, [],
                (_, res) => { alert(`${t} dropped`) }
            )
        )
    }

    return (
        <View style={[StylesContainers.default, StylesContainers.screen, {gap: 50}]}>
            {/* <View style={{alignItems: 'center', gap: 20}}>
                <View style={{flexDirection: 'row', gap: 10}}>
                    <Text> {count} с мемо </Text>
                    <Button title='-' onPress={() => setCount(count-1)}/>
                    <Button title='+' onPress={() => setCount(count+1)}/>
                </View>
                <View style={{flexDirection: 'row', gap: 10}}>
                <Text> {count2} без мемо </Text>
                    <Button title='-' onPress={() => setCount2(count2-1)}/>
                    <Button title='+' onPress={() => setCount2(count2+1)}/>
                </View>
            </View> */}
            
            <View style={{alignItems: 'center', gap: 20}}>
                
                {/* SELECT TABLE */}
                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => getTable(tableNotes)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Get table notes </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => getTable(tableSubjects)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Get table subjects </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => getTable(tableSubject)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Get table subject </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => getTable(tableUsers)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Get table users </Text>
                </TouchableOpacity>

                {/* DROP TABLE */}
                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => setShowAlertDropTable(true)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Drop table notes </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => dropTable(tableSubjects)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Drop table subjects </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => dropTable(tableSubject)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Drop table subject </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => dropTable(tableUsers)}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Drop table users </Text>
                </TouchableOpacity>

            </View>

            <AwesomeAlert
                show={showAlertDropTable}
                title=" Внимание "
                message=" Вы уверены что хотите удалить все данные? "
                cancelText=" Нет "
                confirmText=" Да "
                confirmButtonTextStyle={{color: '#000000'}}
                cancelButtonStyle={{width: 50, alignItems: 'center'}}
                confirmButtonStyle={{width: 50, alignItems: 'center'}}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                confirmButtonColor={StylesButtons.delete.backgroundColor}
                onCancelPressed={() => {
                    setShowAlertDropTable(false)
                }}
                onConfirmPressed={() => {
                    dropTable(tableNotes)
                    setShowAlertDropTable(false)
                }}
            />
        </View>
    );
};
    
export default Setting;

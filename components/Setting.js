import React, { useState, useMemo } from 'react';
import * as SQLite from 'expo-sqlite'
import { View, Text, TouchableOpacity, Button } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import StylesContainers from './style/containers';
import StylesButtons from './style/buttons';
import StylesTexts from './style/texts';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { Platform } from 'react-native';

const Setting = () => {
    const [showAlertDropTable, setShowAlertDropTable] = useState(false)
    const [db, setDb] = useState(SQLite.openDatabase('diary.db'))
    const tableNotes = 'notes'
    const tableSubjects = 'subjects'
    const tableSubject = 'subject'
    const tableUsers = 'users'
    
    const exportDb = async () => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(
                    FileSystem.documentDirectory + 'SQLite/diary.db',
                    {
                        encoding: FileSystem.EncodingType.Base64
                    }
                );
        
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'diary.db', 'application/octet-stream')
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, base64, { encoding : FileSystem.EncodingType.Base64 });
                })
                .catch((e) => console.log(e));
            } else {
                console.log("Permission not granted");
            }
        } else {
            await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/diary.db');
        }
    }

    const importDb = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true
        });
      
        if (result.type === 'success') {
            
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            }
        
            const base64 = await FileSystem.readAsStringAsync(
                result.uri,
                {
                    encoding: FileSystem.EncodingType.Base64
                }
            );
        
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'SQLite/diary.db', base64, { encoding: FileSystem.EncodingType.Base64 });
            await db.closeAsync();
            setDb(SQLite.openDatabase('diary.db'));
        }
    }

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
            <View style={{alignItems: 'center', gap: 20}}>
                
                {/* SELECT TABLE */}
                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => exportDb()}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Export DB </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                    onPress={() => importDb()}
                >
                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Import DB </Text>
                </TouchableOpacity>

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

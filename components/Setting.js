import React, { useState, useMemo } from 'react';
import * as SQLite from 'expo-sqlite'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import StylesContainers from './style/containers';
import StylesButtons from './style/buttons';
import StylesTexts from './style/texts';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { Platform } from 'react-native';

const Setting = () => {
    const [db, setDb] = useState(SQLite.openDatabase('diary.db'))
    const tables = ['notes', 'subjects', 'assignments', 'schedule', 'days']
    
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
                    console.log()
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
        <View style={[StylesContainers.default]}>
            <ScrollView style={[{width: '100%'}]} contentContainerStyle={{alignItems: 'center'}}>
                <View style={{gap: 20, padding: 30}}>
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


                    {/* SELECT TABLE */}
                    {
                        tables.map(
                                (name, i) => (
                                    <TouchableOpacity key={i}
                                        style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                                        onPress={() => getTable(name)}
                                    >
                                        <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Get table {name} </Text>
                                    </TouchableOpacity>
                                )
                        )
                    }
                    

                    {/* DROP TABLE */}
                    {
                        tables.map(
                            (name, i) => (
                                <TouchableOpacity key={i}
                                    style={[StylesButtons.default, StylesButtons.buttonsDefault, {backgroundColor: '#000000'}]}
                                    onPress={() => dropTable(name)}
                                >
                                    <Text style={[StylesTexts.default, StylesTexts.lightColor]}> Drop table {name} </Text>
                                </TouchableOpacity>
                            )
                        )

                    }
                </View>
            </ScrollView>
        </View>
    );
};
    
export default Setting;

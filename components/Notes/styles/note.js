import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    note: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        padding: 10,
        gap: 10,
        backgroundColor: '#E0E2FF',
    },
    noteContainer: {
        width: '100%',
        borderRadius: 10,
        // shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 6,
        // elevation: 6, // shadow for android
        overflow: 'hidden',
    },
    noteSwipe: { justifyContent: 'center', width: '30%', paddingHorizontal: 10 },
    textField: { color: '#00000080' },
    editField: { padding: 30, color: '#000000', }
});
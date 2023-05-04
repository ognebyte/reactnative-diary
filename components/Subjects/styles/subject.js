import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    subjectContainer: {
        width: '100%',
        borderRadius: 10,
        // shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 6,
        // elevation: 6, // shadow for android
        overflow: 'hidden',
    },
    subject: {
        width: '100%',
        justifyContent: 'center',
        padding: 15,
        gap: 15,
        backgroundColor: '#ffffff',
    },
    subjectSwipe: { justifyContent: 'center', alignItems: 'center', width: '30%', paddingHorizontal: 10 },
    textField: { color: '#00000080' },
    taskUnCheck: { borderColor: '#B3B3B3', borderWidth: 2, borderRadius: 5 },
    taskCheck: { borderRadius: 5 },
    
});
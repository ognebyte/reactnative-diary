import { StyleSheet } from 'react-native';
import Colors from '../../style/colors'

export default StyleSheet.create({
    subjectContainer: {
        width: '100%',
        borderTopWidth: 1, borderBottomWidth: 1,
        borderColor: Colors.grey,
        overflow: 'hidden',
    },
    subject: {
        width: '100%',
        padding: 20,
        paddingHorizontal: 15,
        gap: 15,
        backgroundColor: '#ffffff',
    },
    subjectSwipe: { justifyContent: 'center', alignItems: 'center', width: '25%', paddingHorizontal: 10 },
    textField: { color: '#00000080' },
    taskUnCheck: { borderColor: '#B3B3B3', borderWidth: 2, borderRadius: 5 },
    taskCheck: { borderRadius: 5 },
    
});
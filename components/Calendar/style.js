import { StyleSheet } from 'react-native';
import Colors from '../style/colors';

export default StyleSheet.create({
    dayContainer: {
        width: '100%', overflow: 'hidden',
        borderTopWidth: 1, borderBottomWidth: 1,
        borderColor: Colors.grey
    },
    day: {
        width: '100%', flexDirection: 'row', alignItems: 'center',
        height: 85, padding: 15,
        backgroundColor: '#ffffff',
        gap: 15
    },
    subjectSwipe: { justifyContent: 'center', alignItems: 'center', width: '30%', paddingHorizontal: 10 },

    taskUnCheck: { borderColor: '#B3B3B3', borderWidth: 2, borderRadius: 5 },
    taskCheck: { borderRadius: 5 },

});
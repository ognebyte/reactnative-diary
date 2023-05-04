import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    dayContainer: {
        width: '100%', borderRadius: 10, overflow: 'hidden'
    },
    day: {
        width: '100%', flexDirection: 'row', alignItems: 'center',
        height: 80, padding: 15,
        backgroundColor: '#ffffff',
        gap: 15
    },
    subjectSwipe: { justifyContent: 'center', alignItems: 'center', width: '30%', paddingHorizontal: 10 },

    taskUnCheck: { borderColor: '#B3B3B3', borderWidth: 2, borderRadius: 5 },
    taskCheck: { borderRadius: 5 },

});
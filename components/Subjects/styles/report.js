import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    reportRow: {    
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 30,
    },
    square: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        overflow: 'hidden'
    },
    textBig: {
        fontSize: 36,
    },
    textSmall: {
        fontSize: 18,
        color: '#B3B3B3'
    }
});
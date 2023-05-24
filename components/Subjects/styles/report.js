import { StyleSheet } from 'react-native';
import Colors from '../../style/colors'

export default StyleSheet.create({
    reportRow: {    
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 15,
        backgroundColor: Colors.light,
        elevation: 2,
        borderBottomWidth: 1,
        borderColor: Colors.grey,
    },
    count: {
        alignItems: 'center',
    },
    textBig: {
        fontSize: 36,
    },
    textSmall: {
        fontSize: 18,
        color: '#B3B3B3'
    }
});
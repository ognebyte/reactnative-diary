import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    dayContainer: {
        width: '100%', height: 80,
        flexDirection: 'row', alignItems: 'center',
        gap: 15,
        marginBottom: 30,
    },
    day: {
        flex: 1, height: '100%',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
    },

});
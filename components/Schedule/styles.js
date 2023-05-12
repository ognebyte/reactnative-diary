import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tabLabel: {
        justifyContent: 'center', alignItems: 'center',
        width: 30, height: 30, marginVertical: 4,
        borderRadius: 100
    },
    weekItem: {
        height: 80, width: '100%',
        borderWidth: 1.6, borderRadius: 10, backgroundColor: '#ffffff'
    },
    animatedViewContainer: {
        width: '100%',
        borderRadius: 10,
        // shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 6,
        // elevation: 6, // shadow for android
        overflow: 'hidden',
    },
    animatedView: {
        width: '100%',
        justifyContent: 'center',
        padding: 15,
        gap: 15,
        backgroundColor: '#ffffff',
    },
    swipe: { justifyContent: 'center', alignItems: 'center', width: '30%', paddingHorizontal: 10 },
    textField: { color: '#00000080' },
    taskUnCheck: { borderColor: '#B3B3B3', borderWidth: 2, borderRadius: 5 },
    taskCheck: { borderRadius: 5 },
});


import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    default: { alignItems: 'center', justifyContent: 'center', flex: 1, },
    screen: { padding: 30 },
    fill: { width: '100%', height: '100%' },
    modalContainer: { flex: 1 },
    modal: {
        margin: 30,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        overflow: 'hidden'
    },
    modalHandle: {
        alignSelf: 'center',
        width: 50, height: 5,
        margin: 10,
        backgroundColor: '#B3B3B3', borderRadius: 10
    },
    modalButton: {
        height: 60,
        justifyContent: 'center',
        paddingLeft: 20
    },
    rowSpace: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    column: {flexDirection: 'column', gap: 10},
    alert: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#ffffff90',
        borderRadius: 10,
    },
    photoContainer: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 100, backgroundColor: 'white',
    }
});
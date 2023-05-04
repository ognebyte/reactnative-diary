import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    default: { alignItems: 'center', justifyContent: 'center', flex: 1, },
    screen: { padding: 30 },
    fill: { width: '100%', height: '100%' },
    modalContainer: { flex: 1 },
    modal: {
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingBottom: 30,
        paddingTop: 30,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    rowSpace: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    column: {flexDirection: 'column', gap: 10},
    alert: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#ffffff90',
        borderRadius: 10,
    }
});
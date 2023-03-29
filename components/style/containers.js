import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    default: { alignItems: 'center', justifyContent: 'center', flex: 1, },
    screen: { padding: 30 },
    fill: { width: '100%', height: '100%' },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { marginTop: 'auto' },
    modal: {
        justifyContent: 'space-between',
        padding: 30,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    rowSpace: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    column: {flexDirection: 'column', gap: 10},
    alert: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff90',
        borderRadius: 10,
    }
});
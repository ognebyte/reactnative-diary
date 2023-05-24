import { StyleSheet } from 'react-native';
import Colors from './colors'

export default StyleSheet.create({
    default: { alignItems: 'center', justifyContent: 'center', flex: 1, },
    screen: { padding: 15 },
    fill: { width: '100%', height: '100%' },
    modalContainer: { flex: 1 },
    modal: {
        margin: 15,
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
    modalButtonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    rowSpace: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    column: {flexDirection: 'column', gap: 10},
    alert: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: Colors.grey,
        borderRadius: 10,
        elevation: 2,
    },
    photoContainer: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 100, backgroundColor: 'white',
    },
    scrollViewContainer: {
        paddingTop: 15, paddingBottom: 100
    },
    contentContainerStyle: {
        padding: 15, paddingBottom: 100
    },
    flashListItemContainer: {
        marginBottom: 30
    },
    verticalSeparator: {
        width: 2, height: '100%',
        borderRadius: 10,
        backgroundColor: Colors.darkFade
    },
});
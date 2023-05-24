import { StyleSheet } from 'react-native';
import Colors from './colors';

export default StyleSheet.create({
    default: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonSquare: {
        width: 50,
        height: 50,
    },
    buttonsDefault: {
        width: 200,
        height: 50,
    },
    buttonFooter: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 20,
        width: '100%',
        zIndex: 10,
    },
    addButton: {
        alignItems: 'center',
        width: '50%',
        padding: 10,
        borderRadius: 10,
        // shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 6,
        // elevation: 6, // shadow for android
        backgroundColor: '#fff',
    },
    bottom: { height: 45 },
    buttonFloat: {
        position: 'absolute',
        right: 0, bottom: 0,
        margin: 30,
        borderRadius: 100,
        zIndex: 1000,
    },
    buttonFloatTopRight: {
        position: 'absolute',
        right: 0, top: 0,
        marginTop: -5,
        marginRight: -5,
        zIndex: 1
    },
    
    delete: { backgroundColor: Colors.alarm },
    accept: { backgroundColor: Colors.accept },
    cancel: { backgroundColor: Colors.cancel },
    edit: { backgroundColor: Colors.edit },

    inactiveBack: { backgroundColor: '#B3B3B3' },
    activeBack: { backgroundColor: '#A2A2D0' },
    inactive: { backgroundColor: '#F0F0F0' },
    active: { backgroundColor: '#E6E6FA' },
});
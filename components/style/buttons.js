import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    default: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
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
    
    edit: { backgroundColor: '#E0E2FF' },
    delete: { backgroundColor: '#FF9898' },
    cancel: { backgroundColor: '#00000075' },
    accept: { backgroundColor: '#88F799' },
    inactiveBack: { backgroundColor: '#B3B3B3' },
    activeBack: { backgroundColor: '#A2A2D0' },
    inactive: { backgroundColor: '#F0F0F0' },
    active: { backgroundColor: '#E6E6FA' },
});
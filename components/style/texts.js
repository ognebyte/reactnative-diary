import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    default: {
        fontSize: 18,
        fontWeight: '600',
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
    },
    big: {
        fontSize: 26,
        fontWeight: '600',
    },
    small: {
        fontSize: 14,
        fontWeight: '400',
    },
    lightColor: { color: "#ffffff" },
    linkColor: { color: '#6E7AFF' },
    fadeColor: { color: "#00000080" },
    placeholder: { color: "#B3B3B3" },
    
    input: {
        color: '#000000',
        minHeight: 45,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#F0F0F0',
        borderRadius: 10
    },
    inputMulti: { textAlignVertical: 'top' },
    borderBottom: {
        width: '100%',
        borderBottomWidth: 2,
    }
});
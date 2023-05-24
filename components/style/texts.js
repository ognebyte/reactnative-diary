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
    medium: {
        fontSize: 22,
        fontWeight: '600',
    },
    small: {
        fontSize: 14,
        fontWeight: '600',
    },
    lightColor: { color: "#ffffff" },
    linkColor: { color: '#6E7AFF' },
    fadeColor: { color: "#00000080" },
    placeholder: { color: "#B3B3B3" },
    
    input: {
        justifyContent: 'center',
        minHeight: 45,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    inputMessage: {
        maxHeight: 100,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30,
        backgroundColor: '#f3f3f3',
    },
    inputTitle: {
        color: '#000000',
        minHeight: 45,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 2,
        flexWrap: 'wrap'
    },
    inputExtra: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 45,
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 4,
        backgroundColor: '#E6E6FA',
        borderRadius: 30,
    },
    inputMulti: {
        textAlignVertical: 'top',
        minHeight: 45,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
    },
    borderBottom: {
        width: '100%',
        borderBottomWidth: 2,
    }
});
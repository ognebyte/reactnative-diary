import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    modalLoading: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
        width: 150, height: 80, gap: 10,
        backgroundColor: 'black', borderRadius: 10
    },
    profileCardContainer: {
        alignItems: 'center',
        width: '100%', marginBottom: 30, gap: 30,
    },
    authButton: {
        justifyContent: 'center', alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    }
});
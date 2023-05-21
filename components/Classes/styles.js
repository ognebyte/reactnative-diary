import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    memberItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', height: 50,
        paddingVertical: 5, paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10
    },
    assignmentItemContainer: {
        flexDirection: 'row',
        width: '100%', height: 100,
        padding: 10,
        backgroundColor: 'white', borderRadius: 10,
    },
    assignmentHeader: {
        gap: 30, backgroundColor: 'white',
        borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        elevation: 2
    }
});
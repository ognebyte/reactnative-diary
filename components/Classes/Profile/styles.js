import { StyleSheet } from 'react-native';
import Colors from '../../style/colors';

export default StyleSheet.create({
    profileCardContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: '100%',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: Colors.grey,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
});
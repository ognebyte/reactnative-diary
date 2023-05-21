import { StyleSheet } from 'react-native';

import StylesNavigation from '../style/navigation'


export default StyleSheet.create({
    modalLoading: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
        width: 150, height: 80, gap: 10,
        backgroundColor: 'black', borderRadius: 10
    },
    modalHeader: {
        flexDirection: 'row', alignItems: 'center',
        height: 60,
        backgroundColor: '#ffffff',
    },
    modalScreenContainer: {
        flex: 1,
        backgroundColor: StylesNavigation.colors.background
    }
});
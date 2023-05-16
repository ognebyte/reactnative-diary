import { StyleSheet, Dimensions } from 'react-native';

import NavigationTheme from '../style/navigation'
const windowDimensions = Dimensions.get('window');
const windowHeight = windowDimensions.height

export default StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: windowHeight / 100 * 15,
    },
    content: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
        paddingTop: 30,
        marginTop: windowHeight / 100 * 12,
        gap: 40,
        backgroundColor: NavigationTheme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },

});
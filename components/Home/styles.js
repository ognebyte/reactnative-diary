import { StyleSheet, Dimensions } from 'react-native';

import NavigationTheme from '../style/navigation'
import Colors from '../style/colors'
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

    scrollViewItemsContainer: {
        borderRadius: 15,
        elevation: 2,
        backgroundColor: Colors.light,
        overflow: 'hidden'
    },
    scrollViewItemsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: 15,
        borderColor: Colors.grey
    },
    buttonHeader: {
        marginHorizontal: 5,
    },
    scrollViewItems: {
        backgroundColor: Colors.light,
    },
    scrollView: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'scroll',
        gap: 15,
        paddingHorizontal: 15,
    },
    buttonFooterContainer: {
        padding: 10,
        backgroundColor: Colors.grey,
    },
    buttonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    taskItem: {
        justifyContent: 'space-between',
        width: 200, height: 110,
        padding: 10,
        backgroundColor: Colors.grey,
        borderRadius: 15,
        elevation: 2,
    },

    loading: {
        position: 'absolute',
        top: 0, bottom: 0, right: 0, left: 0,
    }

});
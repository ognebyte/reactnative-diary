import { StyleSheet } from 'react-native';
import Colors from '../style/colors'

export default StyleSheet.create({
    classItem: {
        flexDirection: 'row',
        width: '100%', height: 100,
        backgroundColor: Colors.grey, borderRadius: 10, padding: 10
    },
    memberItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', height: 50,
        paddingVertical: 5, paddingHorizontal: 15,
        backgroundColor: Colors.grey,
        borderRadius: 10
    },

    
    assignmentItem: {
        flexDirection: 'column',
        width: '100%',
        gap: 10,
        backgroundColor: Colors.paper,
        borderRadius: 15,
        borderLeftWidth: 4,
    },
    assignmentItemHeaderContainer: {
        marginTop: -1,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        elevation: 2,
        overflow: 'hidden',
    },
    assignmentItemHeader: {
        padding: 10,
        backgroundColor: Colors.grey,
        elevation: 2,
        zIndex: 2
    },
    assignmentItemSummaryContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: Colors.light,
    },
    assignmentItemSummary: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    assignmentItemInfo: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    

    assignmentHeader: {
        gap: 30, backgroundColor: Colors.primary,
        borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        elevation: 2
    },
    withDescription: {
        backgroundColor: Colors.paper,
        borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        elevation: 2
    },

    submissionRight: {
        alignSelf: 'flex-end',
        maxWidth: '80%',
        padding: 10, gap: 5,
        borderRadius: 20, borderBottomRightRadius: 0,
        backgroundColor: Colors.grey,
    },
    submissionLeft: {
        alignSelf: 'flex-start',
        maxWidth: '80%',
        padding: 10, gap: 5,
        borderRadius: 20, borderBottomLeftRadius: 0,
        backgroundColor: Colors.primary,
    },

    submissionsInfo: {
        alignItems: 'center',
    },

    commentContainer: {
        backgroundColor: Colors.grey,
        marginBottom: 15, padding: 10,
        gap: 5,
        borderRadius: 10,
    },
    commentInput: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingHorizontal: 10,
        padding: 5, gap: 5,
    },

    
    submissionsItemContainer: {
        marginBottom: 15,
        borderRadius: 20, borderBottomLeftRadius: 0,
        backgroundColor: Colors.grey,
        overflow: 'hidden'
    },
    submissionsItem: {
        padding: 10, gap: 5,
    },
    gradeButton: {
        padding: 10,
        backgroundColor: Colors.primary,
    },
});
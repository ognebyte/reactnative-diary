import React, { useState, useEffect, useContext } from "react";
import { StyleSheet } from 'react-native';

const backgroundItem = '#f3f3f3'

export default StyleSheet.create({
    classItem: {
        flexDirection: 'row',
        width: '100%', height: 100,
        backgroundColor: backgroundItem, borderRadius: 10, padding: 10
    },
    memberItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', height: 50,
        paddingVertical: 5, paddingHorizontal: 15,
        backgroundColor: backgroundItem,
        borderRadius: 10
    },
    assignmentItem: {
        flexDirection: 'row',
        width: '100%', height: 100,
        padding: 10,
        backgroundColor: backgroundItem, borderRadius: 10,
    },
    assignmentHeader: {
        gap: 30, backgroundColor: '#E6E6FA',
        borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        elevation: 2
    },
    withDescription: {
        backgroundColor: '#f5e9bd',
        borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        elevation: 2
    },
    commentContainer: {
        backgroundColor: backgroundItem,
        marginBottom: 15, padding: 10,
        gap: 5,
        borderRadius: 10,
    },
    commentInput: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingHorizontal: 10,
        padding: 5, gap: 5,
    }
});
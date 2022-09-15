import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View, ViewProps } from "../View";
import { Text } from "../Text";
import { Animated, SafeAreaView, StatusBar } from 'react-native';
import { StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from "../FontAwesome";
import { Component, forwardRef, ReactNode } from "react";
import { Text as DefaultText } from 'react-native';




export type DefaultHeaderProps = {
    title: string,
    showIcon?: boolean | false,
    onLeftIconPress?: () => void,
    onRightIconPress?: () => void,
}

type DefaultHeaderState = {
    title: string
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        position: 'relative'
    },
    leftIcon: {
        position: 'absolute',
        height: '200%',
        left: 5,
        zIndex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    rightIcon: {
        position: 'absolute',
        height: '200%',
        right: 5,
        zIndex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    title_cointainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    divider: {
        width: '100%',
        backgroundColor: 'grey',
        opacity: 0.8,
        height: 0.2
    }
})
import { TransparentView, View } from "../View";
import { Text } from "../Text";
import { SafeAreaView } from 'react-native';
import { Pressable } from 'react-native';
import { FontAwesome } from "../FontAwesome";
import { Component, forwardRef, ReactNode, useState, useImperativeHandle } from "react";
import { getStyle } from "../../utils/Utils";
import { useNavigation } from '@react-navigation/native';
import { WebView as DefaultWebView } from 'react-native-webview'
import React from "react";


export const WebViewHeader = React.memo(forwardRef<any, WebviewHeaderProps>((props: WebviewHeaderProps, ref) => {
    const [title, setTittle] = useState(props.title)
    const [canGoBack, setCanGoBack] = useState(false)
    const [canGoForward, setCanGoForward] = useState(false)
    const navigation = useNavigation()

    useImperativeHandle(
        ref,
        () => ({
            changeTitle: (title: string) => setTittle(title),
            setGoBack: (value: boolean) => setCanGoBack(value),
            setGoForward: (value: boolean) => setCanGoForward(value)
        }),
    )

    return (
        <SafeAreaView >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: WebviewHeaderStat.HEADER_MAX_HEIGHT }}>
                <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Pressable style={{}} onPress={() => {
                        navigation.goBack()
                    }}>
                        <FontAwesome name="angle-down" size={32} />
                    </Pressable>
                    <Pressable style={{ opacity: canGoBack ? 0.8 : 0.5, paddingHorizontal: 20 }} onPress={() => {
                        if (canGoBack)
                            props.webViewRef.current.goBack()
                    }}>
                        <FontAwesome name="angle-left" size={28} />
                    </Pressable>
                </TransparentView>

                <View style={{ flexGrow: 1, flexShrink: 1 }}>
                    <Text style={getStyle().headerTitle} text={title ? title : props.title} />
                </View>

                <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Pressable style={{ opacity: canGoForward ? 0.8 : 0.5, paddingHorizontal: 20 }} onPress={() => {
                        if (canGoForward)
                            props.webViewRef.current.goForward()
                    }}>
                        <FontAwesome name="angle-right" size={28} />
                    </Pressable>
                    <Pressable style={{ paddingVertical: 10 }} onPress={() => {
                        props.webViewRef.current.reload()
                    }}>
                        <FontAwesome name="rotate-left" size={22} />
                    </Pressable>
                </TransparentView>
            </View>
            <View style={getStyle().headerDivider} />
        </SafeAreaView>
    )
}))

export type WebviewHeaderProps = {
    title: string,
    webViewRef?: React.MutableRefObject<DefaultWebView<{}>>
}

export const WebviewHeaderStat = {
    HEADER_MAX_HEIGHT: 40,
}
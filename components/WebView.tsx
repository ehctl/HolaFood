import { useLayoutEffect, useRef, useState } from 'react';
import { WebView as DefaultWebView, WebViewNavigation, WebViewProps } from 'react-native-webview'
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '../navigation/StackGroup';
import { WebViewHeader } from './Headers/WebviewHeader';
import React from 'react';

export const WebView = (props: WebViewProp) => {
    const webView = useRef<DefaultWebView>(null)
    const webViewHeader = useRef(null)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            header: () => <WebViewHeader ref={webViewHeader} webViewRef={webView} title='Loading' />
        })
    }, [])


    const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
        const { title, canGoBack, canGoForward } = newNavState
        webViewHeader.current?.changeTitle(title)
        webViewHeader.current?.setGoBack(canGoBack)
        webViewHeader.current?.setGoForward(canGoForward)
    }

    return <DefaultWebView
        ref={webView}
        source={{ uri: props.route.params.uri }}
        startInLoadingState={true}
        allowsFullscreenVideo={false}
        cacheEnabled={true}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onShouldStartLoadWithRequest={(e) => true}
    />
}


export interface WebViewProp {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'WebView'>;
    route: RouteProp<GroupStackParamList, 'WebView'>
}
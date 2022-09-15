import { useLayoutEffect, useRef, useState } from 'react';
import { WebView as DefaultWebView, WebViewNavigation, WebViewProps } from 'react-native-webview'
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '../navigation/StackGroup';
import { WebViewHeader } from './Headers/WebviewHeader';

export const WebView = (props: WebViewProp) => {
    const webView = useRef<DefaultWebView>(null)
    const webViewHeader = useRef<WebViewHeader>(null)

    useLayoutEffect(() => {
        props.navigation.setOptions({
            header: () => <WebViewHeader ref={webViewHeader} title='Loading' onLeftIconPress={() => props.navigation.goBack()} onRightIconPress={() => webView.current?.reload()} />
        })
    }, [])


    const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
        const { title } = newNavState
        webViewHeader.current?.changeTitle(title)
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
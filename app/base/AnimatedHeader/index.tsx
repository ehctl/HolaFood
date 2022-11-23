import { useCallback, useRef, useState } from "react"
import { Animated, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, FlatListProps, GestureResponderEvent, KeyboardAvoidingView, Platform } from "react-native"
import { View } from "../View"
import { AnimatedPressable, getStyle, isIosDevice, wait } from "../../utils/Utils"
import React from 'react'
import { useThemeColor } from "../Themed"
import { style } from "./style/index.css"
import { useEffect } from "react"


export const AnimatedHeader = React.memo((props: AnimatedHeaderScreenProps) => {
    const listBackGround = useThemeColor({}, 'background')

    const [refreshing, setRefreshing] = useState(false);
    const [isOnTop, setIsOnTop] = useState(true)
    const [canRefresh, setCanRefresh] = useState(false)

    const scrollOffsetY = useRef(new Animated.Value(0)).current
    const prevScrollOffsetY = useRef(new Animated.Value(props.headerProps.headerHeight)).current
    const prevHeaderTransformY = useRef(new Animated.Value(0)).current
    const scrollOffsetYSub = useRef(Animated.subtract(scrollOffsetY, prevScrollOffsetY)).current
    const transformY = useRef(Animated.add(prevHeaderTransformY, scrollOffsetYSub).interpolate({
        inputRange: [-props.headerProps.headerHeight, props.headerProps.headerHeight],
        outputRange: [0, -props.headerProps.headerHeight],
        extrapolate: 'clamp'
    })).current
    const opacity = useRef(Animated.subtract(1, Animated.divide(transformY, -props.headerProps.headerHeight))).current

    const handleSnap = useCallback(({ nativeEvent }) => {
        const offsetY = Math.max(0, nativeEvent.contentOffset.y);
        prevHeaderTransformY.setValue(-2 * Number(JSON.stringify(transformY)) - props.headerProps.headerHeight)
        prevScrollOffsetY.setValue(offsetY)
    }, [props.headerProps.headerHeight, transformY]);

    const ListWrapper = useRef(props.useScrollView ? Animated.ScrollView : Animated.FlatList).current
    const listRef = useRef(null)

    useEffect(() => {
        scrollOffsetY.addListener((v) => {
        })

        return () => {
            scrollOffsetY.removeAllListeners()
        }
    }, [])

    const asyncListener = useCallback(async (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        props.onSrollListenter?.(e)
        setIsOnTop(e.nativeEvent.contentOffset.y <= 0)

        if (isIosDevice() && e.nativeEvent.contentOffset.y <= -IOS_PTR_DISTANCE)
            setCanRefresh(true)
    }, [isOnTop])

    const scrollToTop = useCallback(() => {
        if (props.useScrollView)
            listRef.current.scrollTo({ animated: true, offset: 0 })
        else
            listRef.current.scrollToOffset({ animated: true, offset: 0 })
    }, [])

    return (
        <View style={getStyle().AnimatedHeader_container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }} >
                <AnimatedPressable style={[
                    getStyle().AnimatedHeader_header,
                    {
                        height: props.headerProps.headerHeight,
                        transform: [{ translateY: (isOnTop && isIosDevice()) ? 0 : transformY }],
                        opacity: (isOnTop && isIosDevice()) ? 1 : opacity
                    }]}
                    onPress={() => {
                        scrollToTop()
                    }}>

                    {props.headerProps.header}
                </AnimatedPressable>

                {
                    (isIosDevice() && !props.hideReload) ?
                        <ActivityIndicator animating={true} size='small' style={[style.activityIndicatorContainer, { top: props.headerProps.headerHeight }]} />
                        : null
                }

                {
                    <ListWrapper
                        {...props.flatListProps}
                        ref={listRef}
                        contentContainerStyle={[
                            { minHeight: '100%', backgroundColor: listBackGround },
                            { paddingTop: props.headerProps.headerHeight + (refreshing && isIosDevice() ? REFRESH_CONTROL_INDICATOR_SIZE : 0) }
                        ]}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={handleSnap}
                        onScrollEndDrag={handleSnap}
                        refreshControl={
                            (!isIosDevice() && !props.hideReload) ?
                                <RefreshControl
                                    progressViewOffset={REFRESH_CONTROL_INDICATOR_SIZE + props.headerProps.headerHeight}
                                    refreshing={refreshing}
                                    onRefresh={() => {
                                        setRefreshing(true)
                                        props.onRefresh?.()
                                        setRefreshing(false)
                                    }} />
                                : null
                        }
                        onResponderRelease={(e: GestureResponderEvent) => {
                            if (canRefresh && isIosDevice() && isOnTop) {
                                props.onRefresh?.()
                                setCanRefresh(false)
                            }
                        }}
                        onScroll={
                            Animated.event(
                                [{
                                    nativeEvent: {
                                        contentOffset: { y: scrollOffsetY },
                                    },
                                }],
                                {
                                    useNativeDriver: true,
                                    listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                        asyncListener(e)
                                    }
                                },
                            )} >
                        {props.children}
                    </ListWrapper>
                }
            </KeyboardAvoidingView>
        </View>
    )
})

export type AnimatedHeaderScreenProps = {
    flatListProps?: Omit<FlatListProps<any>, 'refreshControl'>,
    headerProps: HeaderProps,
    useScrollView?: boolean,
    hideReload?: boolean | true,
    onRefresh?: () => void,
    onSrollListenter?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void,
    children?: React.ReactNode[] | React.ReactNode
}

export type HeaderProps = {
    header: React.ReactElement,
    headerHeight: number,
}

const IOS_PTR_DISTANCE = 100
const REFRESH_CONTROL_INDICATOR_SIZE = 30

import { useRef, useState } from "react"
import { Animated, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, FlatListProps } from "react-native"
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

    const handleSnap = ({ nativeEvent }) => {
        const offsetY = Math.max(0, nativeEvent.contentOffset.y);
        prevHeaderTransformY.setValue(-2 * Number(JSON.stringify(transformY)) - props.headerProps.headerHeight)
        prevScrollOffsetY.setValue(offsetY)
    };
    const ListWrapper = useRef(props.useScrollView ? Animated.ScrollView : Animated.FlatList).current
    const listRef = useRef(null)

    useEffect(() => {
        scrollOffsetY.addListener((v) => {
        })

        return () => {
            scrollOffsetY.removeAllListeners()
        }
    }, [])

    return (
        <View style={getStyle().AnimatedHeader_container}>
            <AnimatedPressable style={[
                getStyle().AnimatedHeader_header,
                {
                    height: props.headerProps.headerHeight,
                    transform: [{ translateY: (isOnTop && isIosDevice()) ? 0 : transformY }],
                    opacity: (isOnTop && isIosDevice()) ? 1 : opacity
                }]}
                onPress={() => {
                    if (props.useScrollView)
                        listRef.current.scrollTo({ animated: true, offset: 0 })
                    else
                        listRef.current.scrollToOffset({ animated: true, offset: 0 })
                }}>

                {props.headerProps.header}
            </AnimatedPressable>

            {
                (isIosDevice() && !props.hideReload ) ?
                    <ActivityIndicator animating={true} size='small' style={[style.activityIndicatorContainer, { top: props.headerProps.headerHeight }]} />
                    : null
            }

            {
                    <ListWrapper
                        {...props.flatListProps}
                        ref={listRef}
                        contentContainerStyle={[
                            { backgroundColor: listBackGround },
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
                                    onRefresh={props.onRefresh} />
                                : null
                        }
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
                                        const asyncListener = async () => {
                                            props.onSrollListenter?.(e)
                                            setIsOnTop(e.nativeEvent.contentOffset.y <= 0)
                                            if (e.nativeEvent.contentOffset.y <= -IOS_PTR_DISTANCE && isIosDevice() && !refreshing) {
                                                setRefreshing(props.onRefresh != undefined)
                                                props.onRefresh?.()
                                                // add small delay to prevent callback from being triggered twice
                                                await wait(100)
                                                setRefreshing(false)
                                            }
                                        }
                                        asyncListener()
                                    }
                                },
                            )} >
                        {props.children}
                    </ListWrapper>
            }
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

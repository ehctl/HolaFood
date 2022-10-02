import { useRef, useState } from "react"
import { Animated, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, FlatListProps } from "react-native"
import { View } from "../components/View"
import { getStyle, isIosDevice, wait } from "../utils/Utils"
import React from 'react'
import { useThemeColor } from "../components/Themed"
import { Level1Header } from "../components/Headers/Level1Header"

export const AnimatedHeaderScreen = React.memo((props: AnimatedHeaderScreenProps) => {
    const listBackGround = useThemeColor({}, 'background')

    const [refreshing, setRefreshing] = useState(false);
    const [isOnTop, setIsOnTop] = useState(true)

    const scrollOffsetY = new Animated.Value(0)
    const prevScrollOffsetY = new Animated.Value(props.headerProps.headerHeight)
    const prevHeaderTransformY = new Animated.Value(0)
    const scrollOffsetYSub = Animated.subtract(scrollOffsetY, prevScrollOffsetY)
    const transformY = Animated.add(prevHeaderTransformY, scrollOffsetYSub).interpolate({
        inputRange: [-props.headerProps.headerHeight, props.headerProps.headerHeight],
        outputRange: [0, -props.headerProps.headerHeight],
        extrapolate: 'clamp'
    })
    const opacity = Animated.subtract(1, Animated.divide(transformY, -props.headerProps.headerHeight))

    const flatListRef = useRef<Animated.FlatList>(null)

    const handleSnap = ({ nativeEvent }) => {
        const offsetY = nativeEvent.contentOffset.y;
        prevHeaderTransformY.setValue(-2 * Number(JSON.stringify(transformY)) - props.headerProps.headerHeight)
        prevScrollOffsetY.setValue(offsetY)
    };


    return (
        <View style={getStyle().AnimatedHeader_container}>
            <Animated.View style={[
                getStyle().AnimatedHeader_header,
                {
                    height: props.headerProps.headerHeight,
                    transform: [{ translateY: (isOnTop && isIosDevice()) ? 0 : transformY }],
                    opacity: (isOnTop && isIosDevice()) ? 1 : opacity
                }]}>

                {props.headerProps.header}
            </Animated.View>

            {
                (isIosDevice() && !props.hideReload && !props.fetchingDataPreLoad) ?
                    <ActivityIndicator animating={true} size='small' style={[getStyle().ab_r_l, { top: props.headerProps.headerHeight }]} />
                    : null
            }

            {
                props.fetchingDataPreLoad ?
                    <ActivityIndicator animating={true} size='small' style={[getStyle().ab_r_l, { top: props.headerProps.headerHeight }]} />
                    :
                    <Animated.FlatList
                        {...props.flatListProps}
                        ref={flatListRef}
                        contentContainerStyle={[{ backgroundColor: listBackGround }, { paddingTop: props.headerProps.headerHeight + (refreshing && isIosDevice() ? REFRESH_CONTROL_INDICATOR_SIZE : 0) }]}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={handleSnap}
                        onScrollEndDrag={handleSnap}
                        removeClippedSubviews={false}
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
                                    useNativeDriver: false,
                                    listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                        const asyncListener = async () => {
                                            props.onSrollListenter?.(e)
                                            setIsOnTop(e.nativeEvent.contentOffset.y <= 0 && props.onRefresh == undefined)
                                            if (e.nativeEvent.contentOffset.y <= -IOS_PTR_DISTANCE && isIosDevice() && !refreshing) {
                                                setRefreshing(props.onRefresh != undefined)
                                                await props.onRefresh?.()
                                                // add small delay to prevent callback from being triggered twice
                                                await wait(100)
                                                setRefreshing(false)
                                            }
                                        }
                                        asyncListener()
                                    }
                                },
                            )} />
            }
        </View>
    )
})

export type AnimatedHeaderScreenProps = {
    flatListProps: FlatListProps<any>,
    headerProps: HeaderProps,
    hideReload?: boolean | true,
    fetchingDataPreLoad?: boolean | false,
    onRefresh?: () => (Promise<void> | void),
    onSrollListenter?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export type HeaderProps = {
    header: React.ReactElement,
    headerHeight: number,
}

const IOS_PTR_DISTANCE = 100
const REFRESH_CONTROL_INDICATOR_SIZE = 30

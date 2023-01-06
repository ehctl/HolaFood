import React, { useEffect, useRef, useState } from "react"
import { Children } from "react"
import { useCallback } from "react"
import { View as DefaultView, GestureResponderEvent, LayoutChangeEvent, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, PanResponder } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { View } from "../View"
import { Text } from "../Text"
import { FontAwesome } from "@expo/vector-icons"

export const Slider = React.memo((props: SliderProps) => {
    const [defaultJumpInterval, ] = useState(2000)
    const [velocityMultiplier, ] = useState(500)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [scrollViewWidth, setScrollViewWidth] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null);
    const [startDragOffsetX, setStartDragOffsetX] = useState(0)

    const renderItem = () => {
        return props.children.map((i, index) => (
            <View
                key={index}
                style={{ width: `${100 / props.children.length}%` }}>

                {props.children[index]}
            </View>
        ))
    }

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setScrollViewWidth(width);
    }, []);
    
    const goBackward = useCallback(() => {
        const index = currentIndex == 0 ? props.children.length - 1 : (currentIndex - 1)

        scrollViewRef.current?.scrollTo({
            animated: true,
            x: index * scrollViewWidth,
            y: 0
        })

        setCurrentIndex(index)
    }, [currentIndex, props.children, scrollViewWidth])

    const goForward = useCallback(() => {
        const index = (currentIndex + 1) % props.children.length

        scrollViewRef.current?.scrollTo({
            animated: true,
            x: index * scrollViewWidth,
            y: 0
        })

        setCurrentIndex(index)
    }, [currentIndex, props.children, scrollViewWidth])

    const stayHere = useCallback(() => {
        scrollViewRef.current?.scrollTo({
            animated: true,
            x: currentIndex * scrollViewWidth,
            y: 0
        })

    }, [currentIndex, scrollViewWidth])

    const onScrollBeginDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setStartDragOffsetX(e.nativeEvent.contentOffset.x)
    }, [])

    const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    }, [])

    const onScrollEndDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const deltaX = startDragOffsetX - e.nativeEvent.contentOffset.x + (e.nativeEvent.velocity?.x ?? 0) * velocityMultiplier

        if (Math.abs(deltaX) > scrollViewWidth / 2)
            if (deltaX > 0)
                goForward()
            else
                goBackward()
        else
            stayHere()
    }, [startDragOffsetX, scrollViewWidth])

    useEffect(() => {
        var timeoutId: any = undefined
        if (props.autoPlay)
            timeoutId = setTimeout(goForward, props.jumpInterval ?? defaultJumpInterval)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [props.autoPlay, props.jumpInterval, goForward])

    return (
        <View
            style={props.style}
            onLayout={onLayout} >

            <ScrollView
                ref={scrollViewRef}
                bounces={false}
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                contentContainerStyle={{ width: `${props.children.length * 100}%` }}
                showsHorizontalScrollIndicator={false}
                horizontal={true} >

                {renderItem()}
            </ScrollView>

            {
                props.showPageIndicator ?
                    <View
                        style={{ position: 'absolute', bottom: -15, right: 0, left: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <PageIndicator currentIndex={currentIndex} numberOfPage={props.children.length} />
                    </View>
                    : null
            }

        </View>
    )
})

const PageIndicator = React.memo((props: PageIndicator) => {
    const genPageIndicator = useCallback(() => {
        const arr = []
        for (let i = 0; i < props.numberOfPage; i++) {
            arr.push(i == props.currentIndex ? 'circle' : 'circle-o')
        }

        return arr
    }, [props])


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {
                genPageIndicator().map((i, index) => (
                    <FontAwesome
                        color='grey'
                        style={{ marginLeft: 5 }}
                        key={index}
                        name={i as any} />
                ))
            }
        </View>
    )
})


export type SliderProps = {
    children: React.ReactNode[],
    showPageIndicator?: boolean,
    autoPlay?: boolean,
    jumpInterval?: number,
    style?: DefaultView['props']['style'],
}

export type PageIndicator = {
    numberOfPage: number,
    currentIndex: number
}
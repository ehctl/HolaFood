import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
import { View as DefaultView } from 'react-native'
import { style } from "./style/index.css";

export const ShimmerGroupContext = React.createContext<ShimmerGroupContextType>({
    progress: null
});

export const ShimmerGroup = React.memo((props: ShimmerGroupProps) => {
    const animationProgress = useRef(new Animated.Value(1)).current
    var animationCall = useRef(Animated.loop(
        Animated.sequence([
            Animated.timing(animationProgress, {
                useNativeDriver: true,
                toValue: 0,
                duration: 800,
            }),
            Animated.timing(animationProgress, {
                useNativeDriver: true,
                toValue: 1,
                duration: 800,
            }),
        ]),
        {
            iterations: 1000,
        }
    )).current

    const startAnimation = useCallback(() => {
        animationCall.reset()
        animationCall.start()
    }, [])

    useEffect(() => {
        if (!props.visible)
            animationCall.stop()
        else {
            startAnimation()
        }

        return () => {
            animationCall.stop()
            animationProgress.removeAllListeners()
        }
    }, [props.visible])

    return (
        <ShimmerGroupContext.Provider value={{ progress: animationProgress }}>
            {
                props.visible ?
                    props.children : null
            }
        </ShimmerGroupContext.Provider>
    )
})

export type ShimmerGroupProps = {
    visible: boolean,
    children?: React.ReactNode[] | React.ReactNode
}

export type ShimmerGroupContextType = {
    progress: Animated.Value
}

export const ShimmerItem = React.memo((props: ShimmerItemProps) => {
    const [containerWidth, setContainerWidth] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)

    const onLayout = useCallback(event => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width)
        setContainerHeight(height)
    }, []);

    const AnimatedLG = Animated.createAnimatedComponent(LinearGradient)
    const AnimatedView = Animated.createAnimatedComponent(DefaultView)
    return (
        <ShimmerGroupContext.Consumer>
            {({ progress }) => {
                return (
                    <AnimatedView {...props} onLayout={onLayout} style={[props.style, style.containerView]} >
                        <AnimatedLG
                            style={{
                                width: '100%', height: '100%',
                                opacity: progress
                            }}
                            colors={['#cdcfcc', '#838581']}
                            start={[0, 0]}
                            end={[1, 0]} />
                    </AnimatedView>
                )
            }}
        </ShimmerGroupContext.Consumer>
    )
})



export type ShimmerItemProps = DefaultView['props']
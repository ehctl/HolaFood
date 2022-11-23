import React, { useCallback, useEffect, useRef, useState } from "react"
import { TransparentView, View } from "../View"
import { Text } from "../Text"
import { Animated, ColorValue } from "react-native"
import { View as DefaultView } from 'react-native'
import { isIosDevice } from "../../utils/Utils"


export const AnimatedCircle = React.memo((props: AnimatedCircleType) => {
    const opacity = useRef(new Animated.Value(1)).current
    const spinVal = useRef(new Animated.Value(0)).current

    const [spin1, _] = useState(Math.random() + 0.5)

    const spin = spinVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const opacityAnim = useRef(
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    useNativeDriver: true,
                    toValue: 0.6,
                    duration: 1000,
                }),
                Animated.timing(opacity, {
                    useNativeDriver: true,
                    toValue: 1,
                    duration: 1000
                })
            ]),
            {
                iterations: 10000
            })
    ).current

    const spinAnim = useRef(
        Animated.loop(
            Animated.sequence([
                Animated.timing(spinVal, {
                    useNativeDriver: true,
                    toValue: spin1,
                    duration: 3000,
                }),
                Animated.timing(spinVal, {
                    useNativeDriver: true,
                    toValue: 0,
                    duration: 3000
                })
            ]),
            {
                iterations: 10000
            })
    ).current


    useEffect(() => {
        if (isIosDevice()) {
            opacityAnim.reset()
            opacityAnim.start()
        }

        spinAnim.reset()
        spinAnim.start()
        return () => {
            opacityAnim.stop()
            spinAnim.stop()
        }
    }, [])

    return (
        <View
            style={{ position: 'relative', height: props.size * 15, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Animated.View
                style={{
                    position: 'absolute',
                    opacity: opacity, transform: [{ rotate: spin }],
                    top: 0, right: 0, left: 0, bottom: 0, backgroundColor: props.color, borderRadius: 100, justifyContent: 'center', alignItems: 'center'
                }}>

                <View style={{zIndex: 2, height: props.size * 12, aspectRatio: 1, borderRadius: 30, position: 'relative' }} >
                    <Animated.View
                        style={{
                            position: 'absolute',
                            transform: [{ rotate: spin }],
                            top: 10, right: 10, left: 10, bottom: 10, backgroundColor: props.color, borderRadius: 100, justifyContent: 'center', alignItems: 'center'
                        }} >

                        <View style={{height: props.size * 5, aspectRatio: 1, borderRadius: 30, position: 'relative' }} />
                        <View style={{height: props.size * 5, aspectRatio: 1, top: 0, left: 0, position: 'absolute' }} />

                    </Animated.View>
                </View>
                <View style={{ zIndex: 1, height: props.size * 8, aspectRatio: 1, top: 0, right: 0, position: 'absolute' }}>
                </View>
            </Animated.View>

            <TransparentView>
                {props.children}
            </TransparentView>
        </View>
    )
})

export type AnimatedCircleType = {
    children?: React.ReactNode[] | React.ReactNode,
    size: number,
    color: ColorValue,
}
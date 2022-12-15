import React, { useCallback, useEffect, useRef } from "react"
import { FontAwesome } from "../../base/FontAwesome"
import { View } from "../../base/View"
import { Animated } from 'react-native';
import { Dimensions } from 'react-native';

export const Location = React.memo(() => {
    const textRef = useRef(null)
    const transformX = useRef(new Animated.Value(0)).current
    const windowWidth = useRef(Dimensions.get('window').width).current;

    const startAnimation = useCallback(() => {
        Animated.timing(transformX, {
            useNativeDriver: true,
            toValue: -windowWidth,
            duration: 6000,
        }).start(() => {
            transformX.setValue(windowWidth)
            startAnimation()
        })
    }, [])

    useEffect(() => {
        startAnimation()

        return () => {
            transformX.stopAnimation()
        }
    }, [])

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, height: 50, backgroundColor: '#dbd9d5', borderRadius: 15, flexShrink: 1 }}>
            <View style={{ backgroundColor: '#dbd9d5', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, zIndex: 1 }}>
                <FontAwesome name="location-arrow" size={26} color='#686db0'/>
            </View>

            <Animated.Text ref={textRef} style={{
                fontSize: 18, marginLeft: 10, textAlign: 'center',
                transform: [{ translateX: transformX }]
            }} numberOfLines={1} >
                Đại học FPT, Thạch Thất, Hòa Lạc, Hà Nội
            </Animated.Text>
        </View>
    )
})

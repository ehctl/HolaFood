import React, { useEffect, useRef } from "react"
import { FontAwesome } from "../../components/FontAwesome"
import { View } from "../../components/View"
import { Text, Animated } from 'react-native';
import { Dimensions } from 'react-native';

export const Location = React.memo(() => {
    const textRef = useRef<Text>(null)
    const transformX = useRef(new Animated.Value(0)).current
    const windowWidth = Dimensions.get('window').width;

    const startAnimation = () => {
        Animated.timing(transformX, {
            useNativeDriver: false,
            toValue: -windowWidth,
            duration: 10000,
        }).start(() => {
            transformX.setValue(windowWidth)
            startAnimation()
        })
    }

    useEffect(() => {
        startAnimation()
    }, [])

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, height: 50, backgroundColor: 'grey', borderRadius: 15 }}>
            <View style={{ backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, zIndex: 1 }}>
                <FontAwesome name="location-arrow" size={26} />
            </View>
            <Animated.Text ref={textRef} style={{
                flexGrow: 1, fontSize: 18, marginLeft: 10, textAlign: 'center',
                transform: [{ translateX: transformX }],
            }} numberOfLines={1} >
                Đại học FPT, Thạch Thất, Hòa Lạc, Hà Nội
            </Animated.Text>
        </View>
    )
})

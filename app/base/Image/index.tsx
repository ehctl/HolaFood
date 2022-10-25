import React, { useRef } from "react"
import { Image as DefaultImage, Animated } from 'react-native'
import { TransparentView, View } from "../View"


export const Image = React.memo((props: DefaultImage['props']) => {
    const opacityAnimated = useRef(new Animated.Value(0)).current
    const minusOpacityAnimated = useRef(Animated.subtract(1, opacityAnimated)).current

    const startAnimation = () => {
        Animated.timing(opacityAnimated,
            {
                useNativeDriver: true,
                toValue: 1,
                duration: 1200,
            }
        ).start()
    }

    return (
        <TransparentView>
            <Animated.Image
                {...props}
                style={[props.style, { opacity: opacityAnimated }]}
                onLoadEnd={() => { startAnimation() }} />
                <Animated.View style={[props.style, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'grey', opacity: minusOpacityAnimated}]} />
        </TransparentView>
    )
})

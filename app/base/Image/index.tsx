import React, { useRef } from "react"
import { Image as DefaultImage, Animated } from 'react-native'


export const Image = React.memo((props: DefaultImage['props']) => {
    const opacityAnimated = useRef(new Animated.Value(0)).current

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
        <Animated.Image
            {...props}
            style={[props.style, { opacity: opacityAnimated }]}
            onLoadEnd={() => { startAnimation() }} />
    )
})

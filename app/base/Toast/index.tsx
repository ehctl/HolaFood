import { useCallback, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { Text } from "../../base/Text";
import { Animated } from "react-native";
import { useLanguage } from "../Themed";

export const ToastContext = React.createContext<ToastProps>({
    message: '',
    color: 'black',
    switch: false,
    show: () => { },
});

export type ToastProps = {
    message: string,
    color: string,
    switch: boolean,
    show: (message: string, color?: string) => void,
}

export type ToastWrapperType = {
    children?: React.ReactNode[] | React.ReactNode
}

export const ToastWrapper = React.memo((props: ToastWrapperType) => {
    const [message, setMessage] = useState('')
    const [switch1, setSwitch] = useState(false)
    const [color, setColor] = useState('black')

    const show = useCallback((message: string, color?: string) => {
        setMessage(message)
        setColor(color ?? 'white')
        setSwitch(!switch1)
    }, [switch1])

    return (
        <ToastContext.Provider
            value={{
                color,
                message,
                switch: switch1,
                show,
            }} >
            {props.children}
        </ToastContext.Provider>
    )
})

export const Toast = React.memo(() => {
    const consumer = useContext(ToastContext)
    const opacity = useRef(new Animated.Value(0)).current
    const [firstTime, setFirstTime] = useState(true)

    const message = useLanguage(consumer.message)

    useEffect(() => {
        if (!firstTime) {
            opacity.stopAnimation()
            opacity.setValue(0)
            Animated.sequence([
                Animated.timing(opacity, {
                    useNativeDriver: true,
                    toValue: 1,
                    duration: 300
                }),
                Animated.delay(1000),
                Animated.timing(opacity, {
                    useNativeDriver: true,
                    toValue: 0,
                    duration: 300
                })
            ]).start()
        } else {
            setFirstTime(false)
        }
    }, [consumer.switch])

    return (
        <Animated.View
            style={{
                opacity: opacity,
                borderRadius: 10, position: 'absolute', bottom: 50, right: 0, left: 0, height: 40,
                marginHorizontal: 10, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center'
            }}
            pointerEvents='none'>

            <Animated.Text style={{ color: consumer.color, fontSize: 18 }}>
                {message}
            </Animated.Text>
        </Animated.View>
    )
})

export const useToast = () => {
    const consumer = useContext(ToastContext)
    return consumer.show
}
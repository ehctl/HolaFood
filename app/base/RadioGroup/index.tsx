import { Animated, ColorValue, Pressable } from "react-native";
import { useTheme } from "../Themed";
import { View as DefaultView } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View } from "../View";
import { style } from "./style/index.css";


export const RadioButtonGroupContext = React.createContext<RadioButtonGroupProps>({
    value: '',
    valueChange: (_: any) => { }
});

export const RadioButtonContext = React.createContext<{ isSelected: boolean }>({
    isSelected: false,
});

export const RadioButtonGroup = (props: RadioButtonGroupProps) => {
    const [value, setValue] = useState(props.value)
    const valueChange = useCallback((newValue: string) => {
        if (newValue !== value) {
            setValue(newValue)
            props.valueChange(newValue)
        }
    }, [value])

    return (
        <RadioButtonGroupContext.Provider
            value={{
                value, valueChange,
                defaultColor: props.defaultColor ?? (useTheme() == 'dark' ? 'white' : 'black'),
                selectedColor: props.selectedColor ?? (useTheme() == 'dark' ? 'white' : 'black')
            }}>
            {props.children}
        </RadioButtonGroupContext.Provider>
    )
}

export const RadioButton = (props: RadioButtonProps) => {
    return (
        <RadioButtonGroupContext.Consumer >
            {({ value, valueChange }) => {
                return (
                    <RadioButtonContext.Provider value={{ isSelected: props.value === value }}>
                        <Pressable onPress={() => valueChange(props.value)} style={props.style}>
                            {props.children}
                        </Pressable>
                    </RadioButtonContext.Provider>
                )
            }}
        </RadioButtonGroupContext.Consumer>
    )
}

export const RadioButtonIcon = React.memo((props: RadioButtonIconProps) => {
    const consumer = useContext(RadioButtonContext)
    const opacity = useRef(new Animated.Value(0)).current

    const animation = useCallback((isSelected: boolean) => {
        Animated.timing(opacity, {
            useNativeDriver: true,
            toValue: isSelected ? 1 : 0,
            duration: 500,
        }).start()
    }, [])

    useEffect(() => {
        animation(consumer.isSelected)

        return () => {
            opacity.removeAllListeners()
            opacity.stopAnimation()
        }

    }, [consumer.isSelected])

    return (
        <RadioButtonGroupContext.Consumer >
            {({ defaultColor: outterColor, selectedColor: innerColor }) => (
                <View style={[style.outterCircle, { borderColor: props.defaultColor ?? outterColor, height: 5 * (props.size ?? 18) }]}>
                    <Animated.View style={[style.innerCircle, { backgroundColor: props.selectedColor ?? innerColor, height: 3 * (props.size ?? 18), opacity }]} />
                </View>
            )}
        </RadioButtonGroupContext.Consumer>
    )
})

export type RadioButtonGroupProps = {
    value: any,
    valueChange: (value: any) => void,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
    children?: React.ReactNode[] | React.ReactNode
}

export type RadioButtonProps = {
    value: any,
    style?: DefaultView['props']['style']
    children?: React.ReactNode[] | React.ReactNode,
}

export type RadioButtonIconProps = {
    size?: number,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
}

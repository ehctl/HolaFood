import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, ColorValue, Pressable } from "react-native";
import { useTheme } from "../Themed";
import { View as DefaultView } from "react-native";
import { View } from "../View";
import { AnimatedFontAwesome } from "../../utils/Utils";
import { FontAwesome } from "@expo/vector-icons";

export const SelectGroupContext = React.createContext<SelectGroupContextProps>({
    value: [],
    addValue: (_: string) => { },
    removeValue: (_: string) => { }
});

export const SelectContext = React.createContext<{ isSelected: boolean }>({
    isSelected: false,
});

export const SelectGroup = React.memo((props: SelectGroupProps) => {
    const [valueList, setValueList] = useState<string[]>(props.value ?? [])

    const addValue = useCallback((value: string) => {
        setValueList([...valueList, value])
        props?.valueChange(valueList)
    }, [valueList])

    const removeValue = useCallback((value: string) => {
        setValueList(valueList.filter((v) => v != value))
        props?.valueChange(valueList)
    }, [valueList])

    return (
        <SelectGroupContext.Provider
            value={{
                value: valueList,
                addValue,
                removeValue,
                defaultColor: props.defaultColor ?? (useTheme() == 'dark' ? 'white' : 'black'),
                selectedColor: props.selectedColor ?? (useTheme() == 'dark' ? 'white' : 'black')
            }}>
            {props.children}
        </SelectGroupContext.Provider>
    )
})

export const Select = React.memo((props: SelectProps) => {
    return (
        <SelectGroupContext.Consumer>
            {({ value, addValue, removeValue }) => {
                const isSelected = value.findIndex((v) => v == props.value) != -1
                return (
                    <SelectContext.Provider value={{ isSelected: isSelected }}>
                        <Pressable
                            style={props.style}
                            onPress={() => {
                                if (isSelected)
                                    removeValue(props.value)
                                else
                                    addValue(props.value)
                            }} >
                            {props.children}
                        </Pressable>
                    </SelectContext.Provider>
                )
            }}
        </SelectGroupContext.Consumer>
    )
})

export const SelectIcon = React.memo((props: RadioButtonIconProps) => {
    const consumer = useContext(SelectContext)
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
        }

    }, [consumer.isSelected])

    return (
        <SelectGroupContext.Consumer >
            {({ defaultColor: outterColor, selectedColor: innerColor }) => (
                <View
                    style={[{ borderWidth: 2, aspectRatio: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }, { borderColor: props.defaultColor ?? outterColor, height: 5 * (props.size ?? 18) }]}>
                    <AnimatedFontAwesome
                        name='check' size={props.size * 4} color={props.selectedColor ?? innerColor}
                        style={{ opacity }} />
                </View>
            )}
        </SelectGroupContext.Consumer>
    )
})

export type RadioButtonIconProps = {
    size?: number,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
}

export type SelectProps = {
    value: string,
    style?: DefaultView['props']['style']
    children?: React.ReactNode[] | React.ReactNode,
}

export type SelectGroupContextProps = {
    value: string[],
    addValue: (value: string) => void,
    removeValue: (value: string) => void,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
}

export type SelectGroupProps = {
    value?: string[],
    valueChange: (value: string[]) => void,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
    children?: React.ReactNode[] | React.ReactNode
}
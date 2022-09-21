import React, { useCallback, useState } from "react";
import { ColorValue, Pressable } from "react-native";
import { View } from "../components/View";
import { View as DefaultView } from "react-native";
import { useTheme } from "./Themed";

const RadioButtonContext = React.createContext<RadioButtonGroupProps>({
    value: '',
    valueChange: (_: string) => { }
});

export const RadioButtonGroup = (props: RadioButtonGroupProps) => {
    const [value, setValue] = useState(props.value)
    const valueChange = useCallback((value: string) => {
        setValue(value)
        props.valueChange(value)
    }, [])

    return (
        <RadioButtonContext.Provider value={{ value, valueChange, color: props.color ?? (useTheme() == 'dark' ? 'white' : 'black') }}>
            {props.children}
        </RadioButtonContext.Provider>
    )
}

export const RadioButton = (props: RadioButtonProps) => (
    <RadioButtonContext.Consumer >
        {({ color ,value, valueChange }) => (
            <Pressable onPress={() => valueChange(props.value)}>
                <View style={{ padding: 5, height: 25, aspectRatio: 1, borderRadius: 25, borderColor: color, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        props.value == value ?
                            <View style={{ height: 15, aspectRatio: 1, borderRadius: 25, backgroundColor: color }} />
                            : null
                    }
                </View>
            </Pressable>
        )}
    </RadioButtonContext.Consumer>
)

export type RadioButtonGroupProps = {
    value: string,
    valueChange: (value: string) => void,
    color?: ColorValue,
    children?: React.ReactNode[] | React.ReactNode
}

export type RadioButtonProps = {
    value: string,
    style?: DefaultView['props']
}

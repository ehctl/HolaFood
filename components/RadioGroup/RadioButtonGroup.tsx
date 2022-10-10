import React, { useCallback, useState } from "react";
import { ColorValue, Pressable } from "react-native";
import { View } from "../View";
import { View as DefaultView } from "react-native";
import { useTheme } from "../Themed";

export const RadioButtonContext = React.createContext<RadioButtonGroupProps>({
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


export type RadioButtonGroupProps = {
    value: string,
    valueChange: (value: string) => void,
    color?: ColorValue,
    children?: React.ReactNode[] | React.ReactNode
}
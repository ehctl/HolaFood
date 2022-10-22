import React, { useCallback, useState } from "react";
import { ColorValue } from "react-native";
import { useTheme } from "../Themed";

export const RadioButtonGroupContext = React.createContext<RadioButtonGroupProps>({
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


export type RadioButtonGroupProps = {
    value: string,
    valueChange: (value: string) => void,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
    children?: React.ReactNode[] | React.ReactNode
}
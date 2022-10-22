import React from "react";
import { ColorValue, Pressable } from "react-native";
import { View } from "../View";
import { View as DefaultView } from "react-native";
import { RadioButtonGroupContext } from "./RadioButtonGroup"
import { style } from "./style/index.css";

export const RadioButtonContext = React.createContext<{ isSelected: boolean }>({
    isSelected: false,
});

export const RadioButton = (props: RadioButtonProps) => {
    return (
        <RadioButtonGroupContext.Consumer >
            {({ value, valueChange }) => {
                return (
                    <RadioButtonContext.Provider value={{ isSelected: props.value == value }}>
                        <Pressable onPress={() => valueChange(props.value)} style={props.style}>
                            {props.children}
                        </Pressable>
                    </RadioButtonContext.Provider>
                )
            }}
        </RadioButtonGroupContext.Consumer>
    )
}

export type RadioButtonProps = {
    value: string,
    style?: DefaultView['props']['style']
    children?: React.ReactNode[] | React.ReactNode,
}

export const RadioButtonIcon = (props: RadioButtonIconProps) => (
    <RadioButtonGroupContext.Consumer >
        {({ defaultColor: outterColor, selectedColor: innerColor }) => (
            <View style={[style.outterCircle, { borderColor: props.defaultColor ?? outterColor, height: 5 * (props.size ?? 18) }]}>
                <RadioButtonContext.Consumer >
                    {({ isSelected }) => (
                        isSelected ?
                            <View style={[style.innerCircle, { backgroundColor: props.selectedColor ?? innerColor, height: 3 * (props.size ?? 18) }]} />
                            : null
                    )}
                </RadioButtonContext.Consumer >
            </View>
        )}
    </RadioButtonGroupContext.Consumer>
)

export type RadioButtonIconProps = {
    size?: number,
    defaultColor?: ColorValue,
    selectedColor?: ColorValue,
}


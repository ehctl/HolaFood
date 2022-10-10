import React from "react";
import { Pressable } from "react-native";
import { View } from "../View";
import { View as DefaultView } from "react-native";
import { RadioButtonContext } from "./RadioButtonGroup"

export const RadioButton = (props: RadioButtonProps) => (
    <RadioButtonContext.Consumer >
        {({ color, value, valueChange }) => (
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


export type RadioButtonProps = {
    value: string,
    style?: DefaultView['props']
}


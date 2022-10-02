import React from "react"
import { StyleSheet, TextInput as DefaultInput, TextInputProps } from "react-native"
import { getStyle } from "../utils/Utils"

export const TextInput = React.memo((props: TextInputProps) => {
    return <DefaultInput {...props} style={[getStyle().defaultTextInput, props.style]} placeholderTextColor='#47453e'/>
})

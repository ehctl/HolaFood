import { StyleSheet, TextInput as DefaultInput, TextInputProps } from "react-native"
import { getStyle } from "../Utils/Utils"

export const TextInput = (props: TextInputProps) => {
    return <DefaultInput {...props} style={[getStyle().defaultTextInput, props.style, style.defaultTextInput]}/>
}

const style = StyleSheet.create({
    defaultTextInput: {
        borderRadius: 20,
        backgroundColor: '#e6e8e7',
        borderWidth: 0,
        paddingHorizontal: 20
    }
})
import { ButtonProps, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { I18NText, Text } from "../Text"
import { Style } from "../../../assets/css/Style"
import Warehouse from "../../utils/Warehouse"
import { getStyle } from "../../utils/Utils"
import { FontAwesome } from "@expo/vector-icons"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { View } from "../View"
import React from "react"
import { style } from './style/index.css'

export const Button = React.memo((params: ButtonParams) => {
    return (
        <Pressable {...params} style={[getStyle().defaultButton, style.container, params.style]} accessibilityRole='button' >
            {
                params?.iconName ?
                    <FontAwesome name={params.iconName} style={style.icon} size={params?.iconSize ? params.iconSize : 20} color={params?.iconColor} />
                    : null
            }
            <View style={[{ flexGrow: 1, backgroundColor: 'transparent' }]}>
                <I18NText style={{ fontSize: params.textSize ? params.textSize : 16 }} text={params.text} />
            </View>
        </Pressable>
    )
})

export type ButtonParams = PressableProps & {
    text: string,
    textSize?: number,
    iconName?: FontAwesomeIconType,
    iconSize?: number,
    iconColor?: string
}

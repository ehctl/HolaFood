import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { useLayoutEffect } from "react"
import { FlatList } from "react-native-gesture-handler"
import { Level2Header } from "../../../base/Headers/Level2Header"
import { View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { RadioButtonGroup, RadioButton, RadioButtonIcon } from "../../../base/RadioGroup"
import { useDispatch } from "react-redux"
import { AppLanguage, changeLanguage } from "../../../redux/Reducer"
import { useLocale } from "../../../base/Themed"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Constant } from "../../../utils/Constant"

export const LanguageScreen = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch()
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShow: true,
            header: (_: NativeStackHeaderProps) => <Level2Header title="Language" />,
        })
    })

    const renderItem = ({ item }: any) => {
        return (
            <LanguageItem {...item} />
        )
    }

    return (
        <View style={{ flex: 1 }} >
            <RadioButtonGroup
                value={useLocale()}
                valueChange={(value: string) => {
                    AsyncStorage.setItem(Constant.APP_LOCALE, value)
                    dispatch(changeLanguage(value as AppLanguage))
                }}>
                <FlatList
                    contentContainerStyle={{}}
                    data={APP_SUPPORTED_LANGUAGE}
                    renderItem={renderItem}
                    keyExtractor={(_, i) => `LI_${i}`}
                />
            </RadioButtonGroup>
        </View>
    )
})

const LanguageItem = React.memo((item: SupportedLanguage) => {
    return (
        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                <RadioButton value={item.code} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text text={item.name} style={{ fontSize: 16 }} />
                    <RadioButtonIcon size={5} />
                </RadioButton>
            </View>
            <View style={{ height: 0.5, backgroundColor: 'grey' }} />
        </View>
    )
})

const APP_SUPPORTED_LANGUAGE: SupportedLanguage[] = [
    {
        name: "English",
        code: 'en'
    },
    {
        name: "Tiếng Việt",
        code: 'vi'
    },
]

type SupportedLanguage = {
    name: string,
    code: string
}
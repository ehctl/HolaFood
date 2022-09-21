import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { useLayoutEffect } from "react"
import { FlatList } from "react-native-gesture-handler"
import { Level2Header } from "../../components/Headers/Level2Header"
import { View } from "../../components/View"
import { Text } from "../../components/Text"
import { RadioButton, RadioButtonGroup } from "../../components/RadioButtonGroup"
import { useDispatch } from "react-redux"
import { AppLanguage, changeLanguage } from "../../redux/Reducer"
import { useLocale } from "../../components/Themed"
import React from "react"


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
        <View style={{flex: 1}} >
            <RadioButtonGroup
                value={useLocale()}
                valueChange={(value: string) => {
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 }}>
                <Text text={item.name} style={{ fontSize: 16 }} />
                <RadioButton value={item.code} />
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
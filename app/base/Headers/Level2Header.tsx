import { TransparentView, View } from "../View";
import { I18NText, Text } from "../Text";
import { Pressable } from 'react-native';
import { FontAwesome } from "../FontAwesome";
import { getStyle } from "../../utils/Utils";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "../View";

export const Level2Header = (props: Level2HeaderProps) => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={{ height: Level2HeaderStat.HEADER_MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Pressable style={{ position: 'absolute', left: 0, padding: 10, zIndex: 1 }}
                    onPress={() => {
                        navigation.goBack()
                        props.onBackPress?.()
                    }}>

                    <FontAwesome name="angle-left" size={35} />
                </Pressable>
                <TransparentView style={[getStyle().headerTitleCointainer]}>
                    <I18NText style={getStyle().headerTitle} text={props.title} />
                </TransparentView>
                {/* <Pressable style={{ backgroundColor: '#d4d4d4', borderRadius: 25, padding: 10, marginRight: 10 }}
                    onPress={() => {
                        navigation.navigate('Order' as never)
                    }} >
                    <FontAwesome name="shopping-cart" size={20} color='#d14fa6' />
                </Pressable> */}
            </TransparentView>
            {/* <View style={[getStyle().headerDivider, { backgroundColor: Colors[theme].text }]} /> */}
        </SafeAreaView>
    )
}

export type Level2HeaderProps = {
    title: string,
    onBackPress?: () => void,
}

export const Level2HeaderStat = {
    HEADER_MAX_HEIGHT: 60,
}
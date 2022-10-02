import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../utils/Utils";
import { Component } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "../../components/View";
import Colors from "../../constants/Colors";
import { useTheme } from "../Themed";

export const Level1Header = (props: Level1HeaderProps) => {
    const theme = useTheme()

    return (
        <SafeAreaView style={{ height: Level1HeaderStat.HEADER_MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={getStyle().headerContainer}>
                {
                    props.showIcon ?
                        <Pressable style={getStyle().headerLeftIcon} >
                            <FontAwesome name="bars" size={25} onPress={props.onLeftIconPress} />
                        </Pressable> : null
                }
                <View style={getStyle().headerTitleCointainer}>
                    <Text style={getStyle().headerTitle} text={props.title} />
                </View>
            </Animated.View>
            <View style={[getStyle().headerDivider, { backgroundColor: Colors[theme].text }]} />
        </SafeAreaView>
    )
}

export type Level1HeaderProps = {
    title: string,
    showIcon?: boolean | false,
    onLeftIconPress?: () => void,
}

export const Level1HeaderStat = {
    HEADER_MAX_HEIGHT: 40,
}




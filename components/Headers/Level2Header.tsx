import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { SafeAreaView } from 'react-native';
import {  Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../utils/Utils";

export const Level2Header = (props: Level2HeaderProps) => {
    return (
        <SafeAreaView>
            <View style={getStyle().headerContainer}>
                <Pressable style={getStyle().headerLeftIcon} onPress={props.onLeftIconPress}>
                    <FontAwesome name="angle-left" size={35} />
                </Pressable>
                <View style={getStyle().headerTitleCointainer}>
                    <Text style={getStyle().headerTitle} text={props.title} />
                </View>
            </View>
            {/* <View style={getStyle().headerDivider} /> */}
        </SafeAreaView>
    )
}

export type Level2HeaderProps = {
    title: string,
    onLeftIconPress?: () => void,
}
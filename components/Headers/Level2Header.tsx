import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../utils/Utils";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "../../components/View";

export const Level2Header = (props: Level2HeaderProps) => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={{ height: Level2HeaderStat.HEADER_MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <View style={getStyle().headerContainer}>
                <Pressable style={getStyle().headerLeftIcon}
                    onPress={() => {
                        navigation.goBack()
                        props.onBackPress?.()
                    }}>

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
    onBackPress?: () => void,
}

export const Level2HeaderStat = {
    HEADER_MAX_HEIGHT: 40,
}
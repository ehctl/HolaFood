import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { SafeAreaView } from 'react-native';
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../Utils/Utils";

export const Level1Header = (props: Level1HeaderProps) => {
    return (
        <SafeAreaView>
            <View style={getStyle().headerContainer}>
                {
                    props.showIcon ?
                        <Pressable style={getStyle().headerLeftIcon} >
                            <FontAwesome name="bars" size={25} onPress={props.onLeftIconPress} />
                        </Pressable> : null
                }
                <View style={getStyle().headerTitleCointainer}>
                    <Text style={getStyle().headerTitle} text={props.title} />
                </View>
            </View>
            {/* <View style={getStyle().headerDivider} /> */}
        </SafeAreaView>
    )
}

export type Level1HeaderProps = {
    title: string,
    showIcon?: boolean | false,
    onLeftIconPress?: () => void,
}
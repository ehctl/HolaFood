import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../utils/Utils";
import { Component } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "../../components/View";

export class Level1Header extends Component<Level1HeaderProps>{

    render() {
        return (
            <SafeAreaView style={{ height: Level1HeaderStat.HEADER_MAX_HEIGHT, justifyContent: 'center', alignItems: 'center'}}>
                <Animated.View style={getStyle().headerContainer}>
                    {
                        this.props.showIcon ?
                            <Pressable style={getStyle().headerLeftIcon} >
                                <FontAwesome name="bars" size={25} onPress={this.props.onLeftIconPress} />
                            </Pressable> : null
                    }
                    <View style={getStyle().headerTitleCointainer}>
                        <Text style={getStyle().headerTitle} text={this.props.title} />
                    </View>
                </Animated.View>
                {/* <View style={getStyle().headerDivider} /> */}
            </SafeAreaView>
        )
    }
}

export type Level1HeaderProps = {
    title: string,
    showIcon?: boolean | false,
    onLeftIconPress?: () => void,
}

export const Level1HeaderStat = {
    HEADER_MAX_HEIGHT: 50,
}




import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { SafeAreaView } from 'react-native';
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { getStyle } from "../../utils/Utils";
import { Component } from "react";
import Animated from "react-native-reanimated";

export class Level2Header extends Component<Level2HeaderProps>{
    render() {
        return (
            <SafeAreaView>
                <View style={getStyle().headerContainer}>
                    <Pressable style={getStyle().headerLeftIcon} onPress={this.props.onLeftIconPress}>
                        <FontAwesome name="angle-left" size={35} />
                    </Pressable>
                    <View style={getStyle().headerTitleCointainer}>
                        <Text style={getStyle().headerTitle} text={this.props.title} />
                    </View>
                </View>
                {/* <View style={getStyle().headerDivider} /> */}
            </SafeAreaView>
        )
    }
}

export type Level2HeaderProps = {
    title: string,
    onLeftIconPress?: () => void,
}

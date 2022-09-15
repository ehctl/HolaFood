import { View } from "../../components/View";
import { Text } from "../../components/Text";
import { SafeAreaView } from 'react-native';
import { Pressable } from 'react-native';
import { FontAwesome } from "../../components/FontAwesome";
import { Component, ReactNode } from "react";
import { getStyle } from "../../utils/Utils";


export class WebViewHeader extends Component<WebviewHeaderProps, WebviewHeaderState>{
    constructor(props: WebviewHeaderProps) {
        super(props);
        this.state = {
            title: props.title
        };
    }

    changeTitle(title: string) {
        this.setState({ title: title })
    }

    render(): ReactNode {
        return (
            <SafeAreaView>
                <View style={getStyle().headerContainer}>
                    <Pressable style={getStyle().headerLeftIcon} onPress={this.props.onLeftIconPress}>
                        <FontAwesome name="angle-down" size={28} />
                    </Pressable>
                    <View style={getStyle().headerTitleCointainer}>
                        <Text style={getStyle().headerTitle} text={this.state.title ? this.state.title : this.props.title} />
                    </View>
                    <Pressable style={getStyle().headerRightIcon} onPress={this.props.onRightIconPress}>
                        <FontAwesome name="rotate-left" size={20} />
                    </Pressable>
                </View>
                <View style={getStyle().headerDivider} />
            </SafeAreaView>
        )
    }
}

export type WebviewHeaderProps = {
    title: string,
    onLeftIconPress?: () => void,
    onRightIconPress?: () => void,
}

type WebviewHeaderState = {
    title: string
}
import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TransparentView, View } from "../View"
import { useNavigation } from '@react-navigation/native';
import React from "react"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType";
import { Text } from "../Text";


export const Level1Header = React.memo((props: HomeHeaderProp) => {
    const navigation = useNavigation()

    return (
        <View style={[style.container, { height: Level1HeaderStats.HEADER_MAX_HEIGHT }]}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 7 }}>
                <Text text={props.text} style={{ fontSize: 22, fontWeight: '700', color: props.textColor }} />
            </TransparentView>

            <TransparentView style={{ flexDirection: 'row' }}>
                {
                    props.leftIcons.map((value: FontAwesomeIconType, index: number) => (
                        <Pressable
                            key={index}
                            style={style.iconContainer}
                            onPress={() => {
                                navigation.navigate(props.leftIconsTarget[index] as never)
                            }} >
                            <FontAwesome name={value} size={20} color={props.leftIconsColor[index]} />
                        </Pressable>
                    ))
                }
            </TransparentView>
        </View>
    )
})

export type HomeHeaderProp = {
    text: string,
    textColor: string,
    leftIcons: FontAwesomeIconType[],
    leftIconsColor: string[],
    leftIconsTarget: string[]
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 5
    },
    iconContainer: {
        borderRadius: 25,
        backgroundColor: '#d4d4d4',
        padding: 10,
        marginRight: 5,
        marginLeft: 10
    }
})

export const Level1HeaderStats = {
    HEADER_MAX_HEIGHT: 60,
}

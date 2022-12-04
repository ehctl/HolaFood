import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TransparentView, View } from "../View"
import { useNavigation } from '@react-navigation/native';
import React from "react"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType";
import { I18NText, Text } from "../Text";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/Reducer";
import { isIosDevice } from "../../utils/Utils";


export const Level1Header = React.memo((props: HomeHeaderProp) => {
    const navigation = useNavigation()
    const appStateProps = useSelector((state: AppState) => ({
        cartItems: state.cartItems,
        orders: state.orders
    }))

    return (
        <View style={[style.container, { height: Level1HeaderStats.HEADER_MAX_HEIGHT }]}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 7 }}>
                <I18NText text={props.text} style={{ fontSize: 22, fontWeight: '700', color: props.textColor }} />
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
                            <TransparentView style={{ position: 'relative', margin: 10, }}>
                                {
                                    (appStateProps.cartItems.length + appStateProps.orders.length) > 0 && value == 'shopping-cart' ?
                                        <View
                                            style={{
                                                position: 'absolute', right: -13, top: -13, backgroundColor: '#029699',
                                                borderRadius: 20, padding: 3, zIndex: 1, aspectRatio: 1, height: 20, alignItems: 'center', justifyContent: 'center'
                                            }}>
                                            {/* <Text text={(appStateProps.cartItems.length + appStateProps.orders.length).toString()} style={{ fontWeight: '600', fontSize: isIosDevice() ? 10 : 8, color: 'white' }} /> */}
                                            <Text text={(appStateProps.cartItems.length + appStateProps.orders.length).toString()} style={{ fontWeight: '600', fontSize: isIosDevice() ? 10 : 8, color: 'white' }} />
                                        </View> : null
                                }
                                <FontAwesome name={value} size={20} color={props.leftIconsColor[index]} />
                            </TransparentView>

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
        marginRight: 5,
        marginLeft: 10
    }
})

export const Level1HeaderStats = {
    HEADER_MAX_HEIGHT: 60,
}

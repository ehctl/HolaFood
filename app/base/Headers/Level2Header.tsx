import { TransparentView, View } from "../View";
import { I18NText, Text } from "../Text";
import { Pressable } from 'react-native';
import { FontAwesome, FontAwesome1 } from "../FontAwesome";
import { getStyle, isIosDevice } from "../../utils/Utils";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "../View";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/Reducer";
import React from "react";

export const Level2Header = React.memo((props: Level2HeaderProps) => {
    const navigation = useNavigation()
    const appStateProps = useSelector((state: AppState) => ({
        cartItems: state.cartItems,
        orders: state.orders
    }))

    return (
        <SafeAreaView style={{ height: Level2HeaderStat.HEADER_MAX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Pressable style={{ position: 'absolute', left: 0, padding: 10, zIndex: 1 }}
                    onPress={() => {
                        navigation.goBack()
                        props.onBackPress?.()
                    }}>

                    {
                        props.isSlideFromBottom ?
                            <FontAwesome1 name="close" size={26} />
                            :
                            <FontAwesome name="angle-left" size={35} />
                    }
                </Pressable>
                <TransparentView style={[getStyle().headerTitleCointainer]}>
                    <I18NText style={getStyle().headerTitle} text={props.title} />
                </TransparentView>
                {
                    props.canNavigateToOrderScreen ?
                        <Pressable style={{ position: 'absolute', backgroundColor: '#d4d4d4', borderRadius: 25, right: 10 }}
                            onPress={() => {
                                navigation.navigate('Order' as never)
                            }} >
                            <TransparentView style={{ position: 'relative', margin: 10, }}>
                                {
                                    (appStateProps.cartItems.length) > 0 ?
                                        <View
                                            style={{
                                                position: 'absolute', right: -13, top: -13, backgroundColor: '#029699', borderRadius: 20,
                                                padding: 3, zIndex: 1, aspectRatio: 1, height: 20, alignItems: 'center', justifyContent: 'center'
                                            }}>

                                            <Text
                                                text={(appStateProps.cartItems.length).toString()}
                                                style={{ fontWeight: '600', fontSize: isIosDevice() ? 10 : 8, color: 'white' }} />
                                            {/* <Text
                                                text={(appStateProps.cartItems.length + appStateProps.orders.length).toString()}
                                                style={{ fontWeight: '600', fontSize: isIosDevice() ? 10 : 8, color: 'white' }} /> */}
                                        </View> : null
                                }
                                <FontAwesome name="shopping-cart" size={22} color='#d14fa6' style={{}} />
                            </TransparentView>
                        </Pressable> : null
                }
            </TransparentView>
            {/* <View style={[getStyle().headerDivider, { backgroundColor: Colors[theme].text }]} /> */}
        </SafeAreaView>
    )
})

export type Level2HeaderProps = {
    title: string,
    isSlideFromBottom?: boolean
    onBackPress?: () => void,
    canNavigateToOrderScreen?: boolean
}

export const Level2HeaderStat = {
    HEADER_MAX_HEIGHT: 60,
}
import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TransparentView, View } from "../View"
import { TransparentText } from "../Text"
import { useNavigation } from '@react-navigation/native';
import React from "react"

export const HomePageHeader = React.memo((props: HomeHeaderProp) => {
    const navigation = useNavigation()

    return (
        <View style={[style.container, { height: HomePageHeaderStat.HEADER_MAX_HEIGHT }]}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                <TransparentText text="HolaFood" style={{ fontSize: 22, fontWeight: '700', color: '#d9091f' }} />
            </TransparentView>

            <TransparentView style={{flexDirection: 'row'}}>
                <Pressable style={style.iconContainer}
                    onPress={() => {
                        navigation.navigate('Search' as never)
                    }} >
                    <FontAwesome name="search" size={20} color='#4666a6'/>
                </Pressable>
                <Pressable style={style.iconContainer}
                    onPress={() => {
                        navigation.navigate('Order' as never)
                    }} >
                    <FontAwesome name="shopping-cart" size={20} color='#d14fa6'/>
                </Pressable>
            </TransparentView>
        </View>
    )
})

export type HomeHeaderProp = {
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

export const HomePageHeaderStat = {
    HEADER_MAX_HEIGHT: 60,
}

import { View } from "../../../base/View"
import { I18NText } from "../../../base/Text"
import React from "react"
import { FoodDetailData } from "../FoodDetailScreen"
import { Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';



export const Order = React.memo((props: FoodDetailData) => {
    const navigation = useNavigation()
    return (
        <View>

            <Pressable
                style={{ backgroundColor: '#dea30d', paddingVertical: 15, borderRadius: 10, marginTop: 15 }}
                onPress={() => {
                    navigation.navigate('AddToCart' as never, { foodDetail: props } as never)
                }} >

                <I18NText text="Add To Cart" style={{ fontSize: 18, fontWeight: '500' }} />

            </Pressable>
        </View>
    )
})


export type OrderType = {

}
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { BText, I18NText, Text } from "../../../base/Text"
import { useCallback, useEffect, useState } from "react"
import { wait } from "../../../utils/Utils"
import { Image } from "../../../base/Image"
import React from "react"
import { ShopInfo } from "../ShopInfo.tsx"
import { FlatList } from "react-native-gesture-handler"
import { Pressable } from "react-native"
import { FontAwesome } from "../../../base/FontAwesome"
import { useNavigation } from '@react-navigation/native';
import { FoodDetailData } from "../../FoodDetail/FoodDetailScreen"


export const ShopFoodItem = (props: ShopFoodItemProps) => {
    const navigation = useNavigation()

    const navigateToFoodDetail = (id: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    return (
        <TransparentView style={{ flex: 1 / 2 }} >
            <View style={{
                flex: 1, marginVertical: 8,
                marginHorizontal: 10,
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'stretch',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: 'transparent'
            }}>
                <Pressable onPress={() => navigateToFoodDetail(props.data.id)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{
                            uri: props.data.productImgURL
                        }}
                        style={{ aspectRatio: 1, width: '100%', borderRadius: 15 }} />
                </Pressable>

                <Pressable
                    onPress={() => navigateToFoodDetail(props.data.id)}
                    style={{ flexGrow: 1, flexShrink: 1, marginVertical: 5, justifyContent: 'flex-start', alignItems: 'stretch' }}>

                    <Text text={props.data.productName} style={{ textAlign: 'left', fontWeight: '500', fontSize: 18, flexShrink: 1, marginTop: 5 }} />

                    <Text text={props.data.description} style={{ textAlign: 'left', fontSize: 14, flexShrink: 1, marginTop: 5 }} />
                </Pressable>
            </View>

            <TransparentView style={{ position: 'absolute', right: 15, top: 20 }}>
                {
                    props.data.isFavorite ?
                        <FontAwesome name="bookmark" size={30} color='orange' />
                        : null
                }
            </TransparentView>

            <TransparentView style={{ height: 1, backgroundColor: 'azure', marginHorizontal: 20 }} />
        </TransparentView>
    )
}

export type ShopFoodItemProps = {
    data: FoodDetailData
}
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { BText, I18NText, Text } from "../../../base/Text"
import { DUMMY_TYPE } from "../../Home/DummyData"
import { useCallback, useEffect, useState } from "react"
import { wait } from "../../../utils/Utils"
import { Image } from "../../../base/Image"
import React from "react"
import { ShopInfo } from "../ShopInfo.tsx"
import { FlatList } from "react-native-gesture-handler"
import { Pressable } from "react-native"
import { FontAwesome } from "../../../base/FontAwesome"
import { useNavigation } from '@react-navigation/native';


export const ShopFoodItem = (props: ShopFoodItemProps) => {
    const navigation = useNavigation()

    const navigateToFoodDetail = (id: string) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    return (
        <TransparentView style={{ flex: 1 }} >
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
                            uri: 'https://img.freepik.com/premium-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000'
                        }}
                        style={{ aspectRatio: 1, width: '100%', borderRadius: 15 }} />
                </Pressable>

                <Pressable
                    onPress={() => navigateToFoodDetail(props.data.id)}
                    style={{ flexGrow: 1, flexShrink: 1, marginVertical: 5, justifyContent: 'center', alignItems: 'stretch' }}>

                    <Text text={props.data.title} numberOfLines={2} style={{ flexGrow: 1, textAlign: 'left', fontWeight: '500', fontSize: 20, flexShrink: 1, marginTop: 5 }} />

                    <Text text={'Ngon ngon ngon'} numberOfLines={3} style={{ textAlign: 'left', fontSize: 16, flexShrink: 1, marginTop: 5 }} />
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
    data: DUMMY_TYPE
}
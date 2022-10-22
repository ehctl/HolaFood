import { Pressable } from "react-native"
import { FontAwesome } from "../../../base/FontAwesome"
import { BText } from "../../../base/Text"
import { TransparentView, TransparentView as View, View as DefaultView } from "../../../base/View"
import { Image as DefaultImage, Dimensions } from 'react-native';
import React from "react";
import { ItemType } from "../HomeFoodList";
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'
import { Image } from "../../../base/Image";

export const FoodItem = React.memo((item: ItemType) => {
    const navigation = useNavigation()

    const navigateToFoodDetail = (id: string) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    const navigateToShopDetail = (id: string) => {
        navigation.navigate('ShopDetail' as never, { itemId: id } as never)
    }

    return (
        <TransparentView style={{ flex: 1 }} >
            <View style={{
                flex: 1, flexDirection: 'row', paddingLeft: 10, marginVertical: 8,
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
                <Pressable onPress={() => navigateToFoodDetail(item.id)}>
                    <Image
                        source={{
                            uri: 'https://img.freepik.com/premium-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000'
                        }}
                        style={{ aspectRatio: 1, width: 125, borderRadius: 15 }} />
                </Pressable>

                <TransparentView style={{ flexGrow: 1, flexShrink: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 5, flexShrink: 1 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="shield" size={14} style={{ marginRight: 5 }} color='#7044b3' />
                        </View>
                        <BText text="Openning" style={{ color: '#7044b3', fontSize: 14, flexShrink: 1 }} />
                    </View>

                    <Pressable
                        onPress={() => navigateToFoodDetail(item.id)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="chevron-up" size={14} style={{ marginRight: 5 }} color='#97a842' />
                        </View>
                        <BText text={item.title} numberOfLines={2} style={{ textAlign: 'left', fontWeight: '500', fontSize: 20, flexShrink: 1 }} />
                    </Pressable>

                    <Pressable
                        onPress={() => navigateToShopDetail(item.shopName)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="home" size={14} style={{ marginRight: 5 }} color='#422475' />
                        </View>
                        <BText text={item.shopName} numberOfLines={2} style={{ textAlign: 'left', opacity: 0.7, fontSize: 18, flexShrink: 1 }} />
                    </Pressable>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, alignItems: 'center' }}>
                            <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                        </View>
                        <BText text={item.address} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7, flexShrink: 1 }} />
                    </View>

                </TransparentView>
                <View style={{ width: 30, flexDirection: 'row' }}>
                    {
                        item.isFavorite ?
                            <FontAwesome name="bookmark" size={20} color='orange' />
                            : null
                    }
                </View>
            </View>
            <DefaultView style={{ height: 1, backgroundColor: 'azure', marginHorizontal: 20 }} />
        </TransparentView>
    )
})

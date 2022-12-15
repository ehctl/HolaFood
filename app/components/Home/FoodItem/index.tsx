import { Pressable } from "react-native"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { BText } from "../../../base/Text"
import { TransparentView, TransparentView as View, View as DefaultView } from "../../../base/View"
import { Image as DefaultImage, Dimensions } from 'react-native';
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Image } from "../../../base/Image";
import { FoodDetailData } from "../../FoodDetail/FoodDetailScreen";
import { Text } from "../../../base/Text";
import { formatMoney } from "../../../utils/Utils";


export const FoodItem = React.memo((item: FoodItemType) => {
    const navigation = useNavigation()

    const navigateToFoodDetail = (id: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    return (
        <TransparentView style={{ flex: 1 }} >
            <View style={{
                flex: 1, flexDirection: 'row', paddingLeft: 10, marginVertical: 8,
                justifyContent: 'center', alignItems: 'center',
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
                <Pressable onPress={() => navigateToFoodDetail(item.data.id)} style={{ position: 'relative' }}>
                    <Image
                        source={{
                            uri: item.data.productImgURL
                        }}
                        style={{ aspectRatio: 1, width: 125, borderRadius: 15 }} />
                    <View style={{ position: 'absolute', width: 30, flexDirection: 'row', alignSelf: 'flex-start', top: 0, right: -10 }}>
                        {
                            item.data.isFavorite ?
                                <FontAwesome name="bookmark" size={20} color='orange' />
                                : null
                        }
                    </View>
                </Pressable>

                <TransparentView style={{ flexGrow: 1, flexShrink: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>

                    <Pressable
                        onPress={() => navigateToFoodDetail(item.data.id)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome2 name="rice-bowl" size={14} style={{ marginRight: 5 }} color='#97a842' />
                        </View>
                        <Text text={item.data.productName.trim()} style={{ textAlign: 'left', fontWeight: '500', fontSize: 20, flexShrink: 1 }} />
                    </Pressable>

                    <Pressable
                        onPress={() => navigateToShopDetail(item.data.shopID)}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="home" size={14} style={{ marginRight: 5 }} color='#422475' />
                        </View>
                        <Text text={item.data.shopName.trim()} style={{ textAlign: 'left', opacity: 0.7, fontSize: 18, flexShrink: 1 }} />
                    </Pressable>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, alignItems: 'center' }}>
                            <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                        </View>
                        <Text text={item.data.shopAddress.trim()} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7, flexShrink: 1 }} />
                    </View>

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, alignItems: 'center' }}>
                            <FontAwesome name="dollar" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                        </View>
                        <Text text={formatMoney(item.data.sellPrice) + ' đ'} style={{ fontSize: 18, textAlign: 'left', color: '#cc1818', fontWeight: '500', opacity: 0.7, flexShrink: 1 }} />
                    </TransparentView>

                </TransparentView>

            </View>

            {
                item.hideDivider ?
                    null
                    : <DefaultView style={{ height: 2, backgroundColor: 'grey', marginHorizontal: 10, marginTop: 10 }} />
            }
        </TransparentView>
    )
})


export type FoodItemType = {
    data: FoodDetailData,
    hideDivider?: boolean
}
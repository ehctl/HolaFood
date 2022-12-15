import { Pressable } from "react-native"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { TransparentView, TransparentView as View, View as DefaultView } from "../../../base/View"
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Image } from "../../../base/Image";
import { FoodDetailData } from "../../FoodDetail/FoodDetailScreen";
import { Text } from "../../../base/Text";
import { formatMoney } from "../../../utils/Utils";
import { ShopData } from "../../ShopDetail/ShopInfo.tsx";


export const ShopItem = React.memo((item: ShopItemType) => {
    const navigation = useNavigation()

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
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
                backgroundColor: 'transparent',
                flexShrink: 1
            }}>
                <Pressable onPress={() => navigateToShopDetail(item.data.id)}>
                    <Image
                        source={{
                            uri: item.data.urlImg
                        }}
                        style={{ aspectRatio: 1, width: 70, borderRadius: 15 }} />
                </Pressable>

                <Pressable
                    style={{ flexGrow: 1, flexShrink: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}
                    onPress={() => navigateToShopDetail(item.data.id)} >
                        
                    <TransparentView
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome2 name="home" size={14} style={{ marginRight: 5 }} color='#97a842' />
                        </View>
                        <Text text={item.data.shopName} style={{ textAlign: 'left', fontWeight: '500', fontSize: 20, flexShrink: 1 }} />
                    </TransparentView>


                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, alignItems: 'center' }}>
                            <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                        </View>
                        <Text text={item.data.shopAddress} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7, flexShrink: 1 }} />
                    </View>
                </Pressable>

            </View>

            {
                item.hideDivider ?
                    null
                    : < DefaultView style={{ height: 2, backgroundColor: 'grey', marginHorizontal: 10, marginTop: 10 }} />
            }
        </TransparentView>
    )
})


export type ShopItemType = {
    data: ShopData,
    hideDivider: boolean
}
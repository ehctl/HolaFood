import React, { useCallback, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "../../../base/Button"
import { TransparentView, View } from "../../../base/View"
import { addOrders, AppState, deleteCartItems } from "../../../redux/Reducer"
import { FoodDetailData, FoodOptionType } from "../../FoodDetail/FoodDetailScreen"
import { I18NText, Text } from "../../../base/Text"
import { Alert, FlatList, ListRenderItemInfo, RefreshControl } from "react-native"
import { OrderStatus } from "../OrderItem"
import { OrderItemShimmer } from "../OrderItemShimmer"
import { SelectGroup } from "../../../base/SellectGroup"
import { AddToCartScreen } from "../../FoodDetail/AddToCartScreen"
import { CartItem } from "./CartItem"
import { useDispatch } from "react-redux"
import { PopupModal } from "../../../base/PopupModal"
import { useLanguage } from "../../../base/Themed"
import { formatCreatedDateType } from "../../../utils/Utils"


export const Cart = React.memo(({ navigation }: any) => {
    const appStateProps = useSelector((state: AppState) => ({
        cartItems: state.cartItems
    }))
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedCartItems, setSelectedCartItems] = useState([])

    const I18NCancel = useLanguage('Cancel')
    const I18NOrder = useLanguage('Order')
    const I18NSelectFood = useLanguage('Please Select Some Food To Order')
    const I18NOk = useLanguage('Ok')

    const renderItems = ({ item }: ListRenderItemInfo<CartItemData>) => {
        return (
            <CartItem item={item} />
        )
    }

    const renderLoadMore = () => {
        return (
            <OrderItemShimmer visible={loading || refreshing} />
        )
    }

    // const categorizeNewOrders = useCallback((arr: number[]): CartItemData[][] => {
    //     if (arr.length == 0)
    //         return []

    //     const hashMap = {}
    //     const dict = {}

    //     appStateProps.cartItems.forEach((item, _) => {
    //         hashMap[item.id] = item
    //     })

    //     arr.forEach((v, _) => {
    //         if (hashMap[v]) {
    //             if (dict[hashMap[v].productDetail.shopID]) {
    //                 dict[hashMap[v].productDetail.shopID].push(hashMap[v])
    //             }
    //             else {
    //                 dict[hashMap[v].productDetail.shopID] = [hashMap[v]]
    //             }
    //         }
    //     })

    //     return Object.values(dict)
    // }, [appStateProps.cartItems])

    const getListSelectedItems = useCallback(() => {
        const hashMap = {}
        appStateProps.cartItems.forEach((i) => {
            hashMap[i.id] = i
        })

        return selectedCartItems.map((i) => hashMap[i])
    }, [selectedCartItems])

    const onOrder = useCallback(() => {
        if (selectedCartItems.length == 0) {
            Alert.alert(
                I18NOrder,
                I18NSelectFood,
                [
                    {
                        text: I18NCancel,
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: I18NOk, onPress: () => { appStateProps.cartItems.length == 0 ? navigation.navigate('FoodList' as never) : null}}
                ]
            );
        } else {
            const orders = getListSelectedItems()

            navigation.navigate('AddToOrder' as never, {
                cartItems: orders
            })
        }
    }, [selectedCartItems, appStateProps.cartItems])

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 5 }}>
            <SelectGroup valueChange={(v) => { setSelectedCartItems(v) }}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {
                                // setRefreshing(true); wait(2000).then(() => setRefreshing(false)) 
                            }}
                        />
                    }
                    renderItem={renderItems}
                    data={appStateProps.cartItems}
                    keyExtractor={(_, index) => `${index}`}
                    ListEmptyComponent={<I18NText text='Did not have new orders' />}
                    ListFooterComponent={() => renderLoadMore()} />
            </SelectGroup>

            <TransparentView>
                <Button
                    text="Order"
                    textSize={15}
                    style={{
                        marginHorizontal: 10, borderRadius: 10, marginBottom: 5, marginTop: 15
                    }}
                    onPress={() => onOrder()} />
            </TransparentView>
        </View>
    )
})

export type CartItemData = {
    id: number,
    productDetail: FoodDetailData,
    quantity: number,
    option: FoodOptionType[],
    price: number,
    note: string,
}

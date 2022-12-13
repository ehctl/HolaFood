import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "../../../base/Button"
import { TransparentView, View } from "../../../base/View"
import { AppState, setCartItems } from "../../../redux/Reducer"
import { FoodDetailData, FoodOptionType } from "../../FoodDetail/FoodDetailScreen"
import { BText, I18NText } from "../../../base/Text"
import { Alert, FlatList, ListRenderItemInfo, Pressable, RefreshControl } from "react-native"
import { SelectGroup } from "../../../base/SellectGroup"
import { CartItem } from "./CartItem"
import { useDispatch } from "react-redux"
import { useLanguage } from "../../../base/Themed"
import { getCartItems } from "../../../core/apis/Requests"
import { CartItemShimmer } from "./CartItemShimmer.tsx"
import { Constant } from "../../../utils/Constant"
import { useToast } from "../../../base/Toast"


export const Cart = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch()
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

    const showToast = useToast()

    const renderItems = ({ item }: ListRenderItemInfo<CartItemData>) => {
        return (
            <CartItem item={item} />
        )
    }

    const renderLoadMore = () => {
        return (
            <CartItemShimmer visible={loading || refreshing} />
        )
    }

    const fetchData = useCallback(() => {
        getCartItems(
            (response) => {
                const data = response.data.map((i) => mapCartItemFromResponse(i))
                dispatch(setCartItems(data))
                setRefreshing(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setRefreshing(false)
            }
        )
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setSelectedCartItems([])
        dispatch(setCartItems([]))
        fetchData()
    }, [setSelectedCartItems])

    useEffect(() => {
        fetchData()
    }, [])

    const getListSelectedItems = useCallback(() => {
        const hashMap = {}
        const output = []
        appStateProps.cartItems.forEach((i) => {
            hashMap[i.id] = i
        })

        selectedCartItems.forEach((i) => {
            if (hashMap[i])
                output.push(hashMap[i])
        })

        return output
    }, [selectedCartItems, appStateProps.cartItems])

    const onOrder = useCallback(() => {
        const orders = getListSelectedItems()

        if (orders.length == 0) {
            Alert.alert(
                I18NOrder,
                I18NSelectFood,
                [
                    {
                        text: I18NCancel,
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: I18NOk, onPress: () => { appStateProps.cartItems.length == 0 ? navigation.navigate('FoodList' as never) : null } }
                ]
            );
        } else {
            const orders = getListSelectedItems()

            navigation.navigate('AddToOrder' as never, {
                cartItems: orders,
                usingNewCartItem: false
            })
        }
    }, [selectedCartItems, appStateProps.cartItems, getListSelectedItems])

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 5, position: 'relative' }}>
            <TransparentView style={{ marginBottom: 40, flex: 1 }}>
                <SelectGroup valueChange={(v) => { setSelectedCartItems(v) }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => onRefresh()}
                            />
                        }
                        renderItem={renderItems}
                        data={appStateProps.cartItems}
                        keyExtractor={(_, index) => `${index}`}
                        ListEmptyComponent={!(loading || refreshing) ? <I18NText text='Did not have new orders' /> : null}
                        ListFooterComponent={() => renderLoadMore()} />
                </SelectGroup>
            </TransparentView>

            <Pressable
                style={{ position: 'absolute', bottom: 0, right: 0, left: 0, backgroundColor: '#e8be41', paddingHorizontal: 10, paddingVertical: 5, height: 40, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => onOrder()}>

                <BText text="Order" style={{ fontSize: 16, fontWeight: '500' }} />
            </Pressable>
        </View>
    )
})

export const mapCartItemFromResponse = (cart): CartItemData => {
    const item = {
        id: cart.id,
        productDetail: cart.productDetail,
        quantity: cart.quantity,
        option: cart.option ?? [],
        price: cart.price,
        note: cart.note ?? ''
    }

    item.productDetail.option = cart.defaultOption

    return item
}

export type CartItemData = {
    id: number,
    productDetail: FoodDetailData,
    quantity: number,
    option: FoodOptionType[],
    price: number,
    note: string,
}

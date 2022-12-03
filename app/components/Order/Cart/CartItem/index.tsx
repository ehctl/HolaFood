import React, { useState } from "react";
import { BText, I18NText } from "../../../../base/Text";
import { TransparentView, View } from "../../../../base/View";
import { FoodDetailData } from "../../../FoodDetail/FoodDetailScreen"
import { ActivityIndicator, Alert, Image } from 'react-native';
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useCallback } from "react";
import { Select, SelectIcon } from "../../../../base/SellectGroup";
import { useLanguage } from "../../../../base/Themed";
import { FontAwesome, FontAwesome1 } from "../../../../base/FontAwesome";
import { CartItemData } from "..";
import { deleteCartItems } from "../../../../redux/Reducer";
import { useDispatch } from "react-redux";
import { formatMoney } from "../../../../utils/Utils";
import { deleteCart } from "../../../../core/apis/Requests";
import { Text } from "../../../../base/Text";
import { Constant } from "../../../../utils/Constant";
import { useToast } from "../../../../base/Toast";

export const CartItem = (props: CartItemType) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const I18NCart = useLanguage('Cancel')
    const I18NDelete = useLanguage('Delete')
    const I18NDeleteCartItem = useLanguage('Delete Item In Cart')
    const I18NDeleteCartItemConfirm = useLanguage('Do you want to delete this item from cart?')

    const [deletingCart, setDeletingCart] = useState(false)

    const showToast = useToast()

    const onDeletingCart = useCallback((id: number) => {
        setDeletingCart(true)
        deleteCart(
            id,
            (response) => {
                dispatch(deleteCartItems([id]))
                setDeletingCart(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setDeletingCart(false)
            }
        )
    }, [])

    const openAlert = useCallback((id: number) => {
        Alert.alert(
            I18NDeleteCartItem,
            I18NDeleteCartItemConfirm,
            [
                {
                    text: I18NCart,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: I18NDelete, onPress: () => onDeletingCart(id) }
            ]
        );
    }, [])

    return (
        <View style={{ borderRadius: 15, marginHorizontal: 5, padding: 5, marginBottom: 10 }}>
            <TransparentView
                style={{ width: '100%', alignItems: 'flex-end' }}>
                <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator
                        animating={deletingCart}
                        color='black'
                        style={{ marginRight: 20 }} />

                    <Pressable
                        onPress={() => {
                            navigation.navigate('AddToCart' as never, { isUpdateMode: true, cartItemDetail: props.item } as never)
                        }}>
                        <FontAwesome
                            style={{ paddingHorizontal: 5, paddingBottom: 5, marginRight: 20 }}
                            name="pencil"
                            size={15} />
                    </Pressable>
                    <Pressable
                        onPress={() => openAlert(props.item.id)}>
                        <FontAwesome1
                            name="close" size={18}
                            style={{ paddingHorizontal: 5, paddingBottom: 5 }} />
                    </Pressable>
                </TransparentView>
            </TransparentView>

            <TransparentView style={{ flexDirection: 'row' }}>
                <Select value={props.item.id} style={{ justifyContent: 'center' }}>
                    <TransparentView>
                        <SelectIcon size={5} defaultColor='#37a0ad' selectedColor='#3fb536' />
                    </TransparentView>
                </Select>

                <CartInnerItem {...props} />
            </TransparentView>

            <View style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />
        </View>
    )
}

export const CartInnerItem = (props: CartItemType) => {
    const navigation = useNavigation()
    const I18NOption = useLanguage('Option')

    const navigateToFoodDetail = useCallback((itemId: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: itemId } as never)
    }, [])

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    return (
        <TransparentView style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Pressable
                onPress={() => { navigateToFoodDetail(props.item.productDetail.id) }}
                style={{ justifyContent: 'center', marginLeft: 10 }}>
                
                <Image source={{ uri: props.item.productDetail.productImgURL }} style={{ height: 125, aspectRatio: 1, borderRadius: 10 }} />
            </Pressable>

            <TransparentView style={{ marginHorizontal: 10, flexGrow: 1, flexShrink: 1 }}>
                <Pressable onPress={() => { navigateToFoodDetail(props.item.productDetail.id) }}>
                    <Text text={props.item.productDetail.productName.trim()} style={{ textAlign: 'left', fontSize: 20 }} numberOfLines={2} />
                </Pressable>

                <Pressable
                    style={{ marginTop: 5 }}
                    onPress={() => { navigateToShopDetail(props.item.productDetail.shopID) }}>
                    <Text text={props.item.productDetail.shopName.trim()} style={{ fontSize: 16, paddingRight: 5, fontWeight: '500', textAlign: 'left' }} numberOfLines={2} />
                </Pressable>

                {
                    props.item.option.length !== 0 ?
                        <TransparentView style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text
                                text={`${I18NOption}: ${props.item.option.map((item) => ' ' + item.optionName)}`}
                                style={{ fontSize: 16, flexShrink: 1, textAlign: 'left' }}
                                numberOfLines={5} />
                        </TransparentView> : null
                }

                <TransparentView style={{ flexDirection: 'row', marginTop: 8 }}>
                    <I18NText text="Quantity" style={{ fontSize: 16 }} />
                    <Text text={`: ${props.item.quantity}`} style={{ fontSize: 16 }} />
                </TransparentView>

                {
                    props.item.note.length != 0 ?
                        <TransparentView style={{ flexDirection: 'row', marginTop: 8 }}>
                            <I18NText text="Note" />
                            <Text text={`: ${props.item.note}`} style={{}} />
                        </TransparentView> : null
                }

                <TransparentView style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text text={`${formatMoney(props.item.price)} đ`} style={{ color: '#f50045', fontWeight: '500', fontSize: 18 }} />
                </TransparentView>

            </TransparentView>
        </TransparentView >
    )
}

export type CartItemType = {
    item: CartItemData,
}
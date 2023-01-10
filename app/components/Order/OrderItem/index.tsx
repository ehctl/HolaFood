import React, { useCallback, useState } from "react";
import { TransparentView, View } from "../../../base/View";
import { CartItemData } from "../Cart";
import { I18NText, Text } from "../../../base/Text";
import { ActivityIndicator, Alert, Linking, Pressable } from "react-native";
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { formatDateTimeFromData, formatMoney, openMapUtil } from "../../../utils/Utils";
import { MaterialIconType } from "../../../constants/MaterialIconType";
import { updateOrder } from "../../../core/apis/Requests";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addOrders, addOrderToOrderQueue, AppState, removeOrder, removeOrderFromOrderQueue } from "../../../redux/Reducer";
import { useLanguage } from "../../../base/Themed";
import { updateOrder as updateOrderAction } from "../../../redux/Reducer";
import { Constant } from "../../../utils/Constant";
import { useToast } from "../../../base/Toast";
import { Entypo } from "@expo/vector-icons";
import { getOrderStatusIcon, getOrderStatusMsg, OrderStatus } from "../OrderUtils";
import { add } from "react-native-reanimated";

export const OrderItem = React.memo((props: OrderItemType) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const appStateProps = useSelector((state: AppState) => ({
        userType: state.userType,
        addressList: state.userAddressList
    }))

    const [finishingOrder, setFinishingOrder] = useState(false)
    const [cancelingOrder, setCancelingOrder] = useState(false)
    const [shippingOrder, setShippingOrder] = useState(false)

    const I18NOrder = useLanguage('Orders')
    const I18NCancel = useLanguage('Cancel')
    const I18NCancelOrderConfirm = useLanguage('Are you want to cancel shipping this order?')
    const I18NCancelOrder = useLanguage('Cancel Order')
    const I18NAcceptOrderConfirm = useLanguage('Are you want to accept this order?')
    const I18NAcceptOrder = useLanguage('Accept Order')
    const I18NShipOrderConfirm = useLanguage('Are you shipping this order?')
    const I18NShipOrder = useLanguage('Ship Order')
    const I18NFinishOrderConfirm = useLanguage('Are you want to finish this order?')
    const I18NFinishOrder = useLanguage('Finish Order')
    const I18NShipTo = useLanguage('Ship To')
    const I18NShopAddress = useLanguage('Shop Address')
    const I18NAddress = useLanguage('Address')
    const I18NView = useLanguage('View')
    const I18NAddressConfirm = useLanguage('Do you want to view this address in maps application?')

    const I18NOrderStatus = useLanguage(getOrderStatusMsg(props.item.status))

    const showToast = useToast()

    const navigateToOrderDetail = useCallback((data: OrderData) => {
        navigation.navigate('OrderDetail' as never, { orderId: data.id } as never)
    }, [])

    const openMap = useCallback((address: string, startAddress?: string) => {
        Alert.alert(
            I18NAddress,
            I18NAddressConfirm,
            [
                {
                    text: I18NCancel,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: I18NView, onPress: async () => {
                        await openMapUtil(address, startAddress)
                    }
                }
            ]
        )
    }, [showToast])

    const onFinishOrder = useCallback((orderId: number) => {
        setFinishingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.DONE,
            (response) => {
                dispatch(removeOrder(orderId))
                setFinishingOrder(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setFinishingOrder(false)
            }
        )
    }, [])

    const onCancelShipOrder = useCallback((orderId: number) => {
        setCancelingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.READY_TO_BE_SHIPPED,
            (response) => {
                const item = { ...props.item }
                item.status = 2
                dispatch(removeOrder(item.id))
                dispatch(addOrderToOrderQueue([item]))
                setCancelingOrder(false)
            },
            (e) => {
                console.log('Error' + e)
                showToast(Constant.API_ERROR_OCCURRED)
                setCancelingOrder(false)
            }
        )
    }, [props.item])

    const onAcceptOrder = useCallback((orderId: number) => {
        setShippingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP,
            (response) => {
                const item = { ...props.item }
                item.status = 6
                dispatch(removeOrderFromOrderQueue(orderId))
                dispatch(addOrders([item]))
                setShippingOrder(false)
            },
            (e) => {
                console.log('Error' + e)
                showToast(Constant.API_ERROR_OCCURRED)
                setShippingOrder(false)
            }
        )
    }, [props.item])

    const onShipOrder = useCallback((orderId: number) => {
        setShippingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.PROGRESSING,
            (response) => {
                const item = { ...props.item }
                item.status = 3
                dispatch(updateOrderAction(item))
                setShippingOrder(false)
            },
            (e) => {
                console.log('Error' + e)
                showToast(Constant.API_ERROR_OCCURRED)
                setShippingOrder(false)
            }
        )
    }, [props.item])



    const confirm = useCallback((orderId: number, orderStatus: number) => {
        switch (orderStatus) {
            case OrderStatus.READY_TO_BE_SHIPPED:
                Alert.alert(
                    I18NOrder,
                    I18NCancelOrderConfirm,
                    [
                        {
                            text: I18NCancel,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: I18NCancelOrder, onPress: () => onCancelShipOrder(orderId) }
                    ]
                )
                break
            case OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP:
                Alert.alert(
                    I18NOrder,
                    I18NAcceptOrderConfirm,
                    [
                        {
                            text: I18NCancel,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: I18NAcceptOrder, onPress: () => onAcceptOrder(orderId) }
                    ]
                )
                break
            case OrderStatus.PROGRESSING:
                Alert.alert(
                    I18NOrder,
                    I18NShipOrderConfirm,
                    [
                        {
                            text: I18NCancel,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: I18NShipOrder, onPress: () => onShipOrder(orderId) }
                    ]
                )
                break
            case OrderStatus.DONE:
                Alert.alert(
                    I18NOrder,
                    I18NFinishOrderConfirm,
                    [
                        {
                            text: I18NCancel,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: I18NFinishOrder, onPress: () => onFinishOrder(orderId) }
                    ]
                )
                break
            case OrderStatus.CANCELED:
                props?.cancelOrderCallback(orderId)
                break
        }
    }, [onShipOrder, onFinishOrder, props?.cancelOrderCallback])

    return (
        <Pressable
            onPress={() => navigateToOrderDetail(props.item)}
            style={{ borderRadius: 15, marginHorizontal: 5, padding: 10, marginBottom: 10 }}>

            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TransparentView style={{ flexShrink: 1 }}>
                    <TransparentView style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <FontAwesome1 name='tagso' size={20} color='#37942b' />
                        <I18NText text='Order Tag' style={{ marginLeft: 5 }} />
                        <Text text={`: ${props.item.id}`} style={{ marginLeft: 5 }} />
                    </TransparentView>

                    <TransparentView
                        style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', borderRadius: 10, marginTop: 5, flexShrink: 1 }}>
                        <FontAwesome2 name={getOrderStatusIcon(props.item.status)} size={20} color='#995050' />
                        <Text
                            text={I18NOrderStatus + (props?.showOrderDate == false ? '' : ' · ' + formatDateTimeFromData(props.item.createdDate))}
                            style={{ flexShrink: 1, marginLeft: 5, textAlign: 'left' }} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Entypo name='shop' size={20} color='#3179cc' />
                        <Text
                            style={{ marginLeft: 5, textAlign: 'left', fontSize: 22, fontWeight: '500', flexShrink: 1 }}
                            text={props.item.items[0].productDetail.shopName} />

                    </TransparentView>

                    <TransparentView style={{ marginTop: 5 }}>
                        {
                            props.item.items.map((i, index) => (
                                <OrderItemCell
                                    key={'order_item_cell' + index}
                                    {...i} />
                            ))
                        }
                    </TransparentView>

                    <TransparentView style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            text={`${formatMoney(props.item.price + props.item.shipFeeWithShopPolicy)} đ`}
                            style={{ textAlign: 'left', color: 'red', fontSize: 18, fontWeight: '500' }} />
                    </TransparentView>


                    {
                        appStateProps.userType == 'shipper' ?
                            <TransparentView>
                                <TransparentView>
                                    <Pressable
                                        onPress={() => openMap(props.item.items[0].productDetail.shopAddress)}
                                        style={{ flexDirection: 'row', flexShrink: 1, marginTop: 10 }}>
                                        <Text text={I18NShopAddress + ': ' + props.item.items[0].productDetail.shopAddress}
                                            style={{ textAlign: 'left', fontSize: 16, flexShrink: 1, fontWeight: '500' }} />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => openMap(
                                            appStateProps.addressList.filter((i) => i.address == props.item.address)?.[0]?.formatted_address ?? props.item.address,
                                            props.item.items[0].productDetail.shopAddress
                                        )}
                                        style={{ flexDirection: 'row', flexShrink: 1, marginTop: 5 }}>
                                        <Text text={I18NShipTo + ': ' + props.item.address}
                                            style={{ textAlign: 'left', fontSize: 16, flexShrink: 1, fontWeight: '500' }} />
                                    </Pressable>

                                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginTop: 5 }}>
                                        <I18NText text={'Shipping Cost Receive'} style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} />
                                        <Text text=': ' style={{ fontSize: 18 }} />
                                        <Text text={formatMoney(props.item.shipFee) + ' đ'} style={{ textAlign: 'left', color: 'red', fontSize: 18, flexShrink: 1, fontWeight: '500' }} />
                                    </TransparentView>
                                    <Pressable
                                        onPress={() => Linking.openURL(`tel:${props.item.phone}`)}
                                        style={{ flexDirection: 'row', flexShrink: 1, marginTop: 5 }}>
                                            
                                        <I18NText text='Phone Number' style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} />
                                        <Text text={': ' + props.item.phone} style={{ textAlign: 'left', fontSize: 18, flexShrink: 1, fontWeight: '500' }} />
                                    </Pressable>
                                </TransparentView>
                            </TransparentView>
                            : null
                    }
                </TransparentView>

                <Pressable
                    style={{ padding: 10 }}
                    onPress={() => navigateToOrderDetail(props.item)}>
                    <FontAwesome name="angle-right" size={30} color='grey' />
                </Pressable>
            </TransparentView>

            {
                appStateProps.userType == 'shipper' && props.item.status == 6 ?
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.PROGRESSING)}>
                            <FontAwesome2 name="local-shipping" size={20} color='#288c26' style={{ marginLeft: 10 }} />
                            <I18NText text="Accept Ship Order" style={{ color: '#288c26', fontSize: 18, marginLeft: 10, flexShrink: 1 }} />

                            <ActivityIndicator
                                animating={shippingOrder}
                                color='black'
                                style={{ zIndex: 1, marginLeft: 10 }} />
                        </Pressable>

                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                marginLeft: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.READY_TO_BE_SHIPPED)}>
                            <FontAwesome2 name="close" size={20} color='red' style={{ marginLeft: 10 }} />
                            <I18NText text="Cancel Accept Ship Order" style={{ color: 'red', fontSize: 18, marginLeft: 10, flexShrink: 1 }} />

                            <ActivityIndicator
                                animating={cancelingOrder}
                                color='black'
                                style={{ zIndex: 1, marginLeft: 10 }} />
                        </Pressable>
                    </TransparentView>
                    : null
            }

            {
                appStateProps.userType == 'shipper' && props.item.status == 3 ?
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.DONE)}>
                            <FontAwesome2 name="done-all" size={20} color='#288c26' style={{ marginLeft: 10 }} />
                            <I18NText text="Finish Order" style={{ color: '#288c26', fontSize: 18, marginLeft: 10, flexShrink: 1 }} />

                            <ActivityIndicator
                                animating={finishingOrder}
                                color='black'
                                style={{ zIndex: 1, marginLeft: 10 }} />
                        </Pressable>

                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                marginLeft: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.CANCELED)}>
                            <FontAwesome2 name="close" size={20} color='red' style={{ marginLeft: 10 }} />
                            <I18NText text="Cancel Ship Order" style={{ color: 'red', fontSize: 18, marginLeft: 0, flexShrink: 1 }} />

                            <ActivityIndicator
                                animating={cancelingOrder}
                                color='black'
                                style={{ zIndex: 1, marginLeft: 10 }} />
                        </Pressable>
                    </TransparentView>
                    : null
            }

            {
                appStateProps.userType == 'shipper' && props.item.status == 2 ?
                    <Pressable
                        style={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15,
                            width: '100%', paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#51418c'
                        }}
                        onPress={() => confirm(props.item.id, OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP)}>
                        <FontAwesome2 name="local-shipping" size={20} color='#51418c' style={{ marginLeft: 10 }} />
                        <I18NText text="Accept Order" style={{ color: '#51418c', fontSize: 18, marginLeft: 20, flexShrink: 1 }} />

                        <ActivityIndicator
                            animating={shippingOrder}
                            color='black'
                            style={{ zIndex: 1, marginLeft: 10 }} />
                    </Pressable>
                    : null
            }
            {
                appStateProps.userType == 'customer' && props.item.status == 1 && props.cancelOrderCallback ?
                    <Pressable
                        style={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%',
                            marginTop: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                        }}
                        onPress={() => confirm(props.item.id, OrderStatus.CANCELED)}>
                        <FontAwesome2 name="close" size={20} color='red' />
                        <I18NText text="Cancel Order" style={{ color: 'red', fontSize: 18, marginLeft: 20, flexShrink: 1 }} />

                        <ActivityIndicator
                            animating={cancelingOrder}
                            color='black'
                            style={{ zIndex: 1, marginRight: 10 }} />
                    </Pressable>
                    : null
            }

            <View style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />
        </Pressable>
    )
})

export const OrderItemCell = React.memo((props: CartItemData) => {
    return (
        <TransparentView style={{ marginLeft: 15, marginTop: 5 }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text text={props.productDetail.productName.trim()} style={{ maxWidth: '80%', textAlign: 'left' }} />
                <Text text='·' style={{ marginLeft: 10, fontSize: 12 }} />
                <Text text={props.quantity.toString() + '  '} style={{ marginLeft: 10, fontSize: 16 }} />
                <I18NText text='meal' style={{ fontSize: 16 }} />
            </TransparentView>
        </TransparentView>
    )
})


export type OrderData = {
    id: number,
    items: CartItemData[],
    price: number,
    status: OrderStatus,
    createdDate: string,
    address: string,
    shipFee: number,
    shipFeeWithShopPolicy: number,
    phone: string,
    distance: number
    roleCancel?: number,
    noteCancel?: string,
}

export type OrderItemType = {
    item: OrderData,
    showOrderDate?: boolean,
    cancelOrderCallback?: (orderId: number) => void
}



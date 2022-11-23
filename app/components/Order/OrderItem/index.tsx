import React, { useCallback, useState } from "react";
import { TransparentView, View } from "../../../base/View";
import { CartItemData } from "../Cart";
import { I18NText, Text } from "../../../base/Text";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { formatDateTimeFromData, formatMoney } from "../../../utils/Utils";
import { MaterialIconType } from "../../../constants/MaterialIconType";
import { updateOrder } from "../../../core/apis/Requests";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addOrders, addOrderToOrderQueue, AppState, removeOrder, removeOrderFromOrderQueue } from "../../../redux/Reducer";
import { useLanguage } from "../../../base/Themed";
import { updateOrder as updateOrderAction } from "../../../redux/Reducer";

export const OrderItem = React.memo((props: OrderItemType) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const appStateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))

    const [finishingOrder, setFinishingOrder] = useState(false)
    const [cancelingOrder, setCancelingOrder] = useState(false)
    const [shippingOrder, setShippingOrder] = useState(false)

    const I18NOrder = useLanguage('Order')
    const I18NCancel = useLanguage('Cancel')
    const I18NCancelOrderConfirm = useLanguage('Are you want to cancel shipping this order?')
    const I18NCancelOrder = useLanguage('Cancel Shipping Order')
    const I18NAcceptOrderConfirm = useLanguage('Are you want to accept this order?')
    const I18NAcceptOrder = useLanguage('Accept Order')
    const I18NShipOrderConfirm = useLanguage('Are you shipping this order?')
    const I18NShipOrder = useLanguage('Ship Order')
    const I18NFinishOrderConfirm = useLanguage('Are you want to finish this order?')
    const I18NFinishOrder = useLanguage('Finish Order')
    const I18NShipTo = useLanguage('Ship To')
    const I18NOrderStatus = useLanguage(getOrderStatusMsg(props.item.status))

    const navigateToOrderDetail = useCallback((data: OrderData) => {
        navigation.navigate('OrderDetail' as never, { data: data } as never)
    }, [])

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
                console.log(e)
                setCancelingOrder(false)
            }
        )
    }, [props.item])

    const onAcceptOrder = useCallback((orderId: number) => {
        setFinishingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP,
            (response) => {
                const item = { ...props.item }
                item.status = 6
                dispatch(removeOrderFromOrderQueue(orderId))
                dispatch(addOrders([item]))
                setFinishingOrder(false)
            },
            (e) => {
                console.log(e)
                setFinishingOrder(false)
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
                console.log(e)
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

                    {
                        appStateProps.userType == 'customer' ?
                            <View
                                style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', borderRadius: 10, marginTop: 5 }}>
                                <FontAwesome2 name={getOrderStatusIcon(props.item.status)} size={20} color='#995050' />
                                <Text
                                    text={I18NOrderStatus + (props?.showOrderDate == false ? '' : ' · ' + formatDateTimeFromData(props.item.createdDate))}
                                    style={{ flexShrink: 1, marginLeft: 5, textAlign: 'left' }} numberOfLines={3} />
                            </View>
                            : null
                    }

                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text
                            style={{ textAlign: 'left', fontSize: 22, fontWeight: '500' }}
                            text={props.item.items[0].productDetail.shopName} />

                        {
                            appStateProps.userType == 'shipper' ?
                                <Text text={' · ' + props.item.items[0].productDetail.shopAddress} style={{ fontSize: 18, alignItems: 'flex-start' }} />
                                : null
                        }
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

                    <TransparentView style={{ marginTop: 5 }}>
                        <Text
                            text={`${formatMoney(appStateProps.userType == 'shipper' ? props.item.price : props.item.price + props.item.shipFee)} đ`}
                            style={{ textAlign: 'left', color: 'red', fontSize: 18, fontWeight: '500' }} />
                    </TransparentView>


                    {
                        appStateProps.userType == 'shipper' ?
                            <TransparentView>
                                <TransparentView>

                                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginTop: 10 }}>
                                        <Text text={I18NShipTo + ': ' + props.item.address} style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} numberOfLines={3} />
                                    </TransparentView>
                                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginTop: 5 }}>
                                        <I18NText text='Ship Fee' style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} numberOfLines={3} />
                                        <Text text=': ' style={{ fontSize: 18 }} />
                                        <Text text={formatMoney(props.item.shipFee) + ' đ'} style={{ textAlign: 'left', color: 'red', fontSize: 18, flexShrink: 1, fontWeight: '500' }} numberOfLines={3} />
                                    </TransparentView>
                                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginTop: 5 }}>
                                        <I18NText text='Phone Number' style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} numberOfLines={3} />
                                        <Text text={': ' + props.item.phone} style={{ textAlign: 'left', fontSize: 18, flexShrink: 1, fontWeight: '500' }} numberOfLines={3} />
                                    </TransparentView>
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
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26' }}
                            onPress={() => confirm(props.item.id, OrderStatus.PROGRESSING)}>
                            <FontAwesome2 name="local-shipping" size={20} color='#288c26' />
                            <I18NText text="Ship Order" style={{ color: '#288c26', fontSize: 18, marginLeft: 10 }} />

                            <ActivityIndicator
                                animating={finishingOrder}
                                color='black'
                                style={{ position: 'absolute', zIndex: 1, top: 10, right: 0 }} />
                        </Pressable>

                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%',
                                marginLeft: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.READY_TO_BE_SHIPPED)}>
                            <FontAwesome2 name="close" size={20} color='red' />
                            <I18NText text="Cancel Accept Ship Order" style={{ color: 'red', fontSize: 18, marginLeft: 0 }} />

                            <ActivityIndicator
                                animating={cancelingOrder}
                                color='black'
                                style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                        </Pressable>
                    </TransparentView>
                    : null
            }

            {
                appStateProps.userType == 'shipper' && props.item.status == 3 ?
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                        <Pressable
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26' }}
                            onPress={() => confirm(props.item.id, OrderStatus.DONE)}>
                            <FontAwesome2 name="done-all" size={20} color='#288c26' />
                            <I18NText text="Finish Order" style={{ color: '#288c26', fontSize: 18, marginLeft: 10 }} />

                            <ActivityIndicator
                                animating={finishingOrder}
                                color='black'
                                style={{ position: 'absolute', zIndex: 1, top: 10, right: 0 }} />
                        </Pressable>

                        <Pressable
                            style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%',
                                marginLeft: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                            }}
                            onPress={() => confirm(props.item.id, OrderStatus.CANCELED)}>
                            <FontAwesome2 name="close" size={20} color='red' />
                            <I18NText text="Cancel Ship Order" style={{ color: 'red', fontSize: 18, marginLeft: 0 }} />

                            <ActivityIndicator
                                animating={cancelingOrder}
                                color='black'
                                style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                        </Pressable>
                    </TransparentView>
                    : null
            }

            {
                appStateProps.userType == 'shipper' && props.item.status == 1 ?
                    <Pressable
                        style={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15,
                            width: '100%', paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#51418c'
                        }}
                        onPress={() => confirm(props.item.id, OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP)}>
                        <FontAwesome2 name="local-shipping" size={20} color='#51418c' />
                        <I18NText text="Accept Order" style={{ color: '#51418c', fontSize: 18, marginLeft: 10 }} />

                        <ActivityIndicator
                            animating={shippingOrder}
                            color='black'
                            style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                    </Pressable>
                    : null
            }
            {
                appStateProps.userType == 'customer' && props.item.status == 1 ?
                    <Pressable
                        style={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%',
                            marginTop: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                        }}
                        onPress={() => confirm(props.item.id, OrderStatus.CANCELED)}>
                        <FontAwesome2 name="close" size={20} color='red' />
                        <I18NText text="Cancel Order" style={{ color: 'red', fontSize: 18, marginLeft: 20 }} />

                        <ActivityIndicator
                            animating={cancelingOrder}
                            color='black'
                            style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
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
                <Text text={props.productDetail.productName.trim()} style={{ maxWidth: '80%', textAlign: 'left' }} numberOfLines={3} />
                <Text text='·' style={{ marginLeft: 10, fontSize: 12 }} />
                <Text text={props.quantity.toString() + '  '} style={{ marginLeft: 10, fontSize: 16 }} />
                <I18NText text='meal' style={{ fontSize: 16 }} />
            </TransparentView>
        </TransparentView>
    )
})


export const getOrderStatusMsg = (status: number) => {
    switch (status) {
        case OrderStatus.SUBMITTED:
            return 'Order Is Waiting For Shop Confirmation'
        case OrderStatus.READY_TO_BE_SHIPPED:
            return 'Order Is Ready To Ship'
        case OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP:
            return 'Order Is Waiting For Shipper To Pick Up'
        case OrderStatus.PROGRESSING:
            return 'Order Is The Way'
        case OrderStatus.DONE:
            return 'Order Was Delivered'
        case OrderStatus.CANCELED:
            return 'Order Was Cancelled'
    }
}

export const getOrderStatusIcon = (status: number): MaterialIconType => {
    switch (status) {
        case OrderStatus.SUBMITTED:
            return 'av-timer'
        case OrderStatus.READY_TO_BE_SHIPPED:
            return 'playlist-add-check'
        case OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP:
            return 'wheelchair-pickup'
        case OrderStatus.PROGRESSING:
            return 'local-shipping'
        case OrderStatus.DONE:
            return 'done-all'
        case OrderStatus.CANCELED:
            return 'cancel-presentation'
    }
}

export type OrderData = {
    id: number,
    items: CartItemData[],
    price: number,
    status: OrderStatus,
    createdDate: string,
    address: string,
    shipFee: number,
    phone: string,
    roleCancel?: number,
    noteCancel?: string
}

export type OrderItemType = {
    item: OrderData,
    showOrderDate?: boolean,
    cancelOrderCallback?: (orderId: number) => void
}



// STATUS
// 1 -> 2 -> 6 -> 3 -> 4
//      2 <-        -> 5
export enum OrderStatus {
    SUBMITTED = 1,
    READY_TO_BE_SHIPPED = 2,
    PROGRESSING = 3,
    DONE = 4,
    CANCELED = 5,
    WAITING_FOR_SHIPPER_TO_PICK_UP = 6
}
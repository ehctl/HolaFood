import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { CartInnerItem } from "../Cart/CartItem";
import { TransparentView, View } from "../../../base/View";
import { I18NText, Text } from "../../../base/Text";
import { FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";
import { formatDateTimeFromData, formatMoney, getUserRoleById } from "../../../utils/Utils";
import { useLanguage } from "../../../base/Themed";
import { getOrderStatusIcon, getOrderStatusMsg, OrderData, OrderStatus } from "../OrderItem";
import { ActivityIndicator, Alert, Linking, Pressable, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from "react";
import { cancelOrder, getOrderDetail, updateOrder } from "../../../core/apis/Requests";
import { useToast } from "../../../base/Toast";
import { Constant } from "../../../utils/Constant";
import { mapOrderDataFromResponse } from "../OrderQueueScreen";
import { OrderItemShimmer } from "../OrderItemShimmer";
import { useSelector } from "react-redux";
import { addOrders, addOrderToOrderQueue, AppState, removeOrder, removeOrderFromOrderQueue } from "../../../redux/Reducer";
import { useDispatch } from "react-redux";
import { updateOrder as updateOrderAction } from "../../../redux/Reducer";
import { isValidNormalText } from "../../../validation/validate";
import { PopupModal } from "../../../base/PopupModal";
import { Entypo } from "@expo/vector-icons";


export const OrderDetail = (props: OrderDetailProps) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const appStateProps = useSelector((state: AppState) => ({
        userType: state.userType,
    }))

    const [loading, setLoading] = useState(true)

    const [data, setData] = useState<OrderData>(null)

    const showToast = useToast()

    const cancelOrderPopupRef = useRef(null)

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    const navigateToFoodDetail = (id: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    const [finishingOrder, setFinishingOrder] = useState(false)
    const [cancelingOrder, setCancelingOrder] = useState(false)
    const [shippingOrder, setShippingOrder] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [reasonErrorMsg, setReasonErrorMsg] = useState('')

    const I18NReasonToCancel = useLanguage('Reason To Cancel This Order')
    const I18NOrder = useLanguage('Order')
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

    const fetchData = useCallback(() => {
        setLoading(true)
        getOrderDetail(
            props.route.params?.orderId,
            (response) => {
                const data = response.data
                setData(mapOrderDataFromResponse(data))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [props.route.params?.orderId])

    useEffect(() => {
        fetchData()
    }, [])

    const onFinishOrder = useCallback((orderId: number) => {
        setFinishingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.DONE,
            (response) => {
                const newData = { ...data }
                newData.status = 4
                setData(newData)
                dispatch(removeOrder(orderId))
                setFinishingOrder(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setFinishingOrder(false)
            }
        )
    }, [data])

    const onCancelShipOrder = useCallback((orderId: number) => {
        setCancelingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.READY_TO_BE_SHIPPED,
            (response) => {
                const item = { ...data }
                item.status = 2

                setData(item)
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
    }, [data])

    const onAcceptOrder = useCallback((orderId: number) => {
        setShippingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP,
            (response) => {
                const item = { ...data }
                item.status = 6

                setData(item)
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
    }, [data])

    const onShipOrder = useCallback((orderId: number) => {
        setShippingOrder(true)
        updateOrder(
            orderId,
            OrderStatus.PROGRESSING,
            (response) => {
                const item = { ...data }
                item.status = 3

                setData(item)
                dispatch(updateOrderAction(item))
                setShippingOrder(false)
            },
            (e) => {
                console.log('Error' + e)
                showToast(Constant.API_ERROR_OCCURRED)
                setShippingOrder(false)
            }
        )
    }, [data])

    const onCancelOrder = useCallback(() => {
        const cancelReasonValidate = isValidNormalText(cancelReason.trim())

        if (!cancelReasonValidate.qualify) {
            setReasonErrorMsg(cancelReasonValidate.message)
        } else {
            setCancelingOrder(true)
            cancelOrder(
                data.id,
                cancelReason.trim(),
                (response) => {
                    const item = { ...data }
                    item.status = 5
                    item.roleCancel = appStateProps.userType == 'customer' ? 2 : 4
                    item.noteCancel = cancelReason.trim()

                    setData(item)
                    setCancelingOrder(false)
                    dispatch(removeOrder(data.id))
                    cancelOrderPopupRef.current.changeVisibility(false)
                },
                (e) => {
                    console.log(e)
                    showToast(Constant.API_ERROR_OCCURRED)
                    setCancelingOrder(false)
                }
            )
        }
    }, [data, cancelReason])

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
                cancelOrderPopupRef.current.changeVisibility(true)
                break
        }
    }, [onShipOrder, onFinishOrder, onCancelOrder])


    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header
                        title='Order Detail'
                        canNavigateToOrderScreen={true} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                onRefresh={() => fetchData()}
                useScrollView={true}>
                <OrderItemShimmer visible={loading} />
                {
                    !loading ?
                        <TransparentView style={{}}>
                            <TransparentView style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10 }}>
                                <FontAwesome1 name='tagso' size={24} color='#37942b' />
                                <I18NText text='Order Tag' style={{ marginLeft: 10 }} />
                                <Text text={`: ${data.id}`} style={{}} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                <Entypo name='calendar' size={20} color='#c49829' />
                                <I18NText text={formatDateTimeFromData(data.createdDate)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16 }} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                <FontAwesome2 name={getOrderStatusIcon(data.status)} size={24} color='#995050' />
                                <I18NText text={getOrderStatusMsg(data.status)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16, fontWeight: '500' }} />
                                {
                                    data.status == OrderStatus.CANCELED ?
                                        <I18NText text={`by ${getUserRoleById(data.roleCancel)}`} style={{ textAlign: 'left', marginLeft: 3, fontSize: 16 }} />
                                        : null
                                }
                            </TransparentView>

                            {
                                data.status == OrderStatus.CANCELED ?
                                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                        <FontAwesome2 name='notes' size={24} color='red' />
                                        <I18NText text='Reason' style={{ marginLeft: 10 }} />
                                        <I18NText text={': ' + data.noteCancel} style={{ textAlign: 'left', fontSize: 16 }} />
                                    </TransparentView>
                                    : null
                            }

                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginHorizontal: 10 }}
                                onPress={() => navigateToShopDetail(data?.items[0]?.productDetail?.shopID)}>

                                <Entypo name='shop' size={20} color='#3179cc' />
                                <Text text={data.items[0].productDetail.shopName} style={{ marginLeft: 10, textAlign: 'left', fontSize: 20, marginHorizontal: 10 }} />
                            </Pressable>

                            <TransparentView style={{ flexDirection: 'row', marginTop: 10 }}>
                                <I18NText text="Price" style={{ textAlign: 'left', fontSize: 20, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 20 }} />
                                <Text text={`${formatMoney(data.price + data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 20, color: 'red', fontWeight: '500' }} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginHorizontal: 10, marginTop: 15 }}>
                                <Text text={I18NShopAddress + ': ' + data.items[0].productDetail.shopAddress} style={{ textAlign: 'left', fontSize: 16, flexShrink: 1 }}  />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginHorizontal: 10, marginTop: 5 }}>
                                <Text text={I18NShipTo + ': ' + data.address} style={{ textAlign: 'left', fontSize: 16, flexShrink: 1 }}  />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                                <I18NText text="Ship Fee" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                                <Text text={`${formatMoney(data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 18, color: 'red', fontWeight: '500' }} />
                            </TransparentView>

                            <Pressable
                                style={{ flexDirection: 'row', marginTop: 5 }}
                                onPress={() => Linking.openURL(`tel:${data.phone}`)} >

                                <I18NText text="Phone Number" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                                <Text text={data.phone} style={{ textAlign: 'left', fontSize: 18, fontWeight: '500' }} />
                            </Pressable>

                            <I18NText text="Food" style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, marginHorizontal: 10 }} />

                            {
                                data.items.map((item, index) => (
                                    <TransparentView key={'order_item_' + index}>
                                        <CartInnerItem item={item} hideShopName={true}/>
                                        <View style={{ backgroundColor: 'grey', height: 2, marginVertical: 15, marginHorizontal: 10 }} />
                                    </TransparentView>
                                ))
                            }

                            <TransparentView style={{ marginHorizontal: 10, marginBottom: 30 }}>

                                {
                                    appStateProps.userType == 'shipper' && data.status == 6 ?
                                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                style={{
                                                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                                    marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26'
                                                }}
                                                onPress={() => confirm(data.id, OrderStatus.PROGRESSING)}>
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
                                                onPress={() => confirm(data.id, OrderStatus.READY_TO_BE_SHIPPED)}>
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
                                    appStateProps.userType == 'shipper' && data.status == 3 ?
                                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                            <Pressable
                                                style={{
                                                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%',
                                                    marginRight: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#288c26'
                                                }}
                                                onPress={() => confirm(data.id, OrderStatus.DONE)}>
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
                                                onPress={() => confirm(data.id, OrderStatus.CANCELED)}>
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
                                    appStateProps.userType == 'shipper' && data.status == 1 ?
                                        <Pressable
                                            style={{
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15,
                                                width: '100%', paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#51418c'
                                            }}
                                            onPress={() => confirm(data.id, OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP)}>
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
                                    appStateProps.userType == 'customer' && data.status == 1 ?
                                        <Pressable
                                            style={{
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%',
                                                marginTop: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 2, borderColor: 'red'
                                            }}
                                            onPress={() => confirm(data.id, OrderStatus.CANCELED)}>
                                            <FontAwesome2 name="close" size={20} color='red' />
                                            <I18NText text="Cancel Order" style={{ color: 'red', fontSize: 18, marginLeft: 20 }} />

                                            <ActivityIndicator
                                                animating={cancelingOrder}
                                                color='black'
                                                style={{ zIndex: 1, marginRight: 10 }} />
                                        </Pressable>
                                        : null
                                }
                            </TransparentView>
                        </TransparentView>
                        : null
                }

                <PopupModal
                    ref={cancelOrderPopupRef}
                    title="Cancel Order" >

                    <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                        <TextInput
                            placeholder={I18NReasonToCancel}
                            multiline={true}
                            style={{ fontSize: 18, paddingHorizontal: 10, paddingVertical: 20, paddingTop: 15, backgroundColor: '#cdd1d1', width: '100%', borderRadius: 10 }}
                            value={cancelReason}
                            onChangeText={(v) => { setCancelReason(v) }} />
                    </TransparentView>
                    {
                        reasonErrorMsg.length != 0 ?
                            <I18NText text={reasonErrorMsg} style={{ color: 'red', textAlign: 'left', width: '100%', marginTop: 10, marginBottom: 15 }} />
                            : null
                    }

                    <Pressable
                        style={{
                            marginTop: 10, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }}
                        onPress={() => onCancelOrder()} >

                        <I18NText text='Cancel Order' />

                        <ActivityIndicator
                            animating={cancelingOrder}
                            color='black'
                            style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                    </Pressable>


                </PopupModal>
            </AnimatedHeader>
        </View>
    )
}

export interface OrderDetailProps {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'OrderDetail'>;
    route: RouteProp<GroupStackParamList, 'OrderDetail'>
}


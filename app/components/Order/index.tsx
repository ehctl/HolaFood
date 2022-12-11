import { TransparentView, View } from "../../base/View"
import { ActivityIndicator, Pressable, RefreshControl, TextInput } from 'react-native';
import { getStyle, reformatDateTime } from "../../utils/Utils";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { AppState, removeOrder, setOrders } from "../../redux/Reducer";
import { useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { BottomStackParamList } from "../../navigation/BottomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/core'
import { OrderData, OrderItem } from "./OrderItem";
import { OrderItemShimmer } from "./OrderItemShimmer";
import { I18NText, Text } from "../../base/Text";
import { cancelOrder, getActiveOrders, getShipperProgressingOrder } from "../../core/apis/Requests";
import { mapCartItemFromResponse } from "./Cart";
import { PopupModal } from "../../base/PopupModal";
import { isValidNormalText } from "../../validation/validate";
import { useLanguage } from "../../base/Themed";
import { Constant } from "../../utils/Constant";
import { useToast } from "../../base/Toast";

export const OrderScreen = React.memo((props: OrderViewProp) => {
    const dispatch = useDispatch()
    const stateProps = useSelector((state: AppState) => ({
        appState: state.applicationState,
        newOrderNotification: state.newOrderNotification,
        selectedBottomTabIndex: state.selectedBottomTabIndex,
        orders: state.orders,
        userType: state.userType
    }))

    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const cancelOrderPopupRef = useRef(null)

    const [orderToCancelId, setOrderToCancelId] = useState<number>(null)
    const [cancelReason, setCancelReason] = useState('')
    const [reasonErrorMsg, setReasonErrorMsg] = useState('')
    const [cancelingOrder, setCancelingOrder] = useState(false)

    const I18NReasonToCancel = useLanguage('Reason To Cancel This Order')

    const showToast = useToast()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = useCallback(() => {
        setLoading(true)
        dispatch(setOrders([]))

        const fetchOrderFn = stateProps.userType == 'customer' ? getActiveOrders : getShipperProgressingOrder

        fetchOrderFn(
            (response) => {
                const orderDataFromResponse = response.data
                const orders = orderDataFromResponse.map((i) => mapOrderDataFromResponse(i))
                dispatch(setOrders(orders))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )

    }, [stateProps.userType])

    const renderItems = ({ item }) => {
        return (
            <OrderItem item={item} cancelOrderCallback={cancelOrderCallback} />
        )
    }

    const renderLoadMore = () => {
        return (
            <OrderItemShimmer visible={loading || refreshing} />
        )
    }

    const onCancelOrder = useCallback(() => {
        const cancelReasonValidate = isValidNormalText(cancelReason.trim())

        if (!cancelReasonValidate.qualify) {
            setReasonErrorMsg(cancelReasonValidate.message)
        } else {
            setCancelingOrder(true)
            cancelOrder(
                orderToCancelId,
                cancelReason.trim(),
                (response) => {
                    setCancelingOrder(false)
                    dispatch(removeOrder(orderToCancelId))
                    cancelOrderPopupRef.current.changeVisibility(false)
                },
                (e) => {
                    console.log(e)
                    showToast(Constant.API_ERROR_OCCURRED)
                    setCancelingOrder(false)
                }
            )
        }
    }, [orderToCancelId, cancelReason])

    const cancelOrderCallback = useCallback((orderId: number) => {
        setOrderToCancelId(orderId)
        cancelOrderPopupRef.current.changeVisibility(true)
    }, [])

    return (
        <View style={[getStyle().flex_c_s, { paddingTop: 5 }]}>
            
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { fetchData() }}
                    />
                }
                renderItem={renderItems}
                data={stateProps.orders}
                keyExtractor={(_, index) => `${index}`}
                ListEmptyComponent={(!loading && !refreshing) ? <Text text='Chưa có order mới.' /> : null}
                ListFooterComponent={() => renderLoadMore()} />

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
        </View>
    )
})

export const mapOrderDataFromResponse = (data: any): OrderData => {
    const items = data.cart.map((i) => mapCartItemFromResponse(i))

    return {
        id: data.id,
        address: data.address,
        items: items,
        status: data.orderStatus,
        price: data.price - data.shipOrder,
        shipFee: data.shipPrice,
        shipFeeWithShopPolicy: data.shipOrder,
        createdDate: reformatDateTime(data.createdDate),
        phone: data.phone,
        distance: data.distance,
        roleCancel: data.roleCancel,
        noteCancel: data.noteCancel ?? ''
    }
}

export interface OrderViewProp {
    navigation: NativeStackNavigationProp<BottomStackParamList, 'Order'>;
    route: RouteProp<BottomStackParamList, 'Order'>
}

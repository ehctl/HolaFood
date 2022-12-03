import { View } from "../../../base/View"
import { RefreshControl } from 'react-native';
import { formatCreatedDateType, getStyle, wait } from "../../../utils/Utils";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { AppState, setNewOrderNotification, setOrderQueue, setOrders } from "../../../redux/Reducer";
import { useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { BottomStackParamList } from "../../../navigation/BottomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/core'
import { OrderData, OrderItem } from "../OrderItem";
import { OrderItemShimmer } from "../OrderItemShimmer";
import { I18NText, Text } from "../../../base/Text";
import { getShipperOrderQueue } from "../../../core/apis/Requests";
import { mapCartItemFromResponse } from "../Cart";
import { Constant } from "../../../utils/Constant";
import { useToast } from "../../../base/Toast";


export const OrderQueueScreen = React.memo((props: OrderViewProp) => {
    const dispatch = useDispatch()
    const stateProps = useSelector((state: AppState) => ({
        appState: state.applicationState,
        newOrderNotification: state.newOrderNotification,
        selectedBottomTabIndex: state.selectedBottomTabIndex,
        shipperOrderQueue: state.shipperOrderQueue,
        userInfo: state.userInfo,
    }))
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const showToast = useToast()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = useCallback(() => {
        setLoading(true)
        dispatch(setOrderQueue([]))

        getShipperOrderQueue(
            stateProps.userInfo.shopId,
            (response) => {
                const orderDataFromResponse = response.data
                const orders = orderDataFromResponse.map((i) => mapOrderDataFromResponse(i))
                dispatch(setOrderQueue(orders))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [])

    const renderItems = ({ item }) => {
        return (
            <OrderItem item={item} />
        )
    }

    const renderLoadMore = () => {
        return (
            <OrderItemShimmer visible={loading || refreshing} />
        )
    }

    return (
        <View style={[getStyle().flex_c_s, { paddingTop: 5 }]}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => fetchData()}
                    />
                }
                renderItem={renderItems}
                data={stateProps.shipperOrderQueue}
                keyExtractor={(_, index) => `${index}`}
                ListEmptyComponent={(!loading && !refreshing) ? <I18NText text='You Do Not Have Any New Order Yet' /> : null}
                ListFooterComponent={() => renderLoadMore()} />
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
        price: data.price,
        shipFee: data.shipPrice,
        shipFeeWithShopPolicy: data.shipOrder,
        createdDate: formatCreatedDateType(new Date()),
        phone: data.phone,
        roleCancel: data.roleCancel,
        noteCancel: data.noteCancel ?? ''
    }
}

export interface OrderViewProp {
    navigation: NativeStackNavigationProp<BottomStackParamList, 'Order'>;
    route: RouteProp<BottomStackParamList, 'Order'>
}

import { TransparentView, View } from "../../../base/View"
import { Alert, Pressable, RefreshControl } from 'react-native';
import { formatCreatedDateType, getStyle, reformatDateTime, wait } from "../../../utils/Utils";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { AppState, setNewOrderNotification, setOrderQueue, setOrders } from "../../../redux/Reducer";
import { useDispatch } from "react-redux";
import { FlatList, ScrollView } from "react-native-gesture-handler";
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
import { PopupModal } from "../../../base/PopupModal";
import { RadioButton, RadioButtonGroup, RadioButtonIcon } from "../../../base/RadioGroup";
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";
import { useLanguage } from "../../../base/Themed";


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
    const popupModalQueueSortTypeRef = useRef(null)
    const popupModalQueueSortOrderRef = useRef(null)
    const [orderQueueSortType, setOrderQueueSortType] = useState(QueueSortType.DATE)
    const [orderQueueSortOrder, setOrderQueueSortOrder] = useState(QueueSortOrder.DESCENDING)
    const [pageIndex, setPageIndex] = useState(0)
    const [reachEndList, setReachEndList] = useState(false)

    const showToast = useToast()

    const I18NWarning = useLanguage('Shipper not linked to any shops')

    const fetchData = useCallback((pageIndex: number) => {
        setLoading(true)

        if (pageIndex == 0 && stateProps.shipperOrderQueue.length != 0)
            dispatch(setOrderQueue([]))

        getShipperOrderQueue(
            orderQueueSortType == QueueSortType.DATE ? 'created_date' : 'distance',
            orderQueueSortOrder == QueueSortOrder.ASCENDING ? 'ASC' : 'DESC',
            stateProps.userInfo.shopId,
            pageIndex,
            (response) => {
                const orderDataFromResponse = response.data
                const orders = orderDataFromResponse.map((i) => mapOrderDataFromResponse(i))
                if (orders.length < 10)
                    setReachEndList(true)

                dispatch(setOrderQueue(pageIndex == 0 ? orders : [...stateProps.shipperOrderQueue, ...orders]))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [orderQueueSortType, orderQueueSortOrder, stateProps.shipperOrderQueue, showToast])

    useEffect(() => {
        if (stateProps.userInfo.shopId != -1) {
            setReachEndList(false)
            setPageIndex(0)
            fetchData(0)
        }
    }, [orderQueueSortType, orderQueueSortOrder, stateProps.userInfo.shopId])

    useEffect(() => {
        if (stateProps.userInfo.shopId == -1) {
            Alert.alert(I18NWarning)
        }
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
            <TransparentView style={{
                marginHorizontal: 10
            }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true} >

                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#e8be41', paddingHorizontal: 15, paddingVertical: 5 }}
                        onPress={() => popupModalQueueSortTypeRef.current.changeVisibility(true)}>

                        <I18NText text="Sort" />
                        <Text text=":  " />
                        <I18NText text={orderQueueSortType} style={{ fontWeight: '500' }} />
                        <FontAwesome name="angle-down" size={16} style={{ marginLeft: 10 }} />
                    </Pressable>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginLeft: 10, backgroundColor: '#e8be41', paddingHorizontal: 15, paddingVertical: 5 }}
                        onPress={() => popupModalQueueSortOrderRef.current.changeVisibility(true)}>

                        <I18NText text="Orderr" />
                        <Text text=":  " />
                        <I18NText text={orderQueueSortOrder} style={{ fontWeight: '500' }} />
                        <FontAwesome name="angle-down" size={16} style={{ marginLeft: 10 }} />
                    </Pressable>
                </ScrollView>
            </TransparentView>

            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => fetchData(0)}
                    />
                }
                renderItem={renderItems}
                data={stateProps.shipperOrderQueue}
                keyExtractor={(_, index) => `${index}`}
                ListEmptyComponent={(!loading && !refreshing) ? <I18NText text='You Do Not Have Any New Order Yet' /> : null}
                ListFooterComponent={() => renderLoadMore()}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!reachEndList && !loading) {
                        fetchData(pageIndex + 1)
                        setPageIndex(pageIndex + 1)
                    }
                }} />

            <PopupModal ref={popupModalQueueSortTypeRef} title='Sort'>
                <RadioButtonGroup
                    selectedColor='#e8be41'
                    defaultColor='grey'
                    value={orderQueueSortType}
                    valueChange={(value: string) => {
                        popupModalQueueSortTypeRef.current.changeVisibility(false)
                        setOrderQueueSortType(value as QueueSortType)
                    }}>

                    <RadioButton value={QueueSortType.DATE} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome2 name="date-range" size={28} color='#28b1c9' />
                            </View>
                            <I18NText text={QueueSortType.DATE} style={{ fontSize: 18, marginLeft: 15, fontWeight: '500' }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>

                    <RadioButton value={QueueSortType.DISTANCE} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome2 name="6-ft-apart" size={28} color='#28b1c9' />
                            </View>
                            <I18NText text={QueueSortType.DISTANCE} style={{ fontSize: 18, marginLeft: 15, fontWeight: '500' }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>
                </RadioButtonGroup>
            </PopupModal>

            <PopupModal ref={popupModalQueueSortOrderRef} title='Orderr'>
                <RadioButtonGroup
                    selectedColor='#28b1c9'
                    defaultColor='grey'
                    value={orderQueueSortOrder}
                    valueChange={(value: string) => {
                        popupModalQueueSortOrderRef.current.changeVisibility(false)
                        setOrderQueueSortOrder(value as QueueSortOrder)
                    }}>

                    <RadioButton value={QueueSortOrder.ASCENDING} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome1 name="caretup" size={28} color='#28b1c9' />
                            </View>
                            <I18NText text={QueueSortOrder.ASCENDING} style={{ fontSize: 18, marginLeft: 15, fontWeight: '500' }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>

                    <RadioButton value={QueueSortOrder.DESCENDING} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome1 name="caretdown" size={28} color='#28b1c9' />
                            </View>
                            <I18NText text={QueueSortOrder.DESCENDING} style={{ fontSize: 18, marginLeft: 15, fontWeight: '500' }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>
                </RadioButtonGroup>
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
``
export enum QueueSortType {
    DATE = "Date",
    DISTANCE = "Distance"
}

export enum QueueSortOrder {
    ASCENDING = "Ascending",
    DESCENDING = "Descending",
}

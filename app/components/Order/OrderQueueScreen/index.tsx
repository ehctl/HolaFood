import { TransparentView, View } from "../../../base/View"
import { Pressable, RefreshControl } from 'react-native';
import { formatCreatedDateType, getStyle, wait } from "../../../utils/Utils";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { PopupModal } from "../../../base/PopupModal";
import { RadioButton, RadioButtonGroup, RadioButtonIcon } from "../../../base/RadioGroup";
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";


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
    const popupModalRef = useRef(null)
    const [orderQueueSortType, setOrderQueueSortType] = useState(QueueSortType.DATE)

    const showToast = useToast()

    useEffect(() => {
        fetchData()
    }, [orderQueueSortType])

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
            <TransparentView style={{
                marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', 
            }}>
                <Pressable
                    style={{ flexDirection: 'row',borderRadius: 10, backgroundColor: '#60cde0', paddingHorizontal: 15, paddingVertical: 5 }}
                    onPress={() => popupModalRef.current.changeVisibility(true)}>

                    <I18NText text="Sort" />
                    <Text text=":  " />
                    <I18NText text={orderQueueSortType} style={{fontWeight: '500'}}/>
                    <FontAwesome name="angle-down" size={16} style={{ marginLeft: 10 }} />
                </Pressable>
            </TransparentView>

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

            <PopupModal ref={popupModalRef} title='Sort'>
                <RadioButtonGroup
                    selectedColor='#28b1c9'
                    defaultColor='grey'
                    value={orderQueueSortType}
                    valueChange={(value: string) => {
                        popupModalRef.current.changeVisibility(false)
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

export enum QueueSortType {
    DATE = "Date",
    DISTANCE = "Distance"
}

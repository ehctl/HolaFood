import { TransparentView, View } from "../../base/View"
import { BText, Text } from "../../base/Text"
import { ActivityIndicator, Image, RefreshControl } from 'react-native';
import { getStyle, wait } from "../../utils/Utils";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { AnimatedHeader } from "../../base/AnimatedHeader";
import { FoodDetailData } from "../FoodDetail/FoodDetailScreen";
import { useSelector } from "react-redux";
import { AppState, setNewOrderNotification, setOrders } from "../../redux/Reducer";
import { useDispatch } from "react-redux";
import { BottomStackParamList } from "../../navigation/BottomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/core'
import { FlatList } from "react-native-gesture-handler";
import { OrderItemShimmer } from "./OrderItemShimmer";


export const OrderScreen = React.memo((props: OrderViewProp) => {
    const stateProps = useSelector((state: AppState) => ({
        orders: state.orders,
        appState: state.applicationState,
        newOrderNotification: state.newOrderNotification,
        selectedBottomTabIndex: state.selectedBottomTabIndex
    }))
    const dispatch = useDispatch()
    const [loadingMore, setLoadingMore] = useState(false)
    const [reachEndOfList, setReachEndOfList] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        const reloadData = async () => {
            setLoadingMore(true)
            await wait(2000)
            dispatch(setOrders(ordersData))
            setLoadingMore(false)
        }

        reloadData()
    }, [stateProps.appState])


    useEffect(() => {
        if (stateProps.newOrderNotification && stateProps.selectedBottomTabIndex == 1)
            dispatch(setNewOrderNotification(false))
    }, [stateProps.newOrderNotification, stateProps.selectedBottomTabIndex])

    const renderItems = ({ item }) => {
        return (
            <OrderItem {...item} />
        )
    }

    const renderLoadMore = () => {
        return (
            <OrderItemShimmer visible={loadingMore || refreshing} />
        )
    }

    return (
        <View style={[getStyle().flex_c_s, { paddingTop: 5}]}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { setRefreshing(true); wait(2000).then(() => setRefreshing(false)) }}
                    />
                }
                renderItem={renderItems}
                data={stateProps.orders}
                keyExtractor={(_, index) => `${index}`}
                ListFooterComponent={() => renderLoadMore()} />
        </View>
    )
})

export const OrderItem = React.memo((props: OrderItemType) => {

    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#c0c6cf', borderRadius: 15, marginHorizontal: 5, padding: 10, marginBottom: 10 }}>
            <TransparentView style={{ marginHorizontal: 10, flexGrow: 1, flexShrink: 1 }}>
                <BText text={props.item.name} style={{ textAlign: 'left', fontSize: 20 }} />

                <TransparentView style={{ flexDirection: 'row' }}>
                    <BText text="Quantity" />
                    <BText text={`: ${props.quantity}`} />
                </TransparentView>

                <TransparentView style={{ flexDirection: 'row' }}>
                    <BText text="Price" />
                    <BText text={`: ${props.quantity * props.item.price} đ`} />
                </TransparentView>

                <TransparentView style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <BText text={`${props.item.sellerName}`} style={{ fontSize: 18 }} />
                </TransparentView>

                <View style={{ marginTop: 5, borderRadius: 10, backgroundColor: '#52c5d9' }}>
                    <BText text="On progress" style={{ paddingVertical: 10, textAlign: 'center' }} />
                </View>
            </TransparentView>
            <TransparentView>
                <Image source={{ uri: props.item.images[0] }} style={{ height: 125, aspectRatio: 1, borderRadius: 10 }} />
            </TransparentView>
        </View>
    )
})

export interface OrderViewProp {
    navigation: NativeStackNavigationProp<BottomStackParamList, 'Order'>;
    route: RouteProp<BottomStackParamList, 'Order'>
}

const ordersData: OrderItemType[] = [
    {
        item: {
            id: '1223',
            name: 'S-Golden Bubble Milk Tea',
            description: 'Trà Sữa Trân Châu Hoàng Kim - Size nhỏ',
            price: 50000,
            isFavorite: false,
            images: [
                'https://cdn.dayphache.edu.vn/wp-content/uploads/2020/02/mon-tra-sua-tran-chau.jpg',
                'http://cdn.tgdd.vn/Files/2021/08/10/1374160/hoc-cach-pha-tra-sua-o-long-dai-loan-thom-ngon-chuan-vi-ai-cung-me-202108100039248020.jpg',
            ],
            rate: 4.5,
            sellerId: '331123',
            sellerName: 'Koi The\' Hồ Tùng Mậu',
        },
        quantity: 10
    },
    {
        item: {
            id: '1223123',
            name: 'Sinh Tố Lúa Mạch',
            description: 'Sinh Tố Lúa Mạch - Size nhỏ',
            price: 23000,
            isFavorite: false,
            images: [
                'https://cdn.dayphache.edu.vn/wp-content/uploads/2020/02/mon-tra-sua-tran-chau.jpg',
                'http://cdn.tgdd.vn/Files/2021/08/10/1374160/hoc-cach-pha-tra-sua-o-long-dai-loan-thom-ngon-chuan-vi-ai-cung-me-202108100039248020.jpg',

            ],
            rate: 4.5,
            sellerId: '331123',
            sellerName: 'Koi The\' Hồ Tùng Mậu',
        },
        quantity: 5
    }
]

export type OrderItemType = {
    item: Omit<FoodDetailData, 'reviews' | 'numOfReviews'>,
    quantity: number
}

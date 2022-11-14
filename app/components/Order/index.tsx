import { View } from "../../base/View"
import { RefreshControl } from 'react-native';
import { getStyle, wait } from "../../utils/Utils";
import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { AppState, setNewOrderNotification } from "../../redux/Reducer";
import { useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { BottomStackParamList } from "../../navigation/BottomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/core'
import { OrderItem } from "./OrderItem";
import { OrderItemShimmer } from "./OrderItemShimmer";
import { Text } from "../../base/Text";


export const OrderScreen = React.memo((props: OrderViewProp) => {
    const stateProps = useSelector((state: AppState) => ({
        appState: state.applicationState,
        newOrderNotification: state.newOrderNotification,
        selectedBottomTabIndex: state.selectedBottomTabIndex,
        orders: state.orders
    }))
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {

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
            <OrderItemShimmer visible={loading || refreshing} />
        )
    }

    return (
        <View style={[getStyle().flex_c_s, { paddingTop: 5 }]}>
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
                ListEmptyComponent={<Text text='Chưa có order mới.' />}
                ListFooterComponent={() => renderLoadMore()} />
        </View>
    )
})

export interface OrderViewProp {
    navigation: NativeStackNavigationProp<BottomStackParamList, 'Order'>;
    route: RouteProp<BottomStackParamList, 'Order'>
}

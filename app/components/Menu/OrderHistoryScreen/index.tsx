import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { TransparentView, View } from "../../../base/View";
import { Level2Header } from "../../../base/Headers/Level2Header";
import { OrderData, OrderItem } from "../../Order/OrderItem";
import { ListRenderItemInfo, RefreshControl, SectionList } from "react-native";
import {  formatDateTimeFromData } from "../../../utils/Utils";
import { OrderItemShimmer } from "../../Order/OrderItemShimmer";
import { getAllOrders } from "../../../core/apis/Requests";
import { mapOrderDataFromResponse } from "../../Order";
import { I18NText } from "../../../base/Text";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/Reducer";
import { Text } from "../../../base/Text";
import { useNavigation } from '@react-navigation/native';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Constant } from "../../../utils/Constant";
import { useToast } from "../../../base/Toast";


export const OrderHistoryScreen = React.memo(() => {
    const navigation = useNavigation()
    const appStateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))
    const [listOrder, setListOrder] = useState<ListOrderItem[]>([])

    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [reachedEndList, setReachedEndList] = useState(false)

    const showToast = useToast()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShow: true,
            header: (_: NativeStackHeaderProps) =>
                <Level2Header
                    title={appStateProps.userType == 'customer' ? "Order History" : "Shipping History"}
                    canNavigateToOrderScreen={true} />
        })
    })
    
    const categorizeOrderByDate = useCallback((orders: OrderData[], createNewList: boolean): ListOrderItem[] => {
        const hashMap = new Map<string, OrderData[]>()
        const newOrders = createNewList ? [] : listOrder

        orders.forEach((item, _) => {
            const key = formatDateTimeFromData(item.createdDate)
            if (newOrders.length > 0 && newOrders[newOrders.length - 1].title == key) {
                newOrders[newOrders.length - 1].data.push(item)
            } else if (hashMap[key]) {
                hashMap[key].push(item)
            } else {
                hashMap[key] = [item]
            }
        })

        for (const [key, value] of Object.entries(hashMap)) {
            newOrders.push({
                title: key,
                data: value
            })
        }

        return newOrders
    }, [listOrder])

    const fetchData = useCallback((pageIndex: number) => {
        setLoading(true)

        getAllOrders(
            pageIndex,
            (response) => {
                const orderDataFromResponse = response.data
                const orders = orderDataFromResponse.map((i) => mapOrderDataFromResponse(i))
                if (orders.length < 10)
                    setReachedEndList(true)
                setListOrder(categorizeOrderByDate(orders, pageIndex == 0))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [categorizeOrderByDate])

    const onRefresh = useCallback(() => {
        setListOrder([])
        setPageIndex(0)
        fetchData(0)
    }, [fetchData])

    useEffect(() => {
        fetchData(0)
    }, [])

    const renderItem = ({ item, index }: ListRenderItemInfo<OrderData>) => {
        return (
            <OrderItem item={item} showOrderDate={false} />
        )
    }

    const getFooterComp = () => {
        return <OrderItemShimmer visible={loading} />
    }

    const extractor = (_: OrderData, index: number) => `order_list_item_` + index

    return (
        <View style={{ flex: 1 }}>

            <SectionList
                contentContainerStyle={{ marginLeft: 10 }}
                sections={listOrder}
                keyExtractor={extractor}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={onRefresh} />
                }
                ListEmptyComponent={!loading ? <I18NText text="You Do Not Have Any Order Yet" /> : null}
                ListFooterComponent={getFooterComp()}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!reachedEndList && !loading) {
                        fetchData(pageIndex + 1)
                        setPageIndex(pageIndex + 1)
                    }
                }}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section: { title } }) => (
                    <TransparentView style={{marginRight: 15}}>
                        <Text text={title} style={{ fontSize: 22, textAlign: 'left' }} />
                        <View style={{height: 7, backgroundColor: 'grey', marginTop: 5, marginBottom: 5}}/>
                    </TransparentView>
                )}
            />
        </View>
    )
})

export type ListOrderItem = {
    title: string,
    data: OrderData[]
}

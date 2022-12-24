import { TransparentView, View } from "../../../base/View"
import { BText, I18NText, Text } from "../../../base/Text"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { ActivityIndicator, ListRenderItemInfo, Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../base/Toast";
import { useLanguage } from "../../../base/Themed";
import { formatCreatedDateType1, formatCreatedDateType2 } from "../../../utils/Utils";
import { FlatList } from "react-native-gesture-handler";
import { getNotificationDetailItems } from "../../../core/apis/Requests";
import { Constant } from "../../../utils/Constant";
import { getOrderStatusMsg } from "../../Order/OrderUtils";


export const DefaultNotificationItem = React.memo((props: NotificationItemData) => {
    const navigation = useNavigation()

    return (
        <Pressable
            style={{ marginHorizontal: 5 }}
            onPress={() => {
                navigation.navigate('FoodList' as never)
            }}>
            <View style={{ backgroundColor: '#dbd9d5', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 1, borderRadius: 10, marginTop: 15, paddingVertical: 10, paddingHorizontal: 10 }}>
                <FontAwesome name="shopping-basket" style={{}} size={22} color='#1b5bc2' />
                <BText text={props.text} style={{ marginLeft: 10, textAlign: 'left', flexShrink: 1, fontWeight: '500', fontSize: 15 }} />
            </View>
        </Pressable>
    )
})

export const OrderStatusNotificationItem = React.memo((props: NotificationItemData) => {
    const navigation = useNavigation()

    const [isCollapse, setIsCollapse] = useState(false)
    const [notiDetailItems, setNotiDetailItems] = useState<NotificationItemData[]>([])
    const [loading, setLoading] = useState(false)

    const showToast = useToast()

    const fetchData = useCallback(() => {
        setLoading(true)
        getNotificationDetailItems(
            props.data?.orderId,
            (response) => {
                const data = response.data.map((i) => mapNotificationDataFromResponse(i)) as NotificationItemData[]
                setNotiDetailItems(data.filter((i) => i.data?.status != props.data?.status))
                setLoading(false)
            },
            (e) => {
                setLoading(false)
                setIsCollapse(false)
                showToast(Constant.API_ERROR_OCCURRED)
            }
        )
    }, [props.data?.orderId, props.data?.status])

    useEffect(() => {
        if (isCollapse)
            setIsCollapse(false)
    }, [props.data?.status])

    useEffect(() => {
        if (isCollapse)
            fetchData()
        else
            setNotiDetailItems([])
    }, [isCollapse])

    const I18NOrders = useLanguage('Orders')
    const I18NOrderStatus = useLanguage(getOrderStatusForNotificaton(props.data.status))

    const renderItem = ({ item, index }: ListRenderItemInfo<NotificationItemData>) => {
        return <NotificationDetailItem {...item} />
    }

    const extractor = (_: NotificationItemData, index: number) => `order_status_detail_item${index}`

    return (
        <TransparentView
            style={{ marginHorizontal: 5 }} >

            <View
                style={{ backgroundColor: '#dbd9d5', borderRadius: 10, marginTop: 15, paddingVertical: 10, paddingLeft: 10 }}>
                <TransparentView
                    style={{
                        flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                        flexShrink: 1,
                    }}>
                    <FontAwesome2 name="fastfood" style={{ width: 25 }} size={22} color='#ab0785' />

                    <Pressable
                        onPress={() => {
                            navigation.navigate('OrderDetail' as never, { orderId: props.data?.orderId } as never)
                        }}
                        style={{ flexGrow: 1, flexShrink: 1, marginLeft: 15 }}>

                        <Text text={props.createdDate} style={{ fontSize: 14, textAlign: "left", flexShrink: 1 }} />

                        <TransparentView style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginTop: 5 }}>
                            <BText
                                text={`${I18NOrders} ${props.data.orderId} ${I18NOrderStatus}`}
                                style={{ flexShrink: 1, textAlign: 'left', fontWeight: '500', fontSize: 15 }} />
                        </TransparentView>
                    </Pressable>

                    {
                        props.data?.status != 1 ?
                            <Pressable
                                onPress={() => setIsCollapse(!isCollapse)}
                                style={{ paddingHorizontal: 25, height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name={isCollapse ? 'angle-down' : 'angle-up'} size={20} />
                            </Pressable>
                            : null
                    }
                </TransparentView>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={extractor}
                    ListHeaderComponent={
                        loading ?
                            <ActivityIndicator
                                animating={true}
                                color='black'
                                style={{}} />
                            : null
                    }
                    data={notiDetailItems}
                />
            </View>
        </TransparentView>
    )
})

export const NotificationDetailItem = React.memo((props: NotificationItemData) => {
    const navigation = useNavigation()

    return (
        <TransparentView style={{ marginLeft: 40, marginTop: 5 }}>
            <View style={{ height: 1, backgroundColor: 'white' }} />

            <TransparentView
                style={{
                    flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                    flexShrink: 1, marginTop: 5
                }}>

                <Pressable
                    onPress={() => {
                        navigation.navigate('OrderDetail' as never, { orderId: props.data?.orderId } as never)
                    }}
                    style={{ flexGrow: 1, flexShrink: 1 }}>

                    <Text text={props.createdDate} style={{ fontSize: 14, textAlign: "left", flexShrink: 1 }} />

                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginTop: 5 }}>
                        <BText
                            text={getOrderStatusMsg(props.data?.status)}
                            style={{ flexShrink: 1, textAlign: 'left', fontWeight: '500', fontSize: 15 }} />
                    </TransparentView>
                </Pressable>
            </TransparentView>
        </TransparentView>
    )
})


export const getOrderStatusForNotificaton = (status: number) => {
    switch (status) {
        case 1:
            return "is waiting for shop's confirmation"
        case 2:
            return "is ready to ship"
        case 6:
            return "is waiting for shipper to pick up"
        case 3:
            return "is on the way"
        case 4:
            return "was delivered"
        case 5:
            return "was canceled"
    }
}

export const getListItem = (): NotificationItemData[] => {
    return [
        {
            id: -1,
            type: NotificationType.DEFAULT,
            text: 'Welcome, welcome! Go Shopping around and pick up what you want !!!'
        }
    ]
}

export const mapNotificationDataFromResponse = (item): NotificationItemData => {
    return {
        id: item.orderId,
        type: NotificationType.ORDER_STATUS_CHANGE,
        data: {
            orderId: item.orderId,
            status: item.orderStatus
        },
        createdDate: formatCreatedDateType2(new Date(item.dateCreate))
    }
}

export type NotificationItemData = {
    id: number,
    type: NotificationType,
    text?: string,
    data?: OrderNotificationType,
    createdDate?: string
}

export enum NotificationType {
    ORDER_STATUS_CHANGE,
    DEFAULT
}

export type OrderNotificationType = {
    orderId: number,
    status: number
}
import { TransparentView, View } from "../../../base/View"
import { BText, I18NText, Text } from "../../../base/Text"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { useToast } from "../../../base/Toast";
import { useLanguage } from "../../../base/Themed";


export const DefaultNotificationItem = React.memo((props: NotificationItemData) => {
    const navigation = useNavigation()

    return (
        <Pressable
            style={{ marginHorizontal: 5 }}
            onPress={() => {
                navigation.navigate('FoodList' as never)
            }}>
            <View style={{ backgroundColor: '#c0c6cf', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 1, borderRadius: 10, marginTop: 15, paddingVertical: 10, paddingHorizontal: 10 }}>
                <FontAwesome name="shopping-basket" style={{}} size={22} color='#1b5bc2' />
                <BText text={props.text} numberOfLines={10} style={{ marginLeft: 10, textAlign: 'left', flexShrink: 1, fontWeight: '500', fontSize: 15 }} />
            </View>
        </Pressable>
    )
})

export const OrderStatusNotificationItem = React.memo((props: NotificationItemData) => {
    const navigation = useNavigation()

    const I18NOrders = useLanguage('Orders')
    const I18NOrderStatus = useLanguage(getOrderStatusForNotificaton(props.data.status))

    return (
        <Pressable
            style={{ marginHorizontal: 5 }}
            onPress={() => {
                navigation.navigate('OrderDetail' as never, { orderId: props.data?.orderId } as never)
            }}>
            <View
                style={{
                    backgroundColor: '#c0c6cf', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                    flexShrink: 1, borderRadius: 10, marginTop: 15, paddingVertical: 10, paddingHorizontal: 10
                }}>
                <FontAwesome2 name="fastfood" style={{}} size={22} color='#ab0785' />

                <TransparentView style={{flexDirection: 'row', alignItems: 'center'}}>
                    <BText 
                        text={`${I18NOrders} ${props.data.orderId} ${I18NOrderStatus}`} 
                        style={{ marginLeft: 15,textAlign: 'left', fontWeight: '500', fontSize: 15 }} 
                        numberOfLines={3} />
                </TransparentView>
            </View>
        </Pressable>
    )
})

export const getOrderStatusForNotificaton = (status: number) => {
    switch (status) {
        case 1:
            return "is waiting for shop's confirmation"
        case 2:
            return "is ready to ship"
        case 6:
            return "is waiting for shipper to pickup"
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
        }
    }
}

export type NotificationItemData = {
    id: number,
    type: NotificationType,
    text?: string,
    data?: OrderNotificationType
}

export enum NotificationType {
    ORDER_STATUS_CHANGE,
    DEFAULT
}

export type OrderNotificationType = {
    orderId: number,
    status: number
}
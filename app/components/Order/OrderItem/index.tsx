import React from "react";
import { TransparentView, View } from "../../../base/View";
import { CartItemData } from "../Cart";
import { Text } from "../../../base/Text";
import { Pressable } from "react-native";
import { FontAwesome } from "../../../base/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { formatDateTimeFromData, formatMoney } from "../../../utils/Utils";


export const OrderItem = React.memo((props: OrderData) => {
    const navigation = useNavigation()

    return (
        <View style={{ borderRadius: 15, marginHorizontal: 5, padding: 10, marginBottom: 10 }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TransparentView>
                    <TransparentView style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                            style={{ textAlign: 'left', fontSize: 22, fontWeight: '500' }}
                            text={props.items[0].productDetail.shopName} />
                        <Text text={` # ${props.id}`}/>
                        <Text text={` · ${formatDateTimeFromData(props.createdDate)}`}/>
                    </TransparentView>

                    <TransparentView style={{ marginTop: 5 }}>
                        {
                            props.items.map((i, index) => (
                                <OrderItemCell
                                    key={'order_item_cell' + index}
                                    {...i} />
                            ))
                        }
                    </TransparentView>

                    <TransparentView style={{ marginTop: 5 }}>
                        <Text text={`${formatMoney(props.price)} đ`} style={{ textAlign: 'left', color: 'red', fontSize: 18 }} />
                    </TransparentView>
                </TransparentView>

                <Pressable
                    style={{ padding: 10 }}
                    onPress={() => {
                        navigation.navigate('OrderDetail' as never, { data: props } as never)
                    }}>
                    <FontAwesome name="angle-right" size={30} color='grey' />
                </Pressable>
            </TransparentView>

            <View style={{ marginTop: 10, backgroundColor: '#b6cdcf', alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                <Text text={props.status.toString()} style={{}} />
            </View>
            <View style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />
        </View>
    )
})

export const OrderItemCell = React.memo((props: CartItemData) => {
    return (
        <TransparentView style={{ marginLeft: 15, marginTop: 5 }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text text={props.productDetail.productName} style={{ maxWidth: '80%', textAlign: 'left' }} numberOfLines={3} />
                <Text text='✖' style={{ marginLeft: 10, fontSize: 12 }} />
                <Text text={props.quantity.toString()} style={{ fontSize: 18 }} />
            </TransparentView>
        </TransparentView>
    )
})


export type OrderData = {
    id: number,
    items: CartItemData[],
    price: number,
    status: OrderStatus,
    createdDate: string,
    address: string,
}

export type OrderItemType = {
    item: OrderData,
}

export enum OrderStatus {
    SUBMITTED = "Submitted",
    ACCEPTED = "Accepted",
    CANCELED = "Canceled",
    PROGRESSING = "Progressing",
    DONE = "Done"
}
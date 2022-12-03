import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { CartInnerItem } from "../Cart/CartItem";
import { TransparentView, View } from "../../../base/View";
import { I18NText, Text } from "../../../base/Text";
import { FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome";
import { formatDateTimeFromData, formatMoney, getUserRoleById } from "../../../utils/Utils";
import { useLanguage } from "../../../base/Themed";
import { getOrderStatusIcon, getOrderStatusMsg, OrderData, OrderStatus } from "../OrderItem";
import { Linking, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from "react";
import { getOrderDetail } from "../../../core/apis/Requests";
import { useToast } from "../../../base/Toast";
import { Constant } from "../../../utils/Constant";
import { mapOrderDataFromResponse } from "../OrderQueueScreen";
import { OrderItemShimmer } from "../OrderItemShimmer";


export const OrderDetail = (props: OrderDetailProps) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)

    const [data, setData] = useState<OrderData>(null)

    const showToast = useToast()

    const I18NShipTo = useLanguage('Ship To')
    const I18NShopAddress = useLanguage('Shop Address')

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    const navigateToFoodDetail = (id: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    const fetchData = useCallback(() => {
        setLoading(true)
        getOrderDetail(
            props.route.params?.orderId,
            (response) => {
                const data = response.data
                setData(mapOrderDataFromResponse(data))
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [props.route.params?.orderId])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header
                        title='Order Detail'
                        canNavigateToOrderScreen={true} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                onRefresh={() => fetchData()}
                useScrollView={true}>
                <OrderItemShimmer visible={loading} />
                {
                    !loading ?
                        <TransparentView style={{}}>
                            <TransparentView style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10 }}>
                                <FontAwesome1 name='tagso' size={24} color='#37942b' />
                                <I18NText text='Order Tag' style={{ marginLeft: 10 }} />
                                <Text text={`: ${data.id}`} style={{}} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                <FontAwesome2 name={getOrderStatusIcon(data.status)} size={24} color='#995050' />
                                <I18NText text={getOrderStatusMsg(data.status)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16 }} />
                                {
                                    data.status == OrderStatus.CANCELED ?
                                        <I18NText text={`by ${getUserRoleById(data.roleCancel)}`} style={{ textAlign: 'left', marginLeft: 3, fontSize: 16 }} />
                                        : null
                                }
                            </TransparentView>
                            {
                                data.status == OrderStatus.CANCELED ?
                                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                        <FontAwesome2 name='notes' size={24} color='red' />
                                        <I18NText text='Reason' style={{ marginLeft: 10 }} />
                                        <I18NText text={': ' + data.noteCancel} style={{ textAlign: 'left', fontSize: 16 }} />
                                    </TransparentView>
                                    : null
                            }

                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                <FontAwesome2 name='date-range' size={24} color='#106e7d' />
                                <I18NText text={formatDateTimeFromData(data.createdDate)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16 }} />
                            </TransparentView>

                            <Pressable
                                onPress={() => navigateToShopDetail(data?.items[0]?.productDetail?.shopID)}>
                                <Text text={data.items[0].productDetail.shopName} style={{ textAlign: 'left', fontSize: 20, marginTop: 10, marginHorizontal: 10 }} />
                            </Pressable>

                            <TransparentView style={{ flexDirection: 'row', marginTop: 10 }}>
                                <I18NText text="Price" style={{ textAlign: 'left', fontSize: 20, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 20 }} />
                                <Text text={`${formatMoney(data.price + data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 20, color: 'red', fontWeight: '500' }} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginHorizontal: 10, marginTop: 15 }}>
                                <Text text={I18NShopAddress + ': ' + data.items[0].productDetail.shopAddress} style={{ textAlign: 'left', fontSize: 16, flexShrink: 1 }} numberOfLines={3} />
                            </TransparentView>                           
                            
                             <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginHorizontal: 10, marginTop: 5 }}>
                                <Text text={I18NShipTo + ': ' + data.address} style={{ textAlign: 'left', fontSize: 16, flexShrink: 1 }} numberOfLines={3} />
                            </TransparentView>

                            <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                                <I18NText text="Ship Fee" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                                <Text text={`${formatMoney(data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 18, color: 'red', fontWeight: '500' }} />
                            </TransparentView>

                            <Pressable
                                style={{ flexDirection: 'row', marginTop: 5 }}
                                onPress={() => Linking.openURL(`tel:${data.phone}`)} >

                                <I18NText text="Phone Number" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                                <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                                <Text text={data.phone} style={{ textAlign: 'left', fontSize: 18, fontWeight: '500' }} />
                            </Pressable>

                            <I18NText text="Food" style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, marginHorizontal: 10 }} />

                            {
                                data.items.map((item, index) => (
                                    <TransparentView key={'order_item_' + index}>
                                        <CartInnerItem item={item} />
                                        <View style={{ backgroundColor: 'grey', height: 2, marginVertical: 15, marginHorizontal: 10 }} />
                                    </TransparentView>
                                ))
                            }
                        </TransparentView>
                        : null
                }
            </AnimatedHeader>
        </View>
    )
}

export interface OrderDetailProps {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'OrderDetail'>;
    route: RouteProp<GroupStackParamList, 'OrderDetail'>
}

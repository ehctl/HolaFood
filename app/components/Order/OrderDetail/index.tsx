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
import { getOrderStatusIcon, getOrderStatusMsg, OrderStatus } from "../OrderItem";
import { Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';


export const OrderDetail = (props: OrderDetailProps) => {
    const navigation = useNavigation()
    const I18NShipTo = useLanguage('Ship To')

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    const navigateToFoodDetail = (id: number) => {
        navigation.navigate('FoodDetail' as never, { itemId: id } as never)
    }

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header
                        title='Order Detail'
                        canNavigateToOrderScreen={true} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                useScrollView={true}
                hideReload={true}>

                <TransparentView style={{}}>
                    <TransparentView style={{ flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10 }}>
                        <FontAwesome1 name='tagso' size={24} color='#37942b' />
                        <I18NText text='Order Tag' style={{ marginLeft: 10 }} />
                        <Text text={`: ${props.route.params?.data.id}`} style={{}} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                        <FontAwesome2 name={getOrderStatusIcon(props.route.params?.data.status)} size={24} color='#995050' />
                        <I18NText text={getOrderStatusMsg(props.route.params?.data.status)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16 }} />
                        {
                            props.route.params?.data.status == OrderStatus.CANCELED ?
                                <I18NText text={`by ${getUserRoleById(props.route.params?.data.roleCancel)}`} style={{ textAlign: 'left', marginLeft: 3, fontSize: 16 }} />
                                : null
                        }
                    </TransparentView>
                    {
                        props.route.params?.data.status == OrderStatus.CANCELED ?
                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                                <FontAwesome2 name='notes' size={24} color='red' />
                                <I18NText text='Reason' style={{ marginLeft: 10 }} />
                                <I18NText text={': ' + props.route.params?.data.noteCancel} style={{ textAlign: 'left', fontSize: 16 }} />
                            </TransparentView>
                            : null
                    }

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10, marginTop: 5 }}>
                        <FontAwesome2 name='date-range' size={24} color='#106e7d' />
                        <I18NText text={formatDateTimeFromData(props.route.params?.data.createdDate)} style={{ textAlign: 'left', marginLeft: 10, fontSize: 16 }} />
                    </TransparentView>

                    <Pressable
                        onPress={() => navigateToShopDetail(props.route.params?.data?.items[0]?.productDetail?.shopID)}>
                        <Text text={props.route.params?.data.items[0].productDetail.shopName} style={{ textAlign: 'left', fontSize: 20, marginTop: 10, marginHorizontal: 10 }} />
                    </Pressable>

                    <TransparentView style={{ flexDirection: 'row', marginTop: 10 }}>
                        <I18NText text="Price" style={{ textAlign: 'left', fontSize: 20, marginLeft: 10 }} />
                        <Text text=" : " style={{ textAlign: 'left', fontSize: 20 }} />
                        <Text text={`${formatMoney(props.route.params?.data.price + props.route.params?.data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 20, color: 'red', fontWeight: '500' }} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginHorizontal: 10, marginTop: 20 }}>
                        <Text text={I18NShipTo + ': ' + props.route.params?.data.address} style={{ textAlign: 'left', fontSize: 18, flexShrink: 1 }} numberOfLines={3} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', marginTop: 5 }}>
                        <I18NText text="Ship Fee" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                        <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                        <Text text={`${formatMoney(props.route.params?.data.shipFee)} đ`} style={{ textAlign: 'left', fontSize: 18, color: 'red', fontWeight: '500' }} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', marginTop: 5 }}>
                        <I18NText text="Phone Number" style={{ textAlign: 'left', fontSize: 18, marginLeft: 10 }} />
                        <Text text=" : " style={{ textAlign: 'left', fontSize: 18 }} />
                        <Text text={props.route.params?.data.phone} style={{ textAlign: 'left', fontSize: 18, fontWeight: '500' }} />
                    </TransparentView>

                    <I18NText text="Food" style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, marginHorizontal: 10 }} />

                    {
                        props.route.params?.data.items.map((item, index) => (
                            <TransparentView key={'order_item_' + index}>
                                <CartInnerItem item={item} />
                                <View style={{ backgroundColor: 'grey', height: 2, marginVertical: 15, marginHorizontal: 10 }} />
                            </TransparentView>
                        ))
                    }
                </TransparentView>
            </AnimatedHeader>
        </View>
    )
}

export interface OrderDetailProps {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'OrderDetail'>;
    route: RouteProp<GroupStackParamList, 'OrderDetail'>
}

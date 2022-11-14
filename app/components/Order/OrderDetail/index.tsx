import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { CartInnerItem } from "../Cart/CartItem";
import { TransparentView, View } from "../../../base/View";
import { I18NText, Text } from "../../../base/Text";
import { FontAwesome2 } from "../../../base/FontAwesome";
import { formatMoney } from "../../../utils/Utils";
import { useLanguage } from "../../../base/Themed";

export const OrderDetail = (props: OrderDetailProps) => {
    const I18NShipTo = useLanguage('Ship To')


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
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10 }}>
                        <FontAwesome2 name="av-timer" size={24} />
                        <Text text='Waiting for shop to confirm your order' style={{ textAlign: 'left', marginVertical: 15, marginLeft: 10, fontSize: 16 }} />
                    </TransparentView>

                    <Text text={props.route.params?.data.items[0].productDetail.shopName} style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, marginHorizontal: 10 }} />

                    <TransparentView style={{ flexDirection: 'row' }}>
                        <I18NText text="Price" style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, marginLeft: 10 }} />
                        <Text text=" : " style={{ textAlign: 'left', fontSize: 20, marginVertical: 10 }} />
                        <Text text={`${formatMoney(props.route.params?.data.price)} đ`} style={{ textAlign: 'left', fontSize: 20, marginVertical: 10, color: 'red' }} />
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', flexShrink: 1, marginLeft: 10 }}>
                        <Text text={I18NShipTo + ': ' + props.route.params?.data.address} style={{ textAlign: 'left', fontSize: 18, marginVertical: 10, flexShrink: 1 }} numberOfLines={3} />
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

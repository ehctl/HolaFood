import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import { ActivityIndicator, Image } from 'react-native';
import { getStyle, wait } from "../../utils/Utils";
import { useCallback, useEffect, useState } from "react";
import { Level1Header, Level1HeaderStat } from '../../components/Headers/Level1Header';
import React from "react";
import { AnimatedHeaderScreen } from ".././AnimatedHeaderScreen";
import { FoodDetailData } from "../FoodDetail/FoodDetail";
import { useSelector } from "react-redux";
import { AppState, setNewOrderNotification, setOrders } from "../../redux/Reducer";
import { useDispatch } from "react-redux";
import { BottomStackParamList } from "../../navigation/BottomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/core'
import { OrderPageHeader, OrderPageHeaderStat } from "../../components/Headers/OrderPageHeader";


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
            loadingMore ?
                <ActivityIndicator /> :
                (
                    reachEndOfList ?
                        <Text text="End of list" /> : null
                )
        )
    }

    return (
        <View style={getStyle().flex_c_s}>
            <AnimatedHeaderScreen
                headerProps={{
                    header: <OrderPageHeader />,
                    headerHeight: OrderPageHeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    renderItem: renderItems,
                    data: stateProps.orders,
                    keyExtractor: (_, index) => `${index}`,
                    ListFooterComponent: renderLoadMore()
                }}
                hideReload={true}
            />
        </View>
    )
})

export const OrderItem = React.memo((props: OrderItemType) => {

    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'grey', borderRadius: 15, marginHorizontal: 10, padding: 10, marginBottom: 10 }}>
            <TransparentView style={{marginHorizontal: 10,flexGrow: 1, flexShrink: 1}}>
                <Text text={props.item.name} style={{ textAlign: 'left', fontSize: 20 }} />
                
                <TransparentView style={{ flexDirection: 'row' }}>
                    <Text text="Quantity" />
                    <Text text={`: ${props.quantity}`} />
                </TransparentView>  

                <TransparentView style={{ flexDirection: 'row' }}>
                    <Text text="Price" />
                    <Text text={`: ${props.quantity * props.item.price} đ`} />
                </TransparentView>                

                <TransparentView style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Text text={`${props.item.sellerName}`} style={{fontSize: 18}}/>
                </TransparentView>

                <View style={{marginTop: 5, borderRadius: 10, backgroundColor: '#52c5d9'}}>
                    <Text text="On progress" style={{ paddingVertical: 10}}/>
                </View>
            </TransparentView>
            <TransparentView>
                <Image source={{uri: props.item.images[0]}} style={{height: 125, aspectRatio: 1, borderRadius: 10}}/>
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

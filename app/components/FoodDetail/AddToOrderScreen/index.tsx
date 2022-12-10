import { ActivityIndicator, Alert, Pressable } from "react-native"
import { useSelector } from "react-redux"
import { RadioButton, RadioButtonGroup, RadioButtonIcon } from "../../../base/RadioGroup"
import { TransparentView, View } from "../../../base/View"
import { addOrders, AppState, deleteCartItems } from "../../../redux/Reducer"
import { I18NText, Text } from "../../../base/Text"
import { useCallback, useEffect, useState } from "react"
import { FontAwesome2 } from "../../../base/FontAwesome"
import React from "react"
import { useLanguage } from "../../../base/Themed"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { CartItemData } from "../../Order/Cart"
import { OrderData, OrderStatus } from "../../Order/OrderItem"
import { calculateShipFee, formatCreatedDateType, formatMoney } from "../../../utils/Utils"
import { getDistance } from "../../../core/apis/Requests"
import { addOrdersWithCartId, addOrdersWithCardData } from "../../../core/apis/Requests"
import { Constant } from "../../../utils/Constant"
import { useToast } from "../../../base/Toast"


export const AddToOrderScreen = React.memo((props: AddToOrderType) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo,
        addressList: state.userAddressList,
    }))

    const [address, setAddress] = useState(appStateProps.addressList.length > 0 ? appStateProps.addressList[0].address : '')
    const [listOrder, setListOrder] = useState<OrderData[]>([])
    const [addingOrder, setAddingOrder] = useState(false)
    const [listShipPrice, setListShipPrice] = useState<number[]>(Array(100).fill(0))
    const [listShipPriceWithShopPolicy, setListShipPriceWithShopPolicy] = useState<number[]>(Array(100).fill(0))

    const I18NListEmptyWarning = useLanguage('Your Address List Is Empty. Please Add Your Address!')

    const showToast = useToast()

    useEffect(() => {
        const orders = getOrders()

        if (address.length > 0) {
            orders.forEach((item, index) => {
                getDistance(
                    item.items[0].productDetail.shopAddress,
                    address,
                    (response) => {
                        const distance = response['rows'][0]['elements'][0]['distance']['value']
                        listShipPrice[index] = calculateShipFee(distance, item.items[0].productDetail.cost.filter((i) => i.categoryCost == 2))
                        listShipPriceWithShopPolicy[index] = calculateShipFee(distance, item.items[0].productDetail.cost.filter((i) => i.categoryCost == 1))
                        setListShipPrice([...listShipPrice])
                        setListShipPriceWithShopPolicy([...listShipPriceWithShopPolicy])
                    },
                    (e) => {
                        listShipPrice[index] = 0
                        listShipPriceWithShopPolicy[index] = 0
                        setListShipPrice([...listShipPrice])
                        setListShipPriceWithShopPolicy([...listShipPriceWithShopPolicy])
                        console.log(e)
                    }
                )
            })
        }

        setListOrder(orders)
    }, [address])

    const categorizeNewOrders = useCallback((): CartItemData[][] => {
        const cartItemList = props.route?.params?.cartItems ?? []
        if (cartItemList.length == 0)
            return []

        const hashMap = {}

        cartItemList.forEach((v, _) => {
            if (hashMap[v.productDetail.shopID]) {
                hashMap[v.productDetail.shopID].push(v)
            } else {
                hashMap[v.productDetail.shopID] = [v]
            }
        })

        return Object.values(hashMap)
    }, [props.route?.params?.cartItems])


    const getOrders = useCallback((): OrderData[] => {
        const time = new Date()
        const orders: OrderData[] = categorizeNewOrders().map((item, index) => {
            var price = 0
            item.forEach((i) => price += i.price)

            return {
                id: Math.ceil(Math.random() * 1000),
                items: item,
                status: OrderStatus.SUBMITTED,
                price: price,
                createdDate: formatCreatedDateType(time),
                address: address,
                shipFee: listShipPrice[index],
                shipFeeWithShopPolicy: listShipPriceWithShopPolicy[index],
                phone: appStateProps.userInfo.phone,
            }
        })

        return orders
    }, [categorizeNewOrders, listShipPrice, listShipPriceWithShopPolicy, appStateProps.userInfo])

    const getTotalPrice = useCallback(() => {
        var price = 0
        getOrders().forEach((i) => price += i.price + i.shipFeeWithShopPolicy)
        return price
    }, [getOrders])

    const onOrder = useCallback(() => {
        if (address.length == 0) {
            Alert.alert(I18NListEmptyWarning)
        } else {
            setAddingOrder(true)
            const orders = getOrders()
            orders.sort((i1, i2) => i2.id - i1.id)

            const addOrderFN = props.route.params?.usingNewCartItem ? addOrdersWithCardData : addOrdersWithCartId
            addOrderFN(
                orders,
                (response) => {
                    dispatch(deleteCartItems(props.route?.params?.cartItems?.map((i) => i.id) ?? []))
                    const data = response.data
                    orders.forEach((item, index) => {
                        item.id = data[index].id
                    })
                    orders.sort((i1, i2) => i2.id - i1.id)

                    dispatch(addOrders(orders))
                    setAddingOrder(false)
                    navigation.navigate('Orders' as never)
                },
                (e) => {
                    console.log(e)
                    showToast(Constant.API_ERROR_OCCURRED)
                    setAddingOrder(false)
                }
            )
        }
    }, [address])

    return (
        <AnimatedHeader
            headerProps={{
                header: <Level2Header
                    title='Order'
                    canNavigateToOrderScreen={true}
                    isSlideFromBottom={true} />,
                headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
            }}
            useScrollView={true}
            hideReload={true} >

            <TransparentView>
                <TransparentView style={{ marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome2 name="location-pin" size={20} color='green' style={{ width: 20 }} />
                        <I18NText text="Address" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <RadioButtonGroup
                        value={address}
                        defaultColor='#4fb860'
                        selectedColor='#686db0'
                        valueChange={(v) => { setAddress(v) }} >

                        <TransparentView style={{ margin: 10 }}>
                            {
                                appStateProps.addressList.map((item, index) => (
                                    <TransparentView
                                        key={'address_' + index}
                                        style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#2a5496' }}>
                                        <RadioButton value={item.address} style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                            <RadioButtonIcon size={4} />
                                            <Text text={item.address} style={{ marginHorizontal: 10, textAlign: 'left' }} numberOfLines={3} />
                                        </RadioButton>
                                    </TransparentView>
                                ))
                            }

                            {
                                appStateProps.addressList.length != 5 ?
                                    <Pressable
                                        style={{
                                            marginTop: 10, backgroundColor: '#6aabd9', padding: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 4,
                                            elevation: 5
                                        }}
                                        onPress={() => navigation.navigate('AddAddress' as never)} >

                                        <I18NText text='Add Address' />
                                    </Pressable>
                                    : null
                            }
                        </TransparentView>
                    </RadioButtonGroup>
                </TransparentView>

            </TransparentView>

            <View style={{ height: 15, backgroundColor: 'grey' }} />

            {
                listOrder.map((item, index) => (
                    <View
                        key={`list_order_${index}`}
                        style={{ borderRadius: 15, marginHorizontal: 5, padding: 10, marginBottom: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TransparentView>
                                <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        style={{ textAlign: 'left', fontSize: 22, fontWeight: '500' }}
                                        text={item.items[0].productDetail.shopName.trim()} />
                                </TransparentView>

                                <TransparentView style={{ marginTop: 5 }}>
                                    {
                                        item.items.map((i, index) => (
                                            <TransparentView
                                                key={`order_item_${index}`}
                                                style={{ marginLeft: 15, marginTop: 5 }}>
                                                <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                                    <Text text={i.productDetail.productName.trim()} style={{ maxWidth: '80%', textAlign: 'left' }} numberOfLines={3} />
                                                    <Text text='·' style={{ marginLeft: 10, fontSize: 12 }} />
                                                    <Text text={i.quantity.toString() + '  '} style={{ marginLeft: 10, fontSize: 16 }} />
                                                    <I18NText text='meal' style={{ fontSize: 16 }} />
                                                </TransparentView>
                                            </TransparentView>
                                        ))
                                    }
                                </TransparentView>

                                <TransparentView style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <I18NText text='Price' style={{ textAlign: 'left', fontSize: 16 }} />
                                    <Text text={`: `} style={{ textAlign: 'left', fontSize: 16 }} />
                                    <Text text={`${formatMoney(item.price)} đ`} style={{ textAlign: 'left', color: 'red', fontSize: 16 }} />
                                </TransparentView>

                                <TransparentView style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <I18NText text='Ship Fee' style={{ textAlign: 'left', fontSize: 16 }} />
                                    <Text text={`: `} style={{ textAlign: 'left', fontSize: 16 }} />

                                    <Text text={`${formatMoney(listShipPriceWithShopPolicy[index])} đ`} style={{ textAlign: 'left', color: 'red', fontSize: 16 }} />
                                </TransparentView>

                                <TransparentView style={{ marginTop: 15, flexDirection: 'row' }}>
                                    <I18NText text='Order Price' style={{ textAlign: 'left', fontSize: 22 }} />
                                    <Text text={`: `} style={{ textAlign: 'left', fontSize: 22 }} />
                                    <Text text={`${formatMoney(listShipPriceWithShopPolicy[index] + item.price)} đ`} style={{ textAlign: 'left', color: 'red', fontSize: 22 }} />
                                </TransparentView>
                            </TransparentView>

                        </TransparentView>

                        <View style={{ backgroundColor: 'grey', height: 2, marginTop: 10 }} />
                    </View>
                ))
            }

            {
                listOrder.length > 1 ?
                    <TransparentView style={{ marginHorizontal: 10, marginTop: 15, flexDirection: 'row' }}>
                        <I18NText text='Total Price' style={{ textAlign: 'left', fontSize: 24 }} />
                        <Text text={`: `} style={{ textAlign: 'left', fontSize: 24 }} />
                        <Text text={`${formatMoney(getTotalPrice())} đ`} style={{ textAlign: 'left', color: 'red', fontSize: 24 }} />
                    </TransparentView> : null
            }

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <I18NText text='· Thanh toán khi nhận hàng' style={{ marginLeft: 10, textAlign: 'left', fontSize: 18, fontWeight: '500', flexGrow: 1, flexShrink: 1 }} numberOfLines={3}/>
            </TransparentView>

            <Pressable
                style={{
                    marginTop: 35, marginHorizontal: 10, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => onOrder()} >

                <I18NText text='Order' />

                <ActivityIndicator
                    animating={addingOrder}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>
        </AnimatedHeader >
    )
})



export interface AddToOrderType {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'AddToOrder'>;
    route: RouteProp<GroupStackParamList, 'AddToOrder'>
}

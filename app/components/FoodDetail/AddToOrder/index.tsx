import { TextInput } from "react-native"
import { useSelector } from "react-redux"
import { RadioButton, RadioButtonGroup, RadioButtonIcon } from "../../../base/RadioGroup"
import { TransparentView } from "../../../base/View"
import { addOrders, AppState, deleteCartItems } from "../../../redux/Reducer"
import { I18NText, Text } from "../../../base/Text"
import { useCallback, useState } from "react"
import { FontAwesome2 } from "../../../base/FontAwesome"
import React from "react"
import { useLanguage } from "../../../base/Themed"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { Button } from "../../../base/Button"
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { CartItemData } from "../../Order/Cart"
import { OrderStatus } from "../../Order/OrderItem"
import { formatCreatedDateType } from "../../../utils/Utils"

export const AddToOrder = React.memo((props: AddToOrderType) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const appStateProps = useSelector((state: AppState) => ({
        addressList: state.userAddressList,
    }))

    const [address, setAddress] = useState(appStateProps.addressList.length > 0 ? appStateProps.addressList[0].address : '#custom')
    const [customeAddressErrorMsg, setCustomAddressErrorMsg] = useState('')
    const [customAddress, setCustomAddress] = useState('')

    const I18NCustomAddress = useLanguage('Custom Address')

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

    const isUsingCustomAddress = useCallback(() => {
        return address == '#custom'
    }, [address])

    const onOrder = useCallback(() => {
        if ( !isUsingCustomAddress() || customAddress.length > 0) {
            const time = new Date()
            const orders = categorizeNewOrders().map((item) => {
                var price = 0
                item.forEach((i) => price += i.price)

                return {
                    id: Math.ceil(Math.random() * 1000),
                    items: item,
                    status: OrderStatus.SUBMITTED,
                    price: price,
                    createdDate: formatCreatedDateType(time),
                    address: isUsingCustomAddress() ? customAddress : address
                }
            })

            dispatch(deleteCartItems(props.route?.params?.cartItems?.map((i) => i.id) ?? []))
            dispatch(addOrders(orders))
            navigation.navigate('Orders' as never)
        } else {
            setCustomAddressErrorMsg('Text can not empty')
        }
    }, [customAddress, address])

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
                                            <Text text={item.address} style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                        </RadioButton>
                                    </TransparentView>
                                ))
                            }

                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#2a5496', overflow: "hidden" }}>
                                <RadioButton value={`#custom`} style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TransparentView style={{ margin: 10, marginRight: 5 }}>
                                        <RadioButtonIcon size={4} />
                                    </TransparentView>
                                    <TextInput
                                        style={{ flexGrow: 1, height: '100%', paddingTop: 10, paddingBottom: 10, paddingHorizontal: 5, borderRadius: 10, fontSize: 16, flexShrink: 1 }}
                                        multiline={true}
                                        value={customAddress}
                                        onChangeText={(v) => setCustomAddress(v)}
                                        placeholder={I18NCustomAddress} />

                                </RadioButton>
                            </TransparentView>
                            <Text text={customeAddressErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} />
                        </TransparentView>
                    </RadioButtonGroup>
                </TransparentView>

            </TransparentView>


            <Button
                text={"Order"}
                textSize={20}
                style={{
                    marginHorizontal: 15, borderRadius: 10, marginBottom: 20,
                    marginTop: 5
                }}
                onPress={() => onOrder()} />
        </AnimatedHeader>
    )
})



export interface AddToOrderType {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'AddToOrder'>;
    route: RouteProp<GroupStackParamList, 'AddToOrder'>
}

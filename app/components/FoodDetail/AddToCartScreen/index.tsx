import { useCallback, useEffect, useState } from "react"
import { TransparentView, } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import React from "react"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome"
import { Button } from "../../../base/Button"
import { TextInput } from "react-native-gesture-handler"
import { Pressable } from "react-native"
import { Select, SelectGroup, SelectIcon } from "../../../base/SellectGroup"
import { useDispatch } from "react-redux"
import { addCartItems, AppState, updateCartItem } from "../../../redux/Reducer"
import { useLanguage } from "../../../base/Themed"
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from "../../../navigation/StackGroup"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { formatMoney } from "../../../utils/Utils"

export const AddToCartScreen = React.memo((props: AddToCartType) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [quantity, setQuantity] = useState(props.route.params?.isUpdateMode ? props.route.params?.cartItemDetail.quantity : 1)
    const [option, setOption] = useState(props.route.params?.isUpdateMode ? props.route.params?.cartItemDetail.option.map((i) => i.id) : [])
    const [price, setPrice] = useState(props.route.params?.isUpdateMode ? props.route.params?.cartItemDetail.price : 0)
    const [note, setNote] = useState(props.route.params?.isUpdateMode ? props.route.params?.cartItemDetail.note : '')
    const [itemData, setItemData] = useState(props.route.params?.isUpdateMode ? props.route.params?.cartItemDetail.productDetail : props.route.params?.foodDetail)

    const I18NNote = useLanguage('Ghi chú')

    useEffect(() => {
        if (props.route.params?.isUpdateMode && props.route.params?.cartItemDetail) {
            setItemData(props.route.params?.cartItemDetail.productDetail)
            setQuantity(props.route.params?.cartItemDetail.quantity)
            setOption(props.route.params?.cartItemDetail.option.map((i) => i.id))
            setPrice(props.route.params?.cartItemDetail.price)
            setNote(props.route.params?.cartItemDetail.note)
        }

    }, [props.route.params?.cartItemDetail?.id])

    useEffect(() => {
        var currPrice = parseInt(itemData.sellPrice.toString())
        option.forEach((v) => {
            currPrice += itemData.option.filter((item) => item.id == v)[0].optionPrice
        })

        setPrice(currPrice * quantity)
    }, [quantity, option])


    const onClick = useCallback(() => {
        dispatch(
            props.route.params?.isUpdateMode ?
                updateCartItem({
                    id: props.route.params?.cartItemDetail.id,
                    productDetail: itemData,
                    quantity: quantity,
                    option: option.map((optionId) => itemData.option.filter((item) => item.id === optionId)[0]),
                    note: note,
                    price: price,
                }) :
                addCartItems([{
                    id: Math.floor(Math.random() * 1000),
                    productDetail: itemData,
                    quantity: quantity,
                    option: option.map((optionId) => itemData.option.filter((item) => item.id === optionId)[0]),
                    note: note,
                    price: price,
                }])
        )
        navigation.goBack()

    }, [quantity, itemData, option, note, price])

    const onAddToOrder = useCallback(() => {
        navigation.navigate('AddToOrder' as never, {
            cartItems: [
                {
                    id: Math.floor(Math.random() * 1000),
                    productDetail: itemData,
                    quantity: quantity,
                    option: option.map((optionId) => itemData.option.filter((item) => item.id === optionId)[0]),
                    note: note,
                    price: price,
                }
            ]
        } as never)
    }, [quantity, itemData, option, note, price])

    return (
        <AnimatedHeader
            headerProps={{
                header: <Level2Header
                    title='Cart'
                    canNavigateToOrderScreen={true}
                    isSlideFromBottom={true} />,
                headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
            }}
            useScrollView={true}
            hideReload={true} >


            {
                itemData.option.length != 0 ?
                    <TransparentView style={{ marginTop: 5, marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome2 name="format-size" size={20} color='green' style={{ width: 20 }} />
                            <I18NText text="Option" style={{ fontSize: 20, marginLeft: 5 }} />
                        </TransparentView>

                        <SelectGroup value={props.route.params?.cartItemDetail?.option.map((i) => i.id)} valueChange={(v) => { setOption(v) }} defaultColor='#4fb860' selectedColor='#686db0'>
                            <TransparentView style={{ margin: 10 }}>
                                {
                                    itemData.option.map((item, index) => (
                                        <TransparentView
                                            key={'option_' + index}
                                            style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#2a5496' }}>
                                            <Select value={item.id} style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                                <SelectIcon size={4} />
                                                <TransparentView style={{ marginHorizontal: 10 }}>
                                                    <Text text={item.optionName} numberOfLines={3} style={{ textAlign: 'left' }} />
                                                    <Text text={`${item.optionPrice} đ`} style={{ textAlign: 'left', color: 'grey', fontSize: 14 }} numberOfLines={3} />
                                                </TransparentView>
                                            </Select>
                                        </TransparentView>
                                    ))
                                }
                            </TransparentView>
                        </SelectGroup>
                    </TransparentView>
                    : null
            }


            <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15, alignContent: 'center' }}>
                <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome2 name="show-chart" size={20} color='green' style={{ width: 20 }} />
                    <I18NText text="Quantity" style={{ fontSize: 20, marginLeft: 5 }} />
                </TransparentView>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10, flexGrow: 1 }}>
                    <Pressable style={{ paddingHorizontal: 10 }} onPress={() => { setQuantity(Math.max(1, quantity - 1)) }} >
                        <FontAwesome1 name="minus" size={20} />
                    </Pressable>
                    <TextInput
                        keyboardType="decimal-pad" defaultValue="1"
                        style={{ borderWidth: 0.5, borderColor: '#2a5496', paddingHorizontal: 10, marginHorizontal: 15, fontSize: 28, borderRadius: 10, width: '40%', textAlign: 'center' }}
                        value={`${quantity}`}
                        onChangeText={(text) => setQuantity(text != '' ? Math.min(100, Math.max(1, parseInt(text))) : 1)} />
                    <Pressable style={{ paddingHorizontal: 10 }} onPress={() => { setQuantity(Math.min(10, quantity + 1)) }} >
                        <FontAwesome1 name="plus" size={20} />
                    </Pressable>
                </TransparentView>
            </TransparentView>

            <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="dollar" size={22} color='green' style={{ width: 20 }} />
                    <I18NText text="Price" style={{ fontSize: 20, marginLeft: 5 }} />
                </TransparentView>
                <Text text={`: ${formatMoney(price)} đ`} style={{ fontSize: 22 }} />
            </TransparentView>

            <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                <TextInput
                    style={{ fontSize: 18, paddingHorizontal: 10, marginHorizontal: 15, paddingVertical: 20, paddingTop: 15, backgroundColor: '#cdd1d1', flex: 1, borderRadius: 10 }}
                    multiline={true}
                    value={note}
                    onChangeText={(v) => setNote(v)}
                    placeholder={I18NNote} />
            </TransparentView>

            <Button
                text={props.route.params?.isUpdateMode ? "Update" : "Add To Cart"}
                textSize={20}
                style={{
                    marginHorizontal: 15, borderRadius: 10,
                    marginTop: 20
                }}
                onPress={() => { onClick() }} />
            {
                props.route.params?.isUpdateMode ?
                    null :
                    <Button
                        text={"Order Now"}
                        textSize={20}
                        style={{
                            marginHorizontal: 15, borderRadius: 10, marginBottom: 20,
                            marginTop: 5
                        }}
                        onPress={() => onAddToOrder()} />
            }

        </AnimatedHeader>
    )
})

export interface AddToCartType {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'AddToCart'>;
    route: RouteProp<GroupStackParamList, 'AddToCart'>
}

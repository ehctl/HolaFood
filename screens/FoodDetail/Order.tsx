import { useRef, useState } from "react"
import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetail"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../components/FontAwesome"
import { Button } from "../../components/Button"
import { TextInput } from "react-native-gesture-handler"
import { PopupModal } from "../../components/PopupModal"
import { isIosDevice, useKeyboard } from "../../utils/Utils"
import { max } from "react-native-reanimated"


export const Order = React.memo((props: FoodDetailData) => {
    const [quantity, setQuantity] = useState(1)
    const keyboardHeight = isIosDevice() ? useKeyboard() : 0
    const popupModal = useRef(null)

    return (
        <View>
            <Button
                style={{ marginVertical: 25 }}
                text="Order"
                onPress={() => {
                    popupModal.current.changeVisibility(true)
                }} />


            <PopupModal ref={popupModal}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text text="Order" style={{ fontSize: 20 }} />
                    <FontAwesome1 name="close" size={28} onPress={() => popupModal.current.changeVisibility(false)} style={{ paddingVertical: 15 }} />
                </TransparentView>

                <View style={{ height: 1, backgroundColor: 'grey' }} />

                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15, alignContent: 'center' }}>
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome2 name="show-chart" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Quantity" style={{ fontSize: 28, marginLeft: 5 }} />
                        <Text text=":" style={{ fontSize: 28, marginLeft: 5 }} />
                    </TransparentView>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10, flexGrow: 1 }}>
                        <FontAwesome name="minus" size={24} style={{}} onPress={() => { setQuantity(Math.max(1, quantity - 1)) }} />
                        <TextInput
                            keyboardType="decimal-pad" defaultValue="1"
                            style={{ borderWidth: 0.5, paddingHorizontal: 10, marginHorizontal: 15, fontSize: 28, borderRadius: 10, width: '40%', textAlign: 'center' }}
                            value={`${quantity}`}
                            onChangeText={(text) => setQuantity(text != '' ? Math.min(100, Math.max(1, parseInt(text))) : 1)} />
                        <FontAwesome name="plus" size={24} onPress={() => { setQuantity(Math.min(100, quantity + 1)) }} />
                    </TransparentView>
                </TransparentView>

                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="dollar" size={22} color='green' style={{ width: 20 }} />
                        <Text text="Price" style={{ fontSize: 22, marginLeft: 5 }} />
                    </TransparentView>
                    <Text text={`: ${props.price * quantity}`} style={{ fontSize: 22 }} />
                </TransparentView>

                <Button
                    text="Order"
                    textSize={20}
                    style={{
                        marginHorizontal: 15, borderRadius: 15, marginBottom: 20,
                        marginTop: 15
                    }}
                    onPress={() => {
                        popupModal.current.changeVisibility(false)
                        console.log('Order price: ', props.price * quantity)
                    }} />

                <TransparentView style={{ height: isIosDevice() ? keyboardHeight : 0 }} />
            </PopupModal>
        </View>
    )
})
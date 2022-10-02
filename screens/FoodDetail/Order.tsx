import { useState } from "react"
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native"
import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetail"
import { FontAwesome } from "../../components/FontAwesome"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Button } from "../../components/Button"
import { TextInput } from "react-native-gesture-handler"


export const Order = React.memo((props: FoodDetailData) => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [quantity, setQuantity] = useState(1)

    return (
        <View>
            <Button
                style={{ marginVertical: 25 }}
                text="Order"
                onPress={() => {
                    setModalVisibility(true)
                }} />


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibility}
                onRequestClose={() => {
                    setModalVisibility(!modalVisibility);
                }} >

                <View
                    style={{
                        position: 'absolute', opacity: 1, left: 5, right: 5, bottom: 0, paddingHorizontal: 10,
                        backgroundColor: '#96a393', borderTopLeftRadius: 15, borderTopRightRadius: 15
                    }} >

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text text="Order" />
                        <FontAwesome name="close" size={40} onPress={() => setModalVisibility(false)} style={{ padding: 10 }} />
                    </TransparentView>

                    <View style={{height: 1}}/>

                    <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15, alignContent: 'center', justifyContent: 'space-between' }}>
                        <TransparentView style={{ flexDirection: 'row', alignContent: 'center' }}>
                            <TransparentView style={{ justifyContent: 'center' }}>
                                <Text text="Quantity" style={{ fontSize: 28 }} />
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <TransparentView style={{ justifyContent: 'center' }}>
                                    <Text text={`: ${quantity}`} style={{ fontSize: 28 }} />
                                </TransparentView>
                            </TransparentView>
                        </TransparentView>

                        <TransparentView style={{ marginLeft: 10 }}>
                            <FontAwesome style={{ padding: 5 }} name="plus-circle" size={26} onPress={() => setQuantity(Math.min(quantity + 1, 10))} />
                            <FontAwesome style={{ padding: 5 }} name="minus-circle" size={26} onPress={() => setQuantity(Math.max(quantity - 1, 1))} />
                        </TransparentView>
                    </TransparentView>

                    <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                        <Text text="Price" style={{ fontSize: 22 }} />
                        <Text text={`: ${props.price * quantity}`} style={{ fontSize: 22 }} />
                    </TransparentView>

                    <Button
                        text="Order"
                        textSize={24}
                        style={{ 
                            marginHorizontal: 15, borderTopRightRadius: 15, borderTopLeftRadius: 15, 
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0, height: 50,
                            marginTop: 15
                        }}
                        onPress={() => {
                            setModalVisibility(false)
                            console.log('Order price: ', props.price * quantity)
                        }} />
                </View>
            </Modal>
        </View>
    )
})
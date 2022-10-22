import { useRef, useState } from "react"
import { TransparentView, View } from "../../base/View"
import { I18NText, Text } from "../../base/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetailScreen"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../base/FontAwesome"
import { Button } from "../../base/Button"
import { TextInput } from "react-native-gesture-handler"
import { PopupModal } from "../../base/PopupModal"
import { isIosDevice, useKeyboard } from "../../utils/Utils"
import { RadioButtonGroup } from "../../base/RadioGroup/RadioButtonGroup"
import { RadioButton, RadioButtonIcon } from "../../base/RadioGroup/RadioButton"
import { Pressable, ScrollView } from "react-native"


export const Order = React.memo((props: FoodDetailData) => {
    const [quantity, setQuantity] = useState(1)
    const popupModal = useRef(null)

    return (
        <View>
            <Pressable
                style={{backgroundColor: '#dea30d', paddingVertical: 15, borderRadius: 10, marginVertical: 15}}
                onPress={() => {
                    popupModal.current.changeVisibility(true)
                }}>
                <I18NText text="Order" style={{fontSize: 18, fontWeight: '500'}}/>
            </Pressable>

            <PopupModal
                ref={popupModal}
                title='Order'
                shouldAvoidKeyboard={true} >
                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15, alignContent: 'center' }}>
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome2 name="show-chart" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Quantity" style={{ fontSize: 20, marginLeft: 5 }} />
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

                <TransparentView style={{ marginTop: 15, marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome2 name="format-size" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Size" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <RadioButtonGroup value="1" valueChange={(v) => { }} defaultColor='#4fb860' selectedColor='#686db0'>

                        <TransparentView style={{ margin: 10 }}>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="1" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Small" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="2" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Medium" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="3" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Large" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                        </TransparentView>
                    </RadioButtonGroup>
                </TransparentView>
                <TransparentView style={{ marginTop: 15, marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome2 name="format-size" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Size" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <RadioButtonGroup value="1" valueChange={(v) => { }} defaultColor='#4fb860' selectedColor='#686db0'>

                        <TransparentView style={{ margin: 10 }}>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="1" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Small" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="2" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Medium" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="3" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Large" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                        </TransparentView>
                    </RadioButtonGroup>
                </TransparentView>

                <TransparentView style={{ marginTop: 15, marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome2 name="format-size" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Size" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <RadioButtonGroup value="1" valueChange={(v) => { }} defaultColor='#4fb860' selectedColor='#686db0'>

                        <TransparentView style={{ margin: 10 }}>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="1" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Small" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="2" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Medium" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="3" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Large" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                        </TransparentView>
                    </RadioButtonGroup>
                </TransparentView>

                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="dollar" size={22} color='green' style={{ width: 20 }} />
                        <Text text="Price" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>
                    <Text text={`: ${props.price * quantity}`} style={{ fontSize: 22 }} />
                </TransparentView>

                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                    <TextInput
                        style={{ fontSize: 18, paddingHorizontal: 10, paddingVertical: 20, paddingTop: 15, backgroundColor: '#cdd1d1', width: '100%', borderRadius: 10 }}
                        multiline={true}
                        placeholder='Note' />
                </TransparentView>

                <Button
                    text="Order"
                    textSize={20}
                    style={{
                        marginHorizontal: 0, borderRadius: 15, marginBottom: 20,
                        marginTop: 15, marginLeft: 15
                    }}
                    onPress={() => {
                        popupModal.current.changeVisibility(false)
                        console.log('Order price: ', props.price * quantity)
                    }} />

            </PopupModal>
        </View>
    )
})
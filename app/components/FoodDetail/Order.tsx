import { useRef, useState } from "react"
import { TransparentView, View } from "../../base/View"
import { I18NText, Text } from "../../base/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetailScreen"
import { FontAwesome, FontAwesome2 } from "../../base/FontAwesome"
import { Button } from "../../base/Button"
import { TextInput } from "react-native-gesture-handler"
import { PopupModal } from "../../base/PopupModal"
import { RadioButtonGroup, RadioButton, RadioButtonIcon } from "../../base/RadioGroup"
import { Pressable } from "react-native"
import { Select, SelectGroup, SelectIcon } from "../../base/SellectGroup"


export const Order = React.memo((props: FoodDetailData) => {
    const [quantity, setQuantity] = useState(1)
    const [customAddress, setCustomAddress] = useState(false)
    const [customAddressFocus, setCustomAddressFocus] = useState(false)
    const popupModal = useRef(null)

    return (
        <View>
            <Pressable
                style={{ backgroundColor: '#dea30d', paddingVertical: 15, borderRadius: 10, marginVertical: 15 }}
                onPress={() => {
                    popupModal.current.changeVisibility(true)
                }}>
                <I18NText text="Order" style={{ fontSize: 18, fontWeight: '500' }} />
            </Pressable>

            <PopupModal
                ref={popupModal}
                title='Order'
                shouldAvoidKeyboard={true} >
                <TransparentView style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15, alignContent: 'center' }}>
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome2 name="show-chart" size={20} color='green' style={{ width: 20 }} />
                        <I18NText text="Quantity" style={{ fontSize: 20, marginLeft: 5 }} />
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
                        <I18NText text="Size" style={{ fontSize: 20, marginLeft: 5 }} />
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
                        <Text text="Options" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <SelectGroup valueChange={(v) => { }} defaultColor='#4fb860' selectedColor='#686db0'>

                        <TransparentView style={{ margin: 10 }}>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <Select value="1" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <SelectIcon size={4} />
                                    <Text text="Topping Đào" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </Select>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <Select value="2" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <SelectIcon size={4} />
                                    <Text text="Topping Cam" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </Select>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <Select value="3" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <SelectIcon size={4} />
                                    <Text text="Topping Xả" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </Select>
                            </TransparentView>
                        </TransparentView>
                    </SelectGroup>
                </TransparentView>

                <TransparentView style={{ marginTop: 15, marginLeft: 15, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome2 name="location-pin" size={20} color='green' style={{ width: 20 }} />
                        <Text text="Address" style={{ fontSize: 20, marginLeft: 5 }} />
                    </TransparentView>

                    <RadioButtonGroup value="1" valueChange={(v) => { }} defaultColor='#4fb860' selectedColor='#686db0'>
                        <TransparentView style={{ margin: 10 }}>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="Thạch Hòa, Thạch Thất, Hà Nội" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Thạch Hòa, Thạch Thất, Hà Nội" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="Hồ Chí Minh" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="Hồ Chí Minh" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1 }}>
                                <RadioButton value="An Khánh, Hoài Đức, Hà Nội" style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                                    <RadioButtonIcon size={4} />
                                    <Text text="An Khánh, Hoài Đức, Hà Nội" style={{ marginHorizontal: 10 }} numberOfLines={3} />
                                </RadioButton>
                            </TransparentView>
                            <TransparentView style={{ flexDirection: 'row', marginVertical: 5, borderRadius: 10, borderWidth: 1, overflow: "hidden" }}>
                                <RadioButton value={`custom#${customAddress}`} style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <TransparentView style={{margin: 10, marginRight: 5}}>
                                        <RadioButtonIcon size={4} />
                                    </TransparentView>
                                    <TextInput
                                        style={{ flexGrow: 1, height: '100%', paddingTop: 10, paddingBottom: 10, paddingHorizontal: 5,  borderRadius: 10, fontSize: 16, flexShrink: 1, backgroundColor: customAddressFocus ? '#cdd1d1' : null }}
                                        onFocus={(_) => {setCustomAddressFocus(true)}}
                                        onBlur={(_) => {setCustomAddressFocus(false)}}
                                        multiline={true}
                                        placeholder='Custom Address' />
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
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Alert, Image, Pressable } from "react-native"
import { I18NText, Text } from "../../../base/Text"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome"
import { useRef, useState } from "react"
import { useNavigation } from '@react-navigation/native';
import { PopupModal } from "../../../base/PopupModal"
import { TextInput } from "react-native-gesture-handler"
import { Button } from "../../../base/Button"
import { Info } from "./Info"

export const AccountScreen = () => {
    const navigation = useNavigation<any>()
    const popupModal = useRef(null)
    const [addressList, setAdressList] = useState(getListAddress())
    const [newAdress, setNewAdress] = useState('')
    const [addressValidationMsg, setAddressValidationMsg] = useState('')

    return (
        <AnimatedHeader
            headerProps={{
                header: <Level2Header title="Account" />,
                headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
            }}
            useScrollView={true}
            hideReload={true}>
            <TransparentView>
                <Info />

                <View style={{ alignItems: 'flex-start', marginTop: 30, paddingVertical: 10 }}>
                    <I18NText
                        text="Saved Address"
                        style={{ color: 'black', fontSize: 18, fontWeight: '500', backgroundColor: '#ebebeb', width: '100%', textAlign: 'left', paddingVertical: 15, paddingHorizontal: 10 }} />

                    <TransparentView style={{ marginHorizontal: 20 }}>
                        {
                            addressList.map((value: string, index: number) => (
                                <TransparentView key={index} style={{ justifyContent: 'center', width: '100%' }}>
                                    <TransparentView style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <FontAwesome2 name="location-on" size={16} color='grey' />
                                            <Text text={value} style={{ marginLeft: 10, textAlign: 'left' }} />
                                        </TransparentView>
                                        <TransparentView>
                                            <FontAwesome1
                                                name="close" size={18} color='grey' style={{ padding: 5 }}
                                                onPress={() =>
                                                    Alert.alert(
                                                        "Delete Address",
                                                        `Are you sure you want to delete this address: "${value}"?`,
                                                        [
                                                            {
                                                                text: "Cancel",
                                                                onPress: () => console.log("Cancel Pressed"),
                                                                style: "cancel"
                                                            },
                                                            { text: "Delete", onPress: () => { console.log("OK Pressed"); setAdressList(addressList.filter((_, i) => i !== index)) } }
                                                        ]
                                                    )
                                                } />
                                        </TransparentView>
                                    </TransparentView>
                                    <View style={{ backgroundColor: 'grey', height: 1, marginVertical: 5 }} />
                                </TransparentView>
                            ))
                        }

                    </TransparentView>

                    <TransparentView style={{ paddingHorizontal: 10, paddingVertical: 10, marginTop: 5 }}>
                        <Pressable
                            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                            onPress={() => popupModal.current.changeVisibility(true)}>
                            <FontAwesome name="plus-square-o" size={20} color='#288c26' />
                            <I18NText text="Add Address" style={{ textAlign: 'left', color: '#288c26', fontSize: 20, marginLeft: 10 }} />
                        </Pressable>
                    </TransparentView>
                </View>

                <View style={{ backgroundColor: '#d4d9d4', height: 15, width: '100%' }} />

                <TransparentView>
                    <Pressable
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => {
                            navigation.replace('Authentication')
                        }}>
                        <FontAwesome2 name="logout" size={20} style={{ marginLeft: 10 }} />
                        <I18NText
                            text="Log Out"
                            style={{ fontSize: 18, fontWeight: '500', width: '100%', textAlign: 'left', paddingVertical: 15, paddingHorizontal: 10 }} />
                    </Pressable>
                </TransparentView>

                <View style={{ backgroundColor: '#d4d9d4', height: 1, width: '100%' }} />
            </TransparentView>

            <PopupModal title="Address" ref={popupModal} shouldAvoidKeyboard={true}>
                <TransparentView>
                    <TextInput
                        placeholder="Address"
                        multiline={true}
                        style={{ backgroundColor: '#ebebeb', marginTop: 40, paddingTop: 15, paddingBottom: 15, paddingHorizontal: 10, fontSize: 22, borderRadius: 10 }}
                        onChangeText={(v) => { setNewAdress(v), setAddressValidationMsg('') }}
                        value={newAdress} />

                    <Text text={addressValidationMsg} style={{ color: 'red', marginBottom: 40, marginTop: 10 }} />

                    <Button
                        text="Add"
                        textSize={20}
                        style={{
                            marginHorizontal: 0, borderRadius: 15, marginBottom: 20,
                            marginTop: 15, marginLeft: 15
                        }}
                        onPress={() => {
                            if (newAdress.length == 0)
                                setAddressValidationMsg('Address can not empty')
                            else {
                                setAdressList([...addressList, newAdress.trim()])
                                setNewAdress('')
                                popupModal.current.changeVisibility(false)
                            }
                        }} />

                </TransparentView>
            </PopupModal>
        </AnimatedHeader>
    )
}



const getListAddress = () => {
    return ([
        'Thạch Hòa, Thạch Thất, Hà Nội',
        'Thạch Hòa, Thạch Thất, Hà Nội',
        'An Khánh, Hoài Đức, Hà Nội'
    ])
}
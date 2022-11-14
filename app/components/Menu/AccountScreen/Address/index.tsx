
import { TransparentView, View } from "../../../../base/View"
import { ActivityIndicator, Alert, Pressable } from "react-native"
import { I18NText, Text } from "../../../../base/Text"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../../base/FontAwesome"
import { useCallback, useEffect, useRef, useState } from "react"
import { PopupModal } from "../../../../base/PopupModal"
import { TextInput } from "react-native-gesture-handler"
import React from "react"
import { addNewAddress, deleteAddress } from "../../../../core/apis/Requests"
import { useSelector } from "react-redux"
import { AppState, deleteUserAddress, setUserAddressList, UserAddress } from "../../../../redux/Reducer"
import { useDispatch } from "react-redux"
import { isValidNormalText } from "../../../../validation/validate"
import { useLanguage } from "../../../../base/Themed"

export const Address = React.memo(() => {
    const dispatch = useDispatch()
    const appStateProps = useSelector((appState: AppState) => ({
        addressList: appState.userAddressList
    }))
    const [newAddress, setNewAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [addressValidationMsg, setAddressValidationMsg] = useState('')
    const popupModal = useRef(null)

    const I18NCancel = useLanguage("Cancel")
    const I18NDelete = useLanguage("Delete")
    const I18NDeleteAddress = useLanguage("Delete Address")
    const I18NDeleteAddressConfirm = useLanguage("Are you sure you want to delete this address")

    const onAddNewAddress = useCallback(() => {
        const newAddressValidate = isValidNormalText(newAddress)
        if (!newAddressValidate.qualify) {
            setAddressValidationMsg(newAddressValidate.message)
        } else {
            setLoading(true)
            addNewAddress(
                newAddress,
                (response) => {
                    const list = [...appStateProps.addressList]
                    list.push({
                        id: response?.address?.id,
                        address: newAddress
                    })
                    dispatch(setUserAddressList(list))
                    popupModal.current.changeVisibility(false)
                    setLoading(false)
                },
                (e) => {
                    setAddressValidationMsg(e)
                    setLoading(false)
                }
            )
        }
    }, [newAddress])

    const onDeleteAddress = useCallback((id: number) => {
        setLoadingDelete(true)

        deleteAddress(
            id,
            (response) => {
                setLoadingDelete(false)
                dispatch(deleteUserAddress(id))
            },
            (e) => {
                setLoadingDelete(false)
                console.log(e)
            }
        )
    }, [])

    return (
        <TransparentView style={{ alignItems: 'flex-start', marginTop: 30, paddingVertical: 10 }}>
            <View
                style={{ backgroundColor: '#ebebeb', width: '100%', paddingVertical: 15, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                <I18NText
                    text="Saved Address"
                    style={{ color: 'black', fontSize: 18, fontWeight: '500', textAlign: 'left' }} />

                <ActivityIndicator
                    animating={loadingDelete}
                    color='black' />
            </View>

            <TransparentView style={{ marginHorizontal: 20 }}>
                {
                    appStateProps.addressList.map((item: UserAddress, index: number) => (
                        <TransparentView key={index} style={{ justifyContent: 'center', width: '100%' }}>
                            <TransparentView style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexGrow:1, flexShrink: 1 }}>
                                    <FontAwesome2 name="location-on" size={16} color='grey' />
                                    <Text text={item.address } style={{flexShrink: 1, marginLeft: 10, textAlign: 'left' }} numberOfLines={3}/>
                                </TransparentView>
                                <TransparentView>
                                    <FontAwesome1
                                        name="close" size={18} color='grey' style={{ padding: 5 }}
                                        onPress={() =>
                                            Alert.alert(
                                                I18NDeleteAddress,
                                                I18NDeleteAddressConfirm + `: "${item.address}"?`,
                                                [
                                                    {
                                                        text: I18NCancel,
                                                        onPress: () => console.log("Cancel Pressed"),
                                                        style: "cancel"
                                                    },
                                                    { text: I18NDelete, onPress: () => onDeleteAddress(item.id) }
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
                    onPress={() => {
                        popupModal.current.changeVisibility(true)
                    }}>
                    <FontAwesome name="plus-square-o" size={20} color='#288c26' />
                    <I18NText text="Add Address" style={{ textAlign: 'left', color: '#288c26', fontSize: 20, marginLeft: 10 }} />
                </Pressable>
            </TransparentView>

            <PopupModal title="Address" ref={popupModal} shouldAvoidKeyboard={true}>
                <TransparentView>
                    <TextInput
                        placeholder="Address"
                        multiline={true}
                        style={{ backgroundColor: '#ebebeb', marginTop: 20, paddingTop: 15, paddingBottom: 15, paddingHorizontal: 10, fontSize: 22, borderRadius: 10 }}
                        onChangeText={(v) => { setNewAddress(v), setAddressValidationMsg('') }} />

                    <I18NText text={addressValidationMsg} style={{ color: '#cc1818', marginBottom: 20, marginTop: 10, textAlign: 'left' }} />

                    <Pressable
                        style={{
                            marginTop: 10, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }}
                        onPress={() => onAddNewAddress()} >

                        <I18NText text='Add' />

                        <ActivityIndicator
                            animating={loading}
                            color='black'
                            style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                    </Pressable>

                </TransparentView>
            </PopupModal>
        </TransparentView>
    )
})

export const mapUserAddressFromResponse = (data): UserAddress[] => {
    return data.map((item) => ({
        id: item.id,
        address: item.address
    }))
}

import { TransparentView, View } from "../../../../base/View"
import { ActivityIndicator, Alert, Pressable } from "react-native"
import { I18NText, Text } from "../../../../base/Text"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../../base/FontAwesome"
import { useCallback, useEffect, useRef, useState } from "react"
import { PopupModal } from "../../../../base/PopupModal"
import { TextInput } from "react-native-gesture-handler"
import React from "react"
import { deleteAddress } from "../../../../core/apis/Requests"
import { useSelector } from "react-redux"
import { AppState, deleteUserAddress, setUserAddressList, UserAddress } from "../../../../redux/Reducer"
import { useDispatch } from "react-redux"
import { isValidNormalText } from "../../../../validation/validate"
import { useLanguage } from "../../../../base/Themed"
import { useNavigation } from '@react-navigation/native';
import { Constant } from "../../../../utils/Constant"
import { useToast } from "../../../../base/Toast"
import { openMapUtil } from "../../../../utils/Utils"



export const Address = React.memo(() => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const appStateProps = useSelector((appState: AppState) => ({
        addressList: appState.userAddressList
    }))

    const [loadingDelete, setLoadingDelete] = useState(false)

    const I18NCancel = useLanguage("Cancel")
    const I18NDelete = useLanguage("Delete")
    const I18NDeleteAddress = useLanguage("Delete Address")
    const I18NDeleteAddressConfirm = useLanguage("Are you sure you want to delete this address")
    const I18NMaxAddressWarning = useLanguage("You Can Have Maximum 5 Addressess")
    const I18NAddress = useLanguage('Address')
    const I18NView = useLanguage('View')
    const I18NAddressConfirm = useLanguage('Do you want to view this address in maps application?')
    const showToast = useToast()

    const onDeleteAddress = useCallback((id: number) => {
        setLoadingDelete(true)

        deleteAddress(
            id,
            (response) => {
                setLoadingDelete(false)
                dispatch(deleteUserAddress(id))
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoadingDelete(false)
            }
        )
    }, [])

    const openMap = useCallback((address: string) => {
        Alert.alert(
            I18NAddress,
            I18NAddressConfirm,
            [
                {
                    text: I18NCancel,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: I18NView, onPress: async () => {
                        await openMapUtil(address)
                    }
                }
            ]
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
                                <Pressable 
                                onPress={() => {openMap(item.formatted_address + ' - ' + item.address)}}
                                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1, marginRight: 20, flexShrink: 1 }}>
                                    <FontAwesome2 name="location-on" size={16} color='grey' />
                                    <TransparentView>
                                        <Text text={item.address} style={{ flexShrink: 1, marginLeft: 10, textAlign: 'left', fontWeight: '500' }} />
                                        <Text text={item.formatted_address} style={{ flexShrink: 1, marginLeft: 10, fontSize: 14, textAlign: 'left' }} />
                                    </TransparentView>
                                </Pressable>
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
                        if (appStateProps.addressList.length >= 5) {
                            Alert.alert(I18NMaxAddressWarning)
                        } else {
                            navigation.navigate('AddAddress' as never)
                        }
                    }}>
                    <FontAwesome name="plus-square-o" size={20} color='#288c26' />
                    <I18NText text="Add Address" style={{ textAlign: 'left', color: '#288c26', fontSize: 20, marginLeft: 10 }} />
                </Pressable>
            </TransparentView>

        </TransparentView>
    )
})

export const mapUserAddressFromResponse = (data): UserAddress[] => {
    return data.map((item) => ({
        id: item.id,
        address: item.address,
        formatted_address: item.formatted_address
    }))
}
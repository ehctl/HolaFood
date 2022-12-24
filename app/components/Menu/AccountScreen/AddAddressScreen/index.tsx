import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, TextInput } from "react-native";
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../../base/FontAwesome";
import { Level2Header, Level2HeaderStat } from "../../../../base/Headers/Level2Header";
import { I18NText } from "../../../../base/Text";
import { TransparentView, View } from "../../../../base/View";
import { style } from "./style/index.css";
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from "../../../../base/Themed";
import { Text } from "../../../../base/Text";
import { addNewAddress, getSuggestAddress } from "../../../../core/apis/Requests";
import { useDispatch, useSelector } from "react-redux";
import { AppState, setUserAddressList } from "../../../../redux/Reducer";
import { Constant } from "../../../../utils/Constant";
import { useToast } from "../../../../base/Toast";

export const AddAddressScreen = React.memo(() => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const appStateProps = useSelector((appState: AppState) => ({
        addressList: appState.userAddressList
    }))

    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [searchData, setSearchData] = useState<SearchAddressType[]>([])
    const [abortController, setAbortController] = useState<AbortController>(null)

    const I18NAddress = useLanguage('Address')
    const I18NCancel = useLanguage("Cancel")
    const I18NAdd = useLanguage("Add")
    const I18NAddAddress = useLanguage("Add Address")
    const I18NAddAddressConfirm = useLanguage("Are you sure want to add this address")
    const I18NAlreadyAddedAddress = useLanguage("You've already added this address. Please choose another address!")
    const I18NMaxAddressWarning = useLanguage("You Can Have Maximum 5 Addressess")

    const showToast = useToast()

    useEffect(() => {
        abortController?.abort()
        const newAbortController = new AbortController()
        setAbortController(newAbortController)

        setSearchData([])
        if (searchText.length > 0) {
            setLoading(true)
            getSuggestAddress(
                searchText,
                (response) => {
                    const results = mapSearchAddressFromResponse(response.results)
                    setSearchData(results)
                    setLoading(false)
                },
                (e) => {
                    console.log(e)
                    setLoading(false)
                },
                newAbortController
            )
        } else {
            setLoading(false)
        }

    }, [searchText])

    const onAddNewAddress = useCallback((address: SearchAddressType) => {
        setLoading(true)
        addNewAddress(
            address.name, 
            address.formatted_address,
            (response) => {
                const list = [...appStateProps.addressList]
                list.push({
                    id: response?.address?.id,
                    address: address.name,
                    formatted_address: address.formatted_address
                })
                dispatch(setUserAddressList(list))
                showToast('Add Address Successfully')
                setLoading(false)
            },
            (e) => {
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [appStateProps.addressList])

    const onSelectAddressItem = useCallback((placeId: string) => {
        const address = searchData.filter((i) => i.place_id == placeId)[0]

        if (appStateProps.addressList.filter((i) => i.formatted_address == address.formatted_address).length > 0) {
            Alert.alert(I18NAlreadyAddedAddress)
        } else if (appStateProps.addressList.length >= MAX_SAVED_ADDRESS) {
            Alert.alert(I18NMaxAddressWarning)
        } else {
            Alert.alert(
                I18NAddAddress,
                I18NAddAddressConfirm + `: "${address.formatted_address}"?`,
                [
                    {
                        text: I18NCancel,
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: I18NAdd, onPress: () => onAddNewAddress(address) }
                ]
            )
        }
    }, [searchData, appStateProps.addressList])

    const getFooter = useCallback(() => {
        return (
            searchData.length == 0 && !loading ?
                <I18NText text={ searchText.length > 0 ? "No Result" : "Type Your Address To Search"} /> : null
        )
    }, [searchData])

    const renderItem = useCallback(({ item, index }: any) => {
        return (
            <AddressItem data={item} onSelectAddressItem={onSelectAddressItem} />
        )
    }, [onSelectAddressItem])

    return (
        <View style={style.defaultView}>
            <View style={style.container}>
                <Pressable style={style.backButton} onPress={() => navigation.goBack()} >
                    <FontAwesome1 name="close" size={26} />
                </Pressable>
                <View
                    style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#c0c6cf', flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 15, marginVertical: 5 }}>
                    <TextInput
                        style={{ fontSize: 18, flexGrow: 1, flexShrink: 1 }}
                        placeholder='Tỉnh, Thành Phố - Địa Chỉ'
                        placeholderTextColor='#292828'
                        value={searchText}
                        onChangeText={setSearchText}
                        numberOfLines={1}
                        autoFocus={true}
                        keyboardType="web-search" />
                    {
                        searchText.length > 0 ?
                            <Pressable onPress={() => setSearchText('')} style={{ paddingVertical: 10, paddingLeft: 10 }}>
                                < FontAwesome1 name="close" size={20} />
                            </Pressable>
                            : null
                    }
                </View>
            </View>
            <I18NText text='Address' style={style.searchTitle} />
            {loading ? <ActivityIndicator animating={true} /> : null}
            <FlatList
                contentContainerStyle={{ marginHorizontal: 10, paddingBottom: 30 }}
                data={searchData}
                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyExtractor={(_, index) => `${index}`}
                ListFooterComponent={() => getFooter()} />
        </View>
    )
})

const MAX_SAVED_ADDRESS = 5

export type SearchAddressType = {
    name: string,
    formatted_address: string,
    place_id: string,
}

const mapSearchAddressFromResponse = (response) => {
    return response.map((i) => ({
        name: i.name,
        formatted_address: i.formatted_address,
        place_id: i.place_id
    }))
}

export type AddressItemType = {
    data: SearchAddressType,
    onSelectAddressItem: (placeId: string) => void
}

export const AddressItem = React.memo((props: AddressItemType) => {

    return (
        <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15 }}>
            <TransparentView style={{ marginRight: 15 }}>
                <FontAwesome2 name="location-pin" color='#48d46d' size={26} />
            </TransparentView>

            <TransparentView style={{ flexGrow: 1, flexShrink: 1, marginRight: 15 }}>
                <Text text={props.data.name} style={{ textAlign: 'left', fontWeight: '500', fontSize: 22, flexShrink: 1 }} />
                <Text text={props.data.formatted_address} style={{ color: '#6f706f', textAlign: 'left', fontSize: 18, flexShrink: 1 }} />
            </TransparentView>

            <Pressable style={{ marginRight: 15 }} onPress={() => props.onSelectAddressItem(props.data.place_id)}>
                <FontAwesome name="plus-square-o" color='#48d46d' size={26} />
            </Pressable>
        </TransparentView>
    )
})

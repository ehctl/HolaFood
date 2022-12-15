import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, Image, Modal, Pressable } from "react-native"
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import React from "react"
import { FoodDetailData } from "../FoodDetailScreen"
import { FontAwesome } from "../../../base/FontAwesome"
import { FontAwesome as DefaultFA } from "@expo/vector-icons"
import { Rate } from "../Rate"
import { AnimatedFontAwesome, formatMoney } from "../../../utils/Utils"
import { updateProductFavorite } from "../../../core/apis/Requests"
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux"
import { AppState } from "../../../redux/Reducer"
import { Constant } from "../../../utils/Constant"
import { useToast } from "../../../base/Toast"


export const Info = React.memo((props: InfoType) => {
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))
    const navigation = useNavigation()
    const [isFavorite, setIsFavorite] = useState(props.data.isFavorite)

    const showToast = useToast()

    const updateFavorite = useCallback((value: boolean) => {
        updateProductFavorite(
            appStateProps.userInfo.id,
            value,
            props.data.id,
            (response) => {
                setIsFavorite(value)
                const newData = {...props.data}
                newData.isFavorite = value  
                props.onDataChange(newData)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
            }
        )
    }, [appStateProps.userInfo, props.data])

    const setFoodFavorite = useCallback((value: boolean) => {
        updateFavorite(value)
    }, [])

    const navigateToShopDetail = (id: number) => {
        navigation.navigate('ShopDetail' as never, { shopId: id } as never)
    }

    const FontawesomeAnim = Animated.createAnimatedComponent(DefaultFA)

    return (
        <View style={{ marginTop: 20, padding: 5, borderColor: 'green', borderWidth: 2, borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', flexShrink: 1 }}>
                    <Text
                        style={{ textAlign: 'left', fontSize: 18, fontWeight: '700' }}
                        text={props.data.productName} />
                    <Text
                        style={{ marginTop: 5, textAlign: 'left', fontSize: 14, fontWeight: '400' }}
                        text={props.data.description} />
                </View>
                <Pressable style={{ padding: 10 }} onPress={() => { setFoodFavorite(!isFavorite) }}>
                    <FontawesomeAnim name={isFavorite ? 'bookmark' : 'bookmark-o'} color={isFavorite ? 'orange' : 'grey'} size={22} />
                </Pressable>
            </View>

            <View style={{ marginTop: 10, justifyContent: 'center' }}>
                <Text text={`${formatMoney(props.data.sellPrice)}đ`} style={{ textAlign: 'left', color: 'red' }} />
            </View>

            <Rate {...props.data} />

            <Pressable
                style={{ paddingVertical: 10 }}
                onPress={() => navigateToShopDetail(props.data.shopID)}>
                <Text text={props.data.shopName} style={{ textAlign: 'left', fontSize: 16, fontWeight: '500' }} />
            </Pressable>
        </View>
    )
})

export type InfoType = {
    data: FoodDetailData,
    onDataChange: (data: FoodDetailData) => void
}
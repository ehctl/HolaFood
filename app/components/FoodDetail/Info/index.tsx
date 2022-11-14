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



export const Info = React.memo((props: FoodDetailData) => {
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))
    const navigation = useNavigation()
    const [isFavorite, setIsFavorite] = useState(props.isFavorite)

    const updateFavorite = useCallback((value: boolean) => {
        updateProductFavorite(
            appStateProps.userInfo.id,
            value,
            props.id,
            (response) => {
                setIsFavorite(value)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [])

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
                        text={props.productName} />
                    <Text
                        style={{ marginTop: 5, textAlign: 'left', fontSize: 14, fontWeight: '400' }}
                        text={props.description}
                        numberOfLines={10} />
                </View>
                <Pressable style={{ padding: 10 }} onPress={() => { setFoodFavorite(!isFavorite) }}>
                    <FontawesomeAnim name={isFavorite ? 'bookmark' : 'bookmark-o'} color={isFavorite ? 'orange' : 'grey'} size={22} />
                </Pressable>
            </View>

            <View style={{ marginTop: 10, justifyContent: 'center' }}>
                <Text text={`${formatMoney(props.sellPrice)}đ`} style={{ textAlign: 'left', color: 'red' }} />
            </View>

            <Rate {...props} />

            <Pressable
                style={{ paddingVertical: 10 }}
                onPress={() => navigateToShopDetail(props.shopID)}>
                <Text text={props.shopName} style={{ textAlign: 'left', fontSize: 16, fontWeight: '500' }} />
            </Pressable>
        </View>
    )
})
import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, Image, Modal, Pressable } from "react-native"
import { TransparentView, View } from "../../base/View"
import { Text } from "../../base/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetailScreen"
import { FontAwesome } from "../../base/FontAwesome"
import { Rate } from "./Rate"


export const Info = React.memo((props: FoodDetailData) => {
    const [isFavorite, setIsFavorite] = useState(props.isFavorite)
    const [popupAnimation, setPopupAnimation] = useState(false)

    const setFoodFavorite = useCallback((value: boolean) => {
        setIsFavorite(value)
        if (value) {
            setPopupAnimation(true)
            setTimeout(() => {
                setPopupAnimation(false)
            }, 1200)
        }
    }, [])

    return (
        <View style={{ marginTop: 20, padding: 5, borderColor: 'green', borderWidth: 2, borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text
                        style={{ textAlign: 'left', fontSize: 18, fontWeight: '700' }}
                        text={props.name} />
                    <Text
                        style={{ marginTop: 5, textAlign: 'left', fontSize: 14, fontWeight: '400' }}
                        text={props.description} />
                </View>
                <Pressable style={{ padding: 10 }} onPress={() => { setFoodFavorite(!isFavorite) }}>
                    <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} color={isFavorite ? 'red' : 'black'} size={22} />

                </Pressable>
            </View>

            <View style={{ marginTop: 10, justifyContent: 'center' }}>
                <Text text={`${props.price}đ`} style={{ textAlign: 'left', color: 'red' }} />
            </View>

            <Rate {...props} />

            <View style={{ marginTop: 10 }} >
                <Text text={props.sellerName} style={{ textAlign: 'left', fontSize: 14, fontWeight: '500' }} />
            </View>

            {
                popupAnimation ?
                    <TransparentView style={{ position: 'absolute', height: 100, width: 100, zIndex: 1 }}>
                        <Image source={require('./styles/images/heart_animation.gif')} style={{ height: '100%', aspectRatio: 1, }} />
                    </TransparentView>
                    : null
            }
        </View>
    )
})
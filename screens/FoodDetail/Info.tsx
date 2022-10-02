import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, Modal, Pressable } from "react-native"
import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetail"
import { FontAwesome } from "../../components/FontAwesome"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Button } from "../../components/Button"
import { TextInput } from "react-native-gesture-handler"
import { Rate } from "./Rate"


export const Info = React.memo((props: FoodDetailData) => {
    const [isFavorite, setIsFavorite] = useState(props.isFavorite)

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
                <Pressable style={{ padding: 10 }} onPress={() => { setIsFavorite(!isFavorite) }}>
                    <FontAwesome name={isFavorite ? 'bookmark' : 'bookmark-o'} color={isFavorite ? 'red' : 'black'} size={22} />
                </Pressable>
            </View>

            <View style={{ marginTop: 10, justifyContent: 'center' }}>
                <Text text={`${props.price}đ`} style={{ textAlign: 'left', color: 'red' }} />
            </View>

            <Rate {...props}/>

            <View style={{ marginTop: 10 }} >
                <Text text={props.sellerName} style={{ textAlign: 'left', fontSize: 14, fontWeight: '500' }} />
            </View>

        </View>
    )
})




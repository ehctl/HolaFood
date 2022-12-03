import { useCallback, useRef, useState } from "react"
import { Modal, Pressable } from "react-native"
import { TransparentView, View } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import React from "react"
import { FoodDetailData } from "../FoodDetailScreen"
import { FontAwesome, FontAwesome1 } from "../../../base/FontAwesome"
import { FontAwesomeIconType } from "../../../constants/FontAwesomeIconType"
import { Button } from "../../../base/Button"
import { TextInput } from "react-native-gesture-handler"
import { PopupModal } from "../../../base/PopupModal"
import { useLanguage } from "../../../base/Themed"

export const Rate = React.memo((props: FoodDetailData) => {

    const I18NVote = useLanguage('Vote')
    const I18NOptional = useLanguage('Optional')


    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ReviewStar num={props.star} size={16} />
                    <View>
                        <Text
                            text={`(${props.numberOfReview} ${I18NVote})`}
                            style={{ fontSize: 14, marginLeft: 5 }} />
                    </View>
                </View>
            </View>


        </View >
    )
})


export const ReviewStar = React.memo((props: { num: number, size?: number, showNumber?: boolean }) => {
    return (
        <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
                genStar(props.num).map((item, index) => {
                    return (
                        <FontAwesome key={index} name={item.name as FontAwesomeIconType} size={props.size ?? 12} color={item.color} />
                    )
                })
            }
            {
                props.showNumber == true ?
                    <TransparentView>
                        <Text text={`${props.num}`} style={{ marginLeft: 10 }} />
                    </TransparentView> : null
            }
        </TransparentView>
    )
})


const genStar = (num) => {
    const starArr = []
    if (num - Math.floor(num) != 0)
        starArr.push({
            name: 'star-half-full',
            color: '#cfa21d'
        })

    num = Math.floor(num)
    for (let i = 0; i < num; i++) {
        starArr.unshift({
            name: 'star',
            color: '#cfa21d'
        })
    }

    for (let i = 5; i > Math.ceil(num); i--) {
        starArr.push({
            name: 'star-o',
            color: 'grey'
        })
    }

    return starArr
}

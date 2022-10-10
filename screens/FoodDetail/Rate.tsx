import { useRef, useState } from "react"
import { Modal, Pressable } from "react-native"
import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetail"
import { FontAwesome, FontAwesome1 } from "../../components/FontAwesome"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Button } from "../../components/Button"
import { TextInput } from "react-native-gesture-handler"
import { isIosDevice, useKeyboard } from "../../utils/Utils"
import { PopupModal } from "../../components/PopupModal"

export const Rate = React.memo((props: FoodDetailData) => {
    const [starVoted, setStarVoted] = useState(1)
    const keyboardHeight = isIosDevice() ? useKeyboard() : 0
    const popupRef = useRef(null)

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ReviewStar num={props.rate} size={16} />
                    <View>
                        <Text
                            text={`(${props.numOfReviews} Reviews)`}
                            style={{ fontSize: 14, marginLeft: 5 }} />
                    </View>
                </View>

                <Pressable
                    style={{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'orange', borderRadius: 10 }}
                    onPress={() => {
                        popupRef.current.changeVisibility(true)
                    }}>
                    <Text text="Rate" />
                </Pressable>
            </View>

            <PopupModal ref={popupRef}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text text="Rate" style={{fontSize: 20}}/>
                    <FontAwesome1 name="close" size={28} onPress={() => popupRef.current.changeVisibility(false)} style={{ paddingVertical: 15 }} />
                </TransparentView>

                <View style={{ height: 1, backgroundColor: 'grey' }} />

                <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    <FontAwesome name="star" color={starVoted >= 1 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(1)} />
                    <FontAwesome name="star" color={starVoted >= 2 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(2)} />
                    <FontAwesome name="star" color={starVoted >= 3 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(3)} />
                    <FontAwesome name="star" color={starVoted >= 4 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(4)} />
                    <FontAwesome name="star" color={starVoted == 5 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(5)} />
                </TransparentView>

                <TextInput
                    placeholder="Your review (optional)"
                    multiline={true}
                    style={{ paddingHorizontal: 10, backgroundColor: '#bab0af', fontSize: 14, borderRadius: 10, paddingTop: 15, paddingBottom: 15, marginTop: 20 }} />

                <Button
                    text="Rate"
                    style={{
                        marginHorizontal: 15, borderRadius: 15, marginBottom: 20,
                        marginTop: 15
                    }}
                    textSize={20}
                    onPress={() => {
                        popupRef.current.changeVisibility(false)
                        console.log('Rate start', starVoted, 'star')
                    }} />
                <TransparentView style={{ height: isIosDevice() ? keyboardHeight : 0 }} />
            </PopupModal>
        </View >
    )
})


export const ReviewStar = React.memo((props: { num: number, size?: number, showNumber?: boolean }) => {
    return (
        <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
                genStar(props.num).map((item, index) => {
                    return (
                        <FontAwesome key={index} name={item as FontAwesomeIconType} size={props.size ?? 12} color='#ebcc34' />
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


const genStar = (num): string[] => {
    const starArr = []
    if (num - Math.floor(num) != 0)
        starArr.push('star-half-full')

    num = Math.floor(num)
    for (let i = 0; i < num; i++) {
        starArr.unshift('star')
    }

    return starArr
}

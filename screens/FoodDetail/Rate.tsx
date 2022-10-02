import { useState } from "react"
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native"
import { TransparentView, View } from "../../components/View"
import { Text } from "../../components/Text"
import React from "react"
import { FoodDetailData } from "./FoodDetail"
import { FontAwesome } from "../../components/FontAwesome"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Button } from "../../components/Button"
import { TextInput } from "react-native-gesture-handler"
import { isIosDevice, useKeyboard } from "../../utils/Utils"

export const Rate = React.memo((props: FoodDetailData) => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [starVoted, setStarVoted] = useState(1)
    const keyboardHeight = isIosDevice() ? useKeyboard() : 0


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
                        setModalVisibility(true)
                    }}>
                    <Text text="Rate" />
                </Pressable>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibility}
                onRequestClose={() => {
                    setModalVisibility(!modalVisibility);
                }} >

                <View
                    style={{
                        position: 'absolute', opacity: 1, left: 5, right: 5, bottom: 0, paddingHorizontal: 10,
                        backgroundColor: '#b86a87', borderTopLeftRadius: 15, borderTopRightRadius: 15
                    }} >
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text text="Rate" />
                        <FontAwesome name="close" size={40} onPress={() => setModalVisibility(false)} style={{ padding: 10 }} />
                    </TransparentView>

                    <View style={{height: 1}}/>

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                        <FontAwesome name="star" color={starVoted >= 1 ? '#ebcc34' : 'black'} size={22} onPress={() => setStarVoted(1)} />
                        <FontAwesome name="star" color={starVoted >= 2 ? '#ebcc34' : 'black'} size={22} onPress={() => setStarVoted(2)} />
                        <FontAwesome name="star" color={starVoted >= 3 ? '#ebcc34' : 'black'} size={22} onPress={() => setStarVoted(3)} />
                        <FontAwesome name="star" color={starVoted >= 4 ? '#ebcc34' : 'black'} size={22} onPress={() => setStarVoted(4)} />
                        <FontAwesome name="star" color={starVoted == 5 ? '#ebcc34' : 'black'} size={22} onPress={() => setStarVoted(5)} />
                    </TransparentView>

                    <TextInput
                        placeholder="Your review (optional)"
                        multiline={true}
                        style={{ paddingHorizontal: 10, backgroundColor: '#bab0af', fontSize: 14, borderRadius: 10, paddingTop: 15, paddingBottom: 15, marginTop: 20 }} />

                    <Button
                        text="Rate"
                        style={{ 
                            marginHorizontal: 15, borderTopRightRadius: 15, borderTopLeftRadius: 15, 
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0, height: 50,
                            marginTop: 15
                         }}
                        textSize={24}
                        onPress={() => {
                            setModalVisibility(false)
                            console.log('Rate start', starVoted, 'star')
                        }} />
                    <TransparentView style={{height: isIosDevice() ? keyboardHeight : 0}}/>
                </View>
            </Modal>
        </View >
    )
})


export const ReviewStar = React.memo((props: { num: number, size: number }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
                genStar(props.num).map((item, index) => {
                    return (
                        <FontAwesome key={index} name={item as FontAwesomeIconType} size={props.size} color='#ebcc34' />
                    )
                })
            }
            <View>
                <Text text={`${props.num}`} style={{ marginLeft: 10 }} />
            </View>
        </View>
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

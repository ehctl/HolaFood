import { View } from "../../components/View"
import { Text, TransparentText } from "../../components/Text"
import React, { useCallback, useState } from "react"
import { FontAwesome } from "../../components/FontAwesome"
import { FoodDetailData, ReviewType } from "./FoodDetail"
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView } from "../../components/View"
import { TextInput } from "../../components/TextInput"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export const Review = React.memo((props: FoodDetailData) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const [reviews, setReviews] = useState<ReviewType[]>([])

    const collapse = useCallback(() => {
        if (isCollapse)
            setReviews([])
        else
            setReviews(props.reviews)

        setIsCollapse(!isCollapse)
    }, [isCollapse, reviews])

    return (
        <View style={{ backgroundColor: 'grey', borderRadius: 15, marginBottom: 20 }}>
            <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20, marginLeft: 10 }}
                onPress={() => collapse()}>

                <Text text='See Reviews' />
                <FontAwesome name={isCollapse ? 'angle-up' : 'angle-down'} size={24} style={{ marginLeft: 5 }} />
            </Pressable>

            {
                reviews.map((item: ReviewType) => {
                    return (
                        <ReviewItem key={item.id} {...item} />
                    )
                })
            }

        </View>
    )
})

export const ReviewItem = React.memo((props: ReviewType) => {
    return (
        <TransparentView style={{ marginHorizontal: 10, paddingBottom: 10 }}>
            <Text text={props.userName} style={{ textAlign: 'left' }} />
            <Text text={props.content} numberOfLines={3} style={{ textAlign: 'left', marginLeft: 10 }} />
            <View style={{ height: 1, backgroundColor: 'white', marginTop: 10 }} />
        </TransparentView>
    )
})
import { View } from "../../components/View"
import { Text } from "../../components/Text"
import React, { useCallback, useRef, useState } from "react"
import { FontAwesome, FontAwesome1 } from "../../components/FontAwesome"
import { FoodDetailData, ReviewType } from "./FoodDetail"
import { Alert, Pressable, TextInput } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView } from "../../components/View"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ReviewStar } from "./Rate"
import { Button } from "../../components/Button"
import { PopupModal } from "../../components/PopupModal"


export const Review = React.memo((props: FoodDetailData) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const [reviews, setReviews] = useState<ReviewType[]>([])
    const reportPopupModal = useRef(null)
    const deletePopupModal = useRef(null)

    const collapse = useCallback(() => {
        if (isCollapse)
            setReviews([])
        else
            setReviews(props.reviews)

        setIsCollapse(!isCollapse)
    }, [isCollapse, reviews])


    return (
        <View style={{ backgroundColor: 'grey', borderRadius: 15, marginBottom: 20, alignItems: 'flex-start' }}>
            <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 20, marginLeft: 10 }}
                onPress={() => collapse()}>

                <Text text='See Reviews' />
                <FontAwesome name={isCollapse ? 'angle-up' : 'angle-down'} size={24} style={{ marginLeft: 5 }} />
            </Pressable>
            <TransparentView style={{ width: '100%' }}>
                {
                    reviews.map((item: ReviewType) => {
                        return (
                            <ReviewItem key={item.id} data={item} reportPopupModalRef={reportPopupModal} deletePopupModal={deletePopupModal} />
                        )
                    })
                }
            </TransparentView>

            <PopupModal ref={reportPopupModal}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text text="Report" style={{ fontSize: 20 }} />
                    <FontAwesome1 name="close" size={28} onPress={() => reportPopupModal.current.changeVisibility(false)} style={{ paddingVertical: 15 }} />
                </TransparentView>

                <View style={{ height: 1, backgroundColor: 'grey' }} />

                <TextInput
                    placeholder="Your report (optional)"
                    multiline={true}
                    style={{ paddingHorizontal: 10, backgroundColor: '#bab0af', fontSize: 14, borderRadius: 10, paddingTop: 15, paddingBottom: 15, marginTop: 20 }} />

                <Button
                    text="Report this review"
                    textSize={20}
                    style={{
                        marginHorizontal: 15, borderRadius: 15, marginBottom: 20, height: 50,
                        marginTop: 15
                    }}
                    onPress={() => {
                        console.log('Report')
                    }} />
            </PopupModal>
        </View>
    )
})

export const ReviewItem = React.memo((props: ReviewItemProps) => {
    return (
        <TransparentView style={{ marginHorizontal: 10, paddingBottom: 10 }}>
            <TransparentView style={{ flexDirection: 'row' }}>
                <TransparentView style={{ flexShrink: 1 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text text={props.data.userName} style={{ textAlign: 'left' }} />
                    </TransparentView>

                    <TransparentView style={{ marginHorizontal: 10, marginBottom: 5, flexGrow: 1 }}>
                        <ReviewStar num={4} size={13} showNumber={false} />
                        <Text text={props.data.content} numberOfLines={3} style={{ textAlign: 'left', marginTop: 5 }} />
                    </TransparentView>
                </TransparentView>
                <TransparentView>
                    <TransparentView style={{ alignItems: 'center' }}>
                        <Pressable style={{ margin: 5 }}
                            onPress={() => {
                                Alert.alert(
                                    "Delete Review",
                                    "Are you sure you want to delete this review?",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        { text: "Delete", onPress: () => console.log("OK Pressed") }
                                    ]
                                );

                            }}>
                            <FontAwesome1 name="close" size={18} />
                        </Pressable>

                        <Pressable style={{ margin: 5 }} onPress={() => props.reportPopupModalRef.current.changeVisibility(true)}>
                            <FontAwesome1 name="ellipsis1" size={22} />
                        </Pressable>
                    </TransparentView>
                </TransparentView>
            </TransparentView>
            <View style={{ height: 1, backgroundColor: 'white' }} />
        </TransparentView>
    )
})

export type ReviewItemProps = {
    data: ReviewType,
    reportPopupModalRef: React.MutableRefObject<any>
    deletePopupModal: React.MutableRefObject<any>
}
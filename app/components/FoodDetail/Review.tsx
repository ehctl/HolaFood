import { View } from "../../base/View"
import { Text } from "../../base/Text"
import React, { useCallback, useRef, useState } from "react"
import { FontAwesome, FontAwesome1 } from "../../base/FontAwesome"
import { FoodDetailData, ReviewType } from "./FoodDetailScreen"
import { Alert, Pressable, TextInput } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView } from "../../base/View"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ReviewStar } from "./Rate"
import { Button } from "../../base/Button"
import { PopupModal } from "../../base/PopupModal"
import { getFoodReviews } from "../../core/apis/requests"
import { ShimmerGroup, ShimmerItem } from "../../base/Shimmer"
import { wait } from "../../utils/Utils"


export const Review = React.memo((props: ReviewProps) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reachListEnd, setReachListEnd] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [reviews, setReviews] = useState<ReviewType[]>([])
    const reportPopupModal = useRef(null)
    const deletePopupModal = useRef(null)

    const collapse = useCallback(() => {
        if (isCollapse)
            setReviews([])
        else
            fetchData(0)

        setIsCollapse(!isCollapse)
    }, [isCollapse])


    const fetchData = useCallback(async (pageIndex: number) => {
        setLoading(true)
        await wait(2000)

        getFoodReviews(
            '2132131',
            '1312313',
            pageIndex,
            (response) => {
                const data = response.data
                setReviews([...reviews, ...data])
                setLoading(false)
            },
            (e) => {
                console.log(e)
            },
        )
    }, [reviews])

    const renderItem = ({ item }: any) => {
        return (
            <ReviewItem data={item} reportPopupModalRef={reportPopupModal} deletePopupModal={deletePopupModal} />
        )
    }

    return (
        <View style={{ borderRadius: 15, marginBottom: 20, alignItems: 'flex-start' }}>
            <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 20 }}
                onPress={() => collapse()}>

                <Text text='Reviews' style={{ fontSize: 20, fontWeight: '500' }} />
                <FontAwesome name={isCollapse ? 'angle-down' : 'angle-up'} size={24} style={{ marginLeft: 10 }} />
            </Pressable>
            {
                isCollapse ?
                    <View style={{ width: '100%', backgroundColor: '#c0c6cf', borderRadius: 10 }}>
                        <FlatList
                            data={reviews}
                            renderItem={renderItem}
                            keyExtractor={(_, index) => `${index}`}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (!reachListEnd) {
                                    fetchData(pageIndex + 1)
                                    setPageIndex(pageIndex + 1)
                                }
                            }}
                            ListFooterComponent={<ReviewItemShimmer visible={loading} />} />
                    </View> : null
            }

            <PopupModal ref={reportPopupModal} title='Report'>
                <View style={{ height: 1, backgroundColor: '#c0c6cf' }} />
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

export const ReviewItemShimmer = React.memo((props: FoodDetailShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'flex-start', alignItems: 'flex-start', margin: 5 }}>
                <ShimmerItem style={{ height: 25, width: 150, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 25, width: 250, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type FoodDetailShimmerType = {
    visible: boolean
}

export const ReviewItem = React.memo((props: ReviewItemProps) => {
    return (
        <TransparentView style={{ marginHorizontal: 10, marginTop: 10 }}>
            <TransparentView style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <TransparentView style={{ flexShrink: 1 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text text={props.data.userName} style={{ textAlign: 'left' }} />
                    </TransparentView>

                    <TransparentView style={{ marginHorizontal: 10, marginBottom: 5, marginTop: 5, flexGrow: 1 }}>
                        <ReviewStar num={4} size={13} showNumber={false} />
                        <Text text={props.data.content} numberOfLines={3} style={{ textAlign: 'left', marginTop: 2 }} />
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
            <View style={{ height: 1, backgroundColor: 'grey' }} />
        </TransparentView>
    )
})

export type ReviewProps = {
    foodId: string
}

export type ReviewItemProps = {
    data: ReviewType,
    reportPopupModalRef: React.MutableRefObject<any>
    deletePopupModal: React.MutableRefObject<any>
}
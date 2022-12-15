import { View } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../../base/FontAwesome"
import { ActivityIndicator, Alert, Pressable, TextInput } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView } from "../../../base/View"
import { ReviewStar } from "../Rate"
import { Button } from "../../../base/Button"
import { PopupModal } from "../../../base/PopupModal"
import { addFoodReview, deleteFoodReview, getFoodReviews, updateFoodReview } from "../../../core/apis/Requests"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { formatCreatedDateType, formatDateTimeFromData, wait } from "../../../utils/Utils"
import { useLanguage } from "../../../base/Themed"
import { FoodDetailData } from "../FoodDetailScreen"
import { useSelector } from "react-redux"
import { AppState } from "../../../redux/Reducer"
import { useToast } from "../../../base/Toast"
import { Constant } from "../../../utils/Constant"

export const Review = React.memo((props: ReviewType) => {
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))

    const [isCollapse, setIsCollapse] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [deletingReview, setDeletingReview] = useState(false)
    const [reviewList, setReviewList] = useState<ReviewItemType[]>([])
    const updatePopupModal = useRef(null)
    const popupRateRef = useRef(null)

    const [pageIndex, setPageIndex] = useState(0)
    const [starVoted, setStarVoted] = useState(5)
    const [review, setReview] = useState('')
    const [reviewErrorMsg, setReviewErrorMsg] = useState('')

    const [updateReview, setUpdateReview] = useState('')
    const [updateStarVote, setUpdateStarVote] = useState(0)


    const [updateReviewErrorMsg, setUpdateReviewErrorMsg] = useState('')
    const [selectedReviewId, setSelectedReviewId] = useState(null)
    const [reachEndList, setReachEndList] = useState(false)
    const I18NReason = useLanguage('Reason')
    const I18NOptional = useLanguage('Optional')
    const I18NYourRateOptional = useLanguage('Your Rate (Optional)')

    const showToast = useToast()

    const collapse = useCallback(() => {
        if (isCollapse)
            setReviewList([])
        else
            fetchData(0)

        setIsCollapse(!isCollapse)
    }, [isCollapse])

    const fetchData = useCallback((pageIndex: number) => {
        setLoading(true)

        getFoodReviews(
            props.data.id,
            pageIndex,
            (response) => {
                const data = response.data
                pageIndex != 0 ? setReviewList([...reviewList, ...data]) : setReviewList(data)
                if (data.length < 10) {
                    setReachEndList(true)
                }
                setLoading(false)
            },
            (e) => {
                console.log('Error', e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            },
        )
    }, [reviewList])

    const onUpdateReview = useCallback(() => {
        const chosenReview = reviewList.filter((i) => i.id == selectedReviewId)[0]
        if (chosenReview.review == updateReview && chosenReview.star == updateStarVote) {
            setUpdateReviewErrorMsg('Value was not changed')
        } else {
            setUpdating(true)
            updateFoodReview(
                props.data.id,
                updateReview,
                updateStarVote,
                (response) => {
                    chosenReview.review = updateReview
                    chosenReview.star = updateStarVote
                    setReviewList([...reviewList])
                    setUpdating(false)
                    updatePopupModal.current.changeVisibility(false)
                },
                (e) => {
                    console.log(e)
                    showToast(Constant.API_ERROR_OCCURRED)
                    setUpdating(false)
                }
            )
        }
    }, [updateReview, updateStarVote, reviewList, selectedReviewId])

    useEffect(() => {
        if (selectedReviewId) {
            const chosenReview = reviewList.filter((i) => i.id == selectedReviewId)[0]
            setUpdateReview(chosenReview.review)
            setUpdateStarVote(chosenReview.star)
        }
    }, [selectedReviewId])

    const onDeleteReview = useCallback((reviewId: number) => {
        setDeletingReview(true)

        deleteFoodReview(
            reviewId,
            (response) => {
                setUpdating(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setUpdating(false)
            }
        )
    }, [showToast])

    const onAddReview = useCallback(() => {
        setUpdating(true)
        const time = new Date()
        addFoodReview(
            props.data.id,
            review,
            starVoted,
            (response) => {
                // udpate review in review section
                setReviewList([...[{
                    productName: props.data.productName,
                    userId: appStateProps.userInfo.id,
                    review: review,
                    userReview: appStateProps.userInfo.firstName + ' ' + appStateProps.userInfo.lastName,
                    createdDate: formatCreatedDateType(time),
                    id: response?.review?.id,
                    star: starVoted,
                }], ...reviewList])
                setUpdating(false)

                // update star of main food detail page
                const newAvrStar = (props.data.star * props.data.numberOfReview + starVoted) / (props.data.numberOfReview + 1)
                const newData = { ...props.data }
                newData.star = newAvrStar
                newData.numberOfReview += 1
                props.onDataChange(newData)
                popupRateRef.current.changeVisibility(false)
            },
            (e) => {
                console.log(e)
                setReviewErrorMsg(e.message ?? e)
                setUpdating(false)
            }
        )
    }, [starVoted, review])

    const renderItem = ({ item }: any) => {
        return (
            <ReviewItem data={item} updatePopupModalRef={updatePopupModal} setSelectedReviewId={setSelectedReviewId} onDeleteReviewCalblack={onDeleteReview} />
        )
    }

    return (
        <View style={{ borderRadius: 15, marginBottom: 20, alignItems: 'flex-start' }}>
            <TransparentView
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, width: '100%' }} >

                <Pressable onPress={() => collapse()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <I18NText text='Comment' style={{ fontSize: 20, fontWeight: '500' }} />
                    <FontAwesome name={isCollapse ? 'angle-down' : 'angle-up'} size={24} style={{ marginLeft: 10 }} />

                    <ActivityIndicator
                        animating={deletingReview}
                        color='black'
                        style={{ marginLeft: 10 }} />
                </Pressable>
                <Pressable
                    style={{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#e8be41', borderRadius: 10 }}
                    onPress={() => {
                        popupRateRef.current.changeVisibility(true)
                    }}>
                    <I18NText text="Vote" />
                </Pressable>
            </TransparentView>
            <View style={{ width: '100%', marginBottom: 40 }}>
                {
                    isCollapse ?

                        <FlatList
                            data={reviewList}
                            renderItem={renderItem}
                            keyExtractor={(_, index) => `${Math.random()}`}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (!reachEndList && !loading) {
                                    fetchData(pageIndex + 1)
                                    setPageIndex(pageIndex + 1)
                                }
                            }}
                            ListFooterComponent={<ReviewItemShimmer visible={loading} />} />
                        : null
                }
            </View>

            <PopupModal ref={updatePopupModal} title='Update Your Review'>
                <View style={{ height: 1, backgroundColor: '#c0c6cf' }} />

                <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    <FontAwesome name="star" color={updateStarVote >= 1 ? '#ebcc34' : 'grey'} size={22} onPress={() => setUpdateStarVote(1)} />
                    <FontAwesome name="star" color={updateStarVote >= 2 ? '#ebcc34' : 'grey'} size={22} onPress={() => setUpdateStarVote(2)} />
                    <FontAwesome name="star" color={updateStarVote >= 3 ? '#ebcc34' : 'grey'} size={22} onPress={() => setUpdateStarVote(3)} />
                    <FontAwesome name="star" color={updateStarVote >= 4 ? '#ebcc34' : 'grey'} size={22} onPress={() => setUpdateStarVote(4)} />
                    <FontAwesome name="star" color={updateStarVote == 5 ? '#ebcc34' : 'grey'} size={22} onPress={() => setUpdateStarVote(5)} />
                </TransparentView>

                <TextInput
                    placeholder={`${I18NReason} ${I18NOptional}`}
                    multiline={true}
                    value={updateReview}
                    onChangeText={(v) => setUpdateReview(v)}
                    style={{ paddingHorizontal: 10, backgroundColor: '#bab0af', fontSize: 14, borderRadius: 10, paddingTop: 15, paddingBottom: 15, marginTop: 20 }} />
                <I18NText text={updateReviewErrorMsg} style={{ color: 'red', textAlign: 'left', marginTop: 5 }} />

                <Pressable
                    style={{
                        marginTop: 10, backgroundColor: '#e8be41', paddingVertical: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                    onPress={() => onUpdateReview()} >

                    <I18NText text='Update' />

                    <ActivityIndicator
                        animating={updating}
                        color='black'
                        style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                </Pressable>
            </PopupModal>

            <PopupModal ref={popupRateRef} title='Rate'>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    <FontAwesome name="star" color={starVoted >= 1 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(1)} />
                    <FontAwesome name="star" color={starVoted >= 2 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(2)} />
                    <FontAwesome name="star" color={starVoted >= 3 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(3)} />
                    <FontAwesome name="star" color={starVoted >= 4 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(4)} />
                    <FontAwesome name="star" color={starVoted == 5 ? '#ebcc34' : 'grey'} size={22} onPress={() => setStarVoted(5)} />
                </TransparentView>

                <TextInput
                    placeholder={I18NYourRateOptional}
                    placeholderTextColor='black'
                    multiline={true}
                    onChangeText={(v) => setReview(v)}
                    style={{ paddingHorizontal: 10, backgroundColor: '#c0c6cf', fontSize: 14, borderRadius: 10, paddingTop: 15, paddingBottom: 15, marginTop: 20 }} />

                {
                    reviewErrorMsg.length ?
                        <I18NText text={reviewErrorMsg} style={{ color: 'red', textAlign: 'left', marginTop: 10 }} />
                        : null
                }

                <Pressable
                    style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#e8be41', padding: 10, borderRadius: 10 }}
                    onPress={() => onAddReview()}>

                    <I18NText text="Rate" />
                    <ActivityIndicator
                        animating={updating}
                        color='black'
                        style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                </Pressable>
            </PopupModal>
        </View>
    )
})

export const ReviewItemShimmer = React.memo((props: FoodDetailShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'flex-start', alignItems: 'flex-start', margin: 5 }}>
                <ShimmerItem style={{ height: 15, width: 150, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: 250, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '100%', borderRadius: 15, margin: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type FoodDetailShimmerType = {
    visible: boolean
}

export const ReviewItem = React.memo((props: ReviewItemProps) => {
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))

    const I18NDeleteReviewConfirm = useLanguage('Do you want to delete this review?')
    const I18NReview = useLanguage('Review')
    const I18NCancel = useLanguage('Cancel')
    const I18NDelete = useLanguage('Delete')

    const onDeleteReviewConfirm = useCallback((reviewId: number) => {
        Alert.alert(
            I18NReview,
            I18NDeleteReviewConfirm,
            [
                {
                    text: I18NCancel,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: I18NDelete, onPress: () => props.onDeleteReviewCalblack(reviewId) }
            ]
        )
    }, [])

    const onUpdateReview = useCallback((reviewId: number) => {
        props.setSelectedReviewId(props.data.id);
        props.updatePopupModalRef.current.changeVisibility(true)
    }, [])

    return (
        <TransparentView style={{ marginHorizontal: 10, marginTop: 10 }}>
            <TransparentView style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <TransparentView style={{ flexShrink: 1, width: '100%' }}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                        <Text text={props.data.userReview + ' · ' + formatDateTimeFromData(props.data.createdDate)} style={{ textAlign: 'left', fontWeight: '500' }} numberOfLines={2} />
                    </TransparentView>

                    <TransparentView style={{ marginHorizontal: 10, marginBottom: 5, marginTop: 5, flexGrow: 1 }}>
                        <ReviewStar num={props.data.star} size={13} showNumber={false} />
                        {
                            props.data.review ?
                                <Text text={props.data.review} numberOfLines={3} style={{ textAlign: 'left', marginTop: 2 }} />
                                : null
                        }
                    </TransparentView>
                </TransparentView>
                <TransparentView style={{ alignItems: 'flex-start' }}>
                    {
                        appStateProps.userInfo.id == props.data.userId ?
                            <Pressable style={{ padding: 5 }} onPress={() => onDeleteReviewConfirm(props.data.id)}>
                                <FontAwesome2 name="close" size={18} />
                            </Pressable> : null
                    }
                    {
                        appStateProps.userInfo.id == props.data.userId ?
                            <Pressable style={{ padding: 5 }} onPress={() => onUpdateReview(props.data.id)}>
                                <FontAwesome2 name="edit" size={18} />
                            </Pressable> : null
                    }
                </TransparentView>
            </TransparentView>
            <View style={{ height: 1, backgroundColor: 'grey' }} />
        </TransparentView>
    )
})

export type ReviewType = {
    data: FoodDetailData,
    onDataChange: (data: FoodDetailData) => void
}

export type ReviewItemProps = {
    data: ReviewItemType,
    updatePopupModalRef: React.MutableRefObject<any>
    setSelectedReviewId: (id: number) => void,
    onDeleteReviewCalblack: (id: number) => void
}

export type ReviewItemType = {
    id: number,
    userId: number,
    productName: string,
    userReview: string,
    review: string,
    createdDate: string,
    star: number,
}
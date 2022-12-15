import React, { useCallback, useEffect, useRef, useState } from "react"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { TransparentView, View } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { ActivityIndicator, Animated, Pressable } from "react-native"
import { useLanguage, useTheme, useThemeColor } from "../../../base/Themed"
import Colors from "../../../constants/Colors"
import { PopupModal } from "../../../base/PopupModal"
import { TextInput } from "react-native-gesture-handler"
import { Button } from "../../../base/Button"
import { addNewFAQ, getListFAQ } from "../../../core/apis/Requests"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { isValidNormalText } from "../../../validation/validate"
import { useSelector } from "react-redux"
import { AppState } from "../../../redux/Reducer"
import { Constant } from "../../../utils/Constant"
import { useToast } from "../../../base/Toast"


export const FAQScreen = React.memo(() => {
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))
    const [listFAQ, setListFAQ] = useState<FAQItemType[]>([])
    const [FAQContent, setFAQContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const popupRef = useRef(null)

    const I18NYourFAQS = useLanguage('Your FAQS')

    const showToast = useToast()

    const fetchData = useCallback(() => {
        setLoading(true)
        getListFAQ(
            (response) => {
                const data = response.data
                setListFAQ(data.reverse())
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [])

    const addFAQ = useCallback(() => {
        const result = isValidNormalText(FAQContent.trim())

        if (!result.qualify) {
            setErrorMsg(result.message)
        } else {
            setUpdating(true)
            addNewFAQ(
                appStateProps.userInfo.id,
                FAQContent.trim(),
                (response) => {
                    popupRef.current.changeVisibility(false)
                    setListFAQ([
                        {
                            id: listFAQ.length == 0 ? 0 : (listFAQ[0].id + 1),
                            question: FAQContent.trim(),
                            status: 1,
                            answer: null,
                            userId: 1
                        },
                        ...listFAQ
                    ])
                    setUpdating(false)
                },
                (e) => {
                    console.log(e)
                    showToast(Constant.API_ERROR_OCCURRED)
                    setUpdating(false)
                }
            )
        }

    }, [listFAQ, FAQContent])

    useEffect(() => {
        fetchData()
    }, [])

    const renderItem = ({ item }: { item: FAQItemType }) => {
        return (
            <FAQItem {...item} />
        )
    }

    const getFooterComp = () => {
        return (
            <TransparentView>
                <FAQItemShimmer visible={loading} />
                <View style={{ height: 80 }} />
            </TransparentView>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header title="FAQ" />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: { marginHorizontal: 10 },
                    renderItem: renderItem,
                    data: listFAQ,
                    keyExtractor: (_, index) => `${index}`,
                    ListEmptyComponent:
                        !loading ?
                        <I18NText
                            text='FAQs List Is Empty. Create New One If You Have Any Question For Us'
                            style={{}} /> : null,
                    ListFooterComponent: getFooterComp()
                }}
                hideReload={true} />
            <TransparentView style={{ position: 'absolute', left: 10, bottom: 10 }}>
                <Pressable
                    style={{
                        backgroundColor: '#c0c6cf', width: 50, aspectRatio: 1, borderRadius: 1000, justifyContent: 'center', alignItems: 'center', shadowColor: "#000",
                        shadowOffset: {
                            width: 2,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                    onPress={() => { popupRef.current.changeVisibility(true) }} >
                    <FontAwesome name="question" size={35} color='#ed8f05' />
                </Pressable>
            </TransparentView>

            <PopupModal ref={popupRef} title="FAQs" shouldAvoidKeyboard={true}>
                <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextInput
                        placeholder={I18NYourFAQS}
                        multiline={true}
                        style={{ fontSize: 18, paddingHorizontal: 10, paddingVertical: 20, paddingTop: 15, backgroundColor: '#cdd1d1', width: '100%', borderRadius: 10 }}
                        value={FAQContent}
                        onChangeText={(v) => { setFAQContent(v) }} />
                </TransparentView>
                {
                    errorMsg.length != 0 ?
                        <I18NText text={errorMsg} style={{ color: 'red', textAlign: 'left', width: '100%', marginTop: 10, marginBottom: 15 }} />
                        : null
                }

                <Pressable
                    style={{
                        marginTop: 10, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, marginBottom: 15, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                    onPress={() => addFAQ()} >

                    <I18NText text='Send FAQs' />

                    <ActivityIndicator
                        animating={updating}
                        color='black'
                        style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                </Pressable>
            </PopupModal>
        </View>
    )
})

export const FAQItem = React.memo((props: FAQItemType) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const translateYAnim = useRef(new Animated.Value(0)).current
    const [height, setHeight] = useState(-1)

    const startAnimation = useCallback((isCollapse: boolean, height: number) => {
        Animated.timing(translateYAnim, {
            useNativeDriver: false,
            toValue: isCollapse ? height : 0,
            duration: 200
        }).start()
    }, [])


    useEffect(() => {
        translateYAnim.stopAnimation()
        startAnimation(isCollapse, height)
    }, [isCollapse])

    return (
        <TransparentView style={{ flexShrink: 1, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TransparentView style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <TransparentView style={{ width: 40, marginLeft: 10 }}>
                        <FontAwesome name="question-circle" size={24} color='#b80707' />
                    </TransparentView>

                    <Text text={props.question} style={{ fontSize: 22, flexShrink: 1, textAlign: 'left' }} />
                </TransparentView>
                <Pressable
                    style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { setIsCollapse(!isCollapse) }} >
                    <FontAwesome
                        name={isCollapse ? 'angle-down' : 'angle-up'}
                        size={24}
                        color='grey' />
                </Pressable>
            </View>

            <Animated.View
                style={{ marginBottom: 5, height: height == -1 ? null : translateYAnim, position: 'relative', zIndex: 1 }}>
                <TransparentView
                    onLayout={(e) => { if (e.nativeEvent.layout.height > height) setHeight(e.nativeEvent.layout.height) }}
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'absolute', marginTop: 5, right: 0, left: 0 }}>
                    <TransparentView style={{ width: 40, marginLeft: 10 }}>
                        <FontAwesome2 name="question-answer" size={24} color='#067f91' style={{ marginTop: 5 }} />
                    </TransparentView>

                    <Text
                        text={props.answer ?? 'Waitting for admin to anwser'}
                        style={{ flexShrink: 1, textAlign: 'left', fontSize: 22, marginLeft: 15, }} />
                </TransparentView>
            </Animated.View>

            <View style={{ height: 10, justifyContent: 'center', zIndex: 2 }}>
                <View style={{ height: 1, backgroundColor: 'grey' }} />
            </View>
        </TransparentView>
    )
})

export const FAQItemShimmer = React.memo((props: FAQItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 30, width: '10%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 30, flexGrow: 1, borderRadius: 15, margin: 5 }} />
            </TransparentView>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 30, width: '10%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 30, flexGrow: 1, borderRadius: 15, margin: 5 }} />
            </TransparentView>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 30, width: '10%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 30, flexGrow: 1, borderRadius: 15, margin: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type FAQItemShimmerType = {
    visible: boolean
}

export type FAQItemType = {
    id: number,
    userId: number,
    question: string,
    status: number,
    answer: string
}

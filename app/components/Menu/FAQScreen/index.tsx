import React, { useCallback, useEffect, useRef, useState } from "react"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { FontAwesome, FontAwesome2 } from "../../../base/FontAwesome"
import { Animated, Pressable } from "react-native"
import { useTheme, useThemeColor } from "../../../base/Themed"
import Colors from "../../../constants/Colors"
import { PopupModal } from "../../../base/PopupModal"
import { TextInput } from "react-native-gesture-handler"
import { Button } from "../../../base/Button"


export const FAQScreen = React.memo(() => {
    const [listFAQ, setListFAQ] = useState([])
    const [FAQContent, setFAQContent] = useState('')
    const popupRef = useRef(null)

    useEffect(() => {
        setListFAQ(getFAQs())
    }, [])

    const renderItem = ({ item }: { item: FAQItemType }) => {
        return (
            <FAQItem {...item} />
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
                    ListFooterComponent: <View style={{height: 80}}/>
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
                    <FontAwesome name="plus" size={35} color='#ed8f05' />
                </Pressable>
            </TransparentView>

            <PopupModal ref={popupRef} title="FAQs" shouldAvoidKeyboard={true}>
                <TransparentView style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextInput
                        placeholder="Your FAQS"
                        multiline={true}
                        style={{ fontSize: 18, paddingHorizontal: 10, paddingVertical: 20, paddingTop: 15, backgroundColor: '#cdd1d1', width: '100%', borderRadius: 10 }}
                        value={FAQContent}
                        onChangeText={(v) => { setFAQContent(v) }} />
                </TransparentView>

                <Button
                    text="Send FAQs"
                    style={{
                        marginHorizontal: 15, borderRadius: 15, marginBottom: 20,
                        marginTop: 15
                    }}
                    textSize={20}
                    onPress={() => {
                        popupRef.current.changeVisibility(false)
                        console.log('FAQS',)
                    }} />
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
                    <TransparentView style={{width: 40, marginLeft: 10}}>
                        <FontAwesome name="question-circle" size={24} color='#b80707' />
                    </TransparentView>

                    <Text text={props.question} style={{ marginLeft: 15, fontSize: 22, flexShrink: 1, textAlign: 'left' }} numberOfLines={3} />
                </TransparentView>

                <Pressable
                    style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { setIsCollapse(!isCollapse) }} >
                    <FontAwesome
                        name={isCollapse ? 'angle-down' : 'angle-up'}
                        size={24} 
                        color='grey'/>
                </Pressable>
            </View>

            <Animated.View
                style={{ marginBottom: 5, height: height == -1 ? null : translateYAnim, position: 'relative', zIndex: 1}}>
                <TransparentView
                    onLayout={(e) => { if (e.nativeEvent.layout.height > height) setHeight(e.nativeEvent.layout.height) }} 
                    style={{flexDirection: 'row' , justifyContent: 'center', position: 'absolute', marginTop: 5, right: 0, left: 0 }}>
                    <TransparentView style={{width: 40, marginLeft: 10}}>
                        <FontAwesome2 name="question-answer" size={24} color='#067f91' style={{marginTop: 5}}/>
                    </TransparentView>

                    <Text
                        numberOfLines={10}
                        text={props.answer + 'dsa kfjsdk;fjafj sd;fkjasdkfj skflsjdf ksjdfals kdfjsd kfjsdfksj f;dslk jfk;dsfj; akd sfj; lsjf'}
                        style={{ flexShrink: 1, textAlign: 'left', fontSize: 22, marginLeft: 15,}} />
                </TransparentView>
            </Animated.View>

            <View style={{ height: 10, justifyContent: 'center', zIndex: 2 }}>
                <View style={{ height: 1, backgroundColor: 'grey' }} />
            </View>
        </TransparentView>
    )
})

export type FAQItemType = {
    question: string,
    answer: string
}


// dummy
const getFAQs = (): FAQItemType[] => [
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
    {
        question: "How are  you today",
        answer: "I'm fine, thank you"
    },
]

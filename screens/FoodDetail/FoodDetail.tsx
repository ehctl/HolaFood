import { useEffect, useState } from "react"
import { ListRenderItemInfo, Image, Pressable, KeyboardAvoidingView, Platform } from "react-native"
import { AnimatedHeaderScreen } from "../AnimatedHeaderScreen"
import { View } from "../../components/View"
import { Text } from "../../components/Text"
import { Level2Header, Level2HeaderStat } from "../../components/Headers/Level2Header"
import { ScrollView } from "react-native-gesture-handler"
import React from "react"
import { FontAwesome } from "../../components/FontAwesome"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Review } from "./Review"
import { ImageHeader } from "./ImageHeader"
import { Info } from "./Info"
import { Order } from "./Order"

export const FoodDetailScreen = React.memo(({ route }: any) => {
    const [data, setData] = useState<FoodDetailData>(null)

    useEffect(() => {
        const fetchAsync = async () => {
            const itemId = route.params.itemId
            // await wait(5000)
            setData(DUMMY)
        }

        fetchAsync()
    })

    const renderItems = ({ item }: ListRenderItemInfo<ListItem>) => {
        switch (item) {
            case ListItem.IMAGE: {
                return <ImageHeader {...data} />
            }
            case ListItem.INFO: {
                return <Info {...data} />
            }
            case ListItem.REVIEW: {
                return <Review {...data} />
            }
            case ListItem.ORDER: {
                return <Order {...data} />
            }
            default:
                console.log('Unsupported type')
        }
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AnimatedHeaderScreen
                headerProps={{
                    header: <Level2Header title={data?.name ? data.name : 'Loading'} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    renderItem: renderItems,
                    data: getListItem(),
                    keyExtractor: (_, index) => `${index}`,
                }}
                hideReload={true}
                fetchingDataPreLoad={data == null}
            />
        </View>
    )
})


enum ListItem {
    IMAGE,
    INFO,
    REVIEW,
    ORDER
}

const getListItem = (): ListItem[] => {
    return [
        ListItem.IMAGE,
        ListItem.INFO,
        ListItem.ORDER,
        ListItem.REVIEW
    ]
}

const DUMMY: FoodDetailData = {
    id: '1223',
    name: 'S-Golden Bubble Milk Tea',
    description: 'Trà Sữa Trân Châu Hoàng Kim - Size nhỏ',
    price: 50000,
    isFavorite: false,
    images: [
        'https://cdn.dayphache.edu.vn/wp-content/uploads/2020/02/mon-tra-sua-tran-chau.jpg',
        'http://cdn.tgdd.vn/Files/2021/08/10/1374160/hoc-cach-pha-tra-sua-o-long-dai-loan-thom-ngon-chuan-vi-ai-cung-me-202108100039248020.jpg',
        'data:image/jpeg;base64,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'
    ],
    rate: 4.5,
    sellerId: '331123',
    sellerName: 'Koi The\' Hồ Tùng Mậu',
    numOfReviews: 121,
    reviews: [
        {
            id: '123123',
            userId: '1231232',
            userName: 'Tuấn Linh',
            content: 'Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích',
            createdAt: Date.now(),
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU'
            ]
        },
        {
            id: '1231231',
            userId: '1231232',
            userName: 'Tuấn Linh',
            content: 'Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích',
            createdAt: Date.now(),
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU'
            ]
        },
        {
            id: '12312312',
            userId: '1231232',
            userName: 'Tuấn Linh',
            content: 'Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích',
            createdAt: Date.now(),
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU'
            ]
        },
        {
            id: '123123123',
            userId: '1231232',
            userName: 'Tuấn Linh',
            content: 'Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích',
            createdAt: Date.now(),
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU'
            ]
        },
        {
            id: '123165',
            userId: '1231232',
            userName: 'Tuấn Linh',
            content: 'Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích',
            createdAt: Date.now(),
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU'
            ]
        },
    ]
}

export type FoodDetailData = {
    id: string,
    name: string,
    description: string,
    price: number,
    isFavorite: boolean,
    images: string[],
    rate: number,
    numOfReviews,
    reviews: ReviewType[],
    sellerName: string,
    sellerId: string
}

export type ReviewType = {
    id: string,
    userId: string,
    userName: string,
    content: string,
    images: string[],
    createdAt: number
}
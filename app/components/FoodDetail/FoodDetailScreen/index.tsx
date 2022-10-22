import { useCallback, useEffect, useState } from "react"
import { ListRenderItemInfo } from "react-native"
import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { View } from "../../../base/View"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import React from "react"
import { Review } from "../Review"
import { ImageHeader } from "../ImageHeader"
import { Info } from "../Info"
import { Order } from "../Order"
import { FoodDetailShimmer } from "../FoodDetailShimmer"
import { wait } from "../../../utils/Utils"
import { getFoodDetail } from "../../../core/apis/requests"

export const FoodDetailScreen = React.memo(({ route }: any) => {
    const [foodData, setFoodData] = useState<FoodDetailData>(null)
    const [listItem, setListItem] = useState<ListItem[]>([])
    const [loading, setLoading] = useState(false)

    const fetchData = useCallback(async () => {
        const itemId = route.params.itemId
        setLoading(true)
        setListItem([])

        await wait(2000)
        
        getFoodDetail(
            '1232131',
            itemId,
            (response) => {
                const data = response.data
                setFoodData(data)
                setListItem(getListItem())
                setLoading(false)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [])

    useEffect(() => {
        fetchData()

    }, [])

    const renderItems = ({ item }: ListRenderItemInfo<ListItem>) => {
        switch (item) {
            case ListItem.IMAGE: {
                return <ImageHeader {...foodData} />
            }
            case ListItem.INFO: {
                return <Info {...foodData} />
            }
            case ListItem.REVIEW: {
                return <Review foodId={foodData.id} />
            }
            case ListItem.ORDER: {
                return <Order {...foodData} />
            }
            default:
                console.log('Unsupported type')
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header title={foodData?.name ? foodData.name : 'Loading...'} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: { paddingHorizontal: 10 },
                    renderItem: renderItems,
                    data: listItem,
                    keyExtractor: (_, index) => `${index}`,
                    ListFooterComponent: <FoodDetailShimmer visible={loading} />
                }}
                hideReload={true}
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
    id: "1223",
    name: "S-Golden Bubble Milk Tea",
    description: "Trà Sữa Trân Châu Hoàng Kim - Size nhỏ",
    price: 50000,
    isFavorite: false,
    images: [
        "https://cdn.dayphache.edu.vn/wp-content/uploads/2020/02/mon-tra-sua-tran-chau.jpg",
        "http://cdn.tgdd.vn/Files/2021/08/10/1374160/hoc-cach-pha-tra-sua-o-long-dai-loan-thom-ngon-chuan-vi-ai-cung-me-202108100039248020.jpg",
    ],
    rate: 4.5,
    sellerId: "331123",
    sellerName: "Koi The\" Hồ Tùng Mậu",
    numOfReviews: 121,
    reviews: [
        {
            id: "123123",
            userId: "1231232",
            userName: "Tuấn Linh",
            content: "Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích",
            createdAt: 1666399922523,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU"
            ]
        },
        {
            id: "1231231",
            userId: "1231232",
            userName: "Tuấn Linh",
            content: "Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích",
            createdAt: 1666399922523,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU"
            ]
        },
        {
            id: "12312312",
            userId: "1231232",
            userName: "Tuấn Linh",
            content: "Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích",
            createdAt: 1666399922523,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU"
            ]
        },
        {
            id: "123123123",
            userId: "1231232",
            userName: "Tuấn Linh",
            content: "Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích",
            createdAt: 1666399922523,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU"
            ]
        },
        {
            id: "123165",
            userId: "1231232",
            userName: "Tuấn Linh",
            content: "Uống bao nhiêu lần vẫn thấy ngon, ngọt vừa trân châu dài ăn rất thích",
            createdAt: 1666399922523,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7GVTybzHy0rJNYqWGa4-5hyjEyYmd7_d_qDc4tODAVfjC7mySQgoLCA2Yt10C8gkLiE&usqp=CAU"
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
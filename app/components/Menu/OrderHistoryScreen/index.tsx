import React, { useCallback, useEffect, useState } from "react";
import { View } from "../../../base/View";
import { AnimatedHeader } from "../../../base/AnimatedHeader";
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header";
import { OrderData, OrderItem } from "../../Order/OrderItem";
import { ListRenderItemInfo } from "react-native";
import { formatCreatedDateType, wait } from "../../../utils/Utils";
import { OrderStatus } from "../../Order/OrderItem";
import { OrderItemShimmer } from "../../Order/OrderItemShimmer";


export const OrderHistoryScreen = React.memo(() => {
    const [listOrder, setListOrder] = useState<OrderData[]>([])
    const [loading, setLoading] = useState(false)

    const fetchData = useCallback(async () => {
        setLoading(true)
        await wait(2000)

        setListOrder(getOrderList())
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    const renderItem = ({ item, index }: ListRenderItemInfo<OrderData>) => {
        return (
            <OrderItem
                {...item} />
        )
    }

    const getFooterComp = () => {
        return <OrderItemShimmer visible={loading}/>
    }

    const extractor = (item: OrderData, index: number) => `order_list_item_` + index
    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header
                        title="Order History"
                        canNavigateToOrderScreen={true} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: { marginHorizontal: 10 },
                    renderItem: renderItem,
                    data: listOrder,
                    keyExtractor: extractor,
                    ListFooterComponent: getFooterComp()
                }}
                hideReload={true} >


            </AnimatedHeader>
        </View>
    )
})


const getOrderList = (): OrderData[] => ([
    {
        "id": 700,
        "items": [
            {
                "id": 65,
                "note": "",
                "option": [],
                "price": 35000,
                "productDetail": {
                    "categoryID": 3,
                    "categoryName": "Bún",
                    "description": "Cơm chiên hay cơm rang là một món cơm nấu đã được chế biến trong chảo hoặc chảo rán và thường được trộn với các thành phần khác như trứng, rau, hải sản hoặc thịt.",
                    "id": 1,
                    "isFavorite": true,
                    "numberOfReview": 1,
                    "option": [
                        {
                            "id": 4,
                            "optionName": "Thêm nước ngọt",
                            "optionPrice": 5000,
                            "productId": 1,
                        },
                        {
                            "id": 5,
                            "optionName": "Thêm canh",
                            "optionPrice": 5000,
                            "productId": 1,
                        },
                    ],
                    "productImgURL": "https://danviet.mediacdn.vn/2020/8/31/image4-1598431030-68-width605height416-1598810316509-15988103165132025318295.png",
                    "productName": "Cơm rang",
                    "sellPrice": 35000,
                    "shopAddress": "Đại học FPT",
                    "shopID": 19,
                    "shopName": "Cơm Hải Anh",
                    "star": 3,
                    "statusSell": "Đang bán",
                },
                "quantity": 1,
            },
        ],
        "price": 35000,
        "status": OrderStatus.SUBMITTED,
        "createdDate": formatCreatedDateType(new Date()),
        "address": "29 Khúc Thừa Dụ"
    },
    {
        "id": 699,
        "items": [
            {
                "id": 65,
                "note": "",
                "option": [],
                "price": 35000,
                "productDetail": {
                    "categoryID": 4,
                    "categoryName": "Bún",
                    "description": "Cơm chiên hay cơm rang là một món cơm nấu đã được chế biến trong chảo hoặc chảo rán và thường được trộn với các thành phần khác như trứng, rau, hải sản hoặc thịt.",
                    "id": 1,
                    "isFavorite": true,
                    "numberOfReview": 1,
                    "option": [
                        {
                            "id": 4,
                            "optionName": "Thêm nước ngọt",
                            "optionPrice": 5000,
                            "productId": 1,
                        },
                        {
                            "id": 5,
                            "optionName": "Thêm canh",
                            "optionPrice": 5000,
                            "productId": 1,
                        },
                    ],
                    "productImgURL": "https://danviet.mediacdn.vn/2020/8/31/image4-1598431030-68-width605height416-1598810316509-15988103165132025318295.png",
                    "productName": "Cơm rang",
                    "sellPrice": 35000,
                    "shopAddress": "Đại học FPT",
                    "shopID": 19,
                    "shopName": "Cơm Hải Anh",
                    "star": 3,
                    "statusSell": "Đang bán",
                },
                "quantity": 1,
            },
        ],
        "price": 35000,
        "status": OrderStatus.SUBMITTED,
        "createdDate": formatCreatedDateType(new Date()),
        "address": "29 Khúc Thừa Dụ"
    }
])
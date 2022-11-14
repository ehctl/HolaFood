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
import { getFoodDetail, getFoodOption } from "../../../core/apis/Requests"
import { useLanguage } from "../../../base/Themed"

export const FoodDetailScreen = React.memo(({ route }: any) => {
    const [foodData, setFoodData] = useState<FoodDetailData>(null)
    const [listItem, setListItem] = useState<ListItem[]>([])
    const [loading, setLoading] = useState(false)

    const I18NLoading = useLanguage('Loading')

    const fetchData = useCallback(async () => {
        const itemId = route.params.itemId
        setLoading(true)
        setListItem([])

        await wait(2000)

        getFoodDetail(
            itemId,
            (response) => {
                const data = response.data[0]
                getFoodOption(
                    itemId,
                    (response1) => {
                        const data1 = response1.data
                        setFoodData(mapFoodDetailDataFromRequest(data, data1))
                        setListItem(getListItem())
                        setLoading(false)
                    },
                    (e) => {
                        setFoodData(mapFoodDetailDataFromRequest(data, []))
                        setListItem(getListItem())
                        setLoading(false)
                        console.log(e)
                    }
                )
            },
            (e) => {
                setLoading(false)
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
                return <Review {...foodData} />
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
                    header: <Level2Header
                        title={foodData?.productName ? foodData.productName : `${I18NLoading}...`}
                        canNavigateToOrderScreen={true} />,
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

export const mapFoodDetailDataFromRequest = (item: any, options: FoodOptionType[]) => {
    item.isFavorite = item.isFavorite == 1
    item.option = options
    return item
}

export type FoodDetailData = {
    id: number,
    productName: string,
    description: string,
    sellPrice: number,
    categoryID: number,
    categoryName: string,
    productImgURL: string,
    statusSell: string,
    shopID: number,
    shopName: string,
    shopAddress: string,
    isFavorite: boolean,
    star: number,
    numberOfReview: number,
    option: FoodOptionType[]
}


export type FoodOptionType = {
    id: number,
    optionName: string,
    optionPrice: number,
    productId: number,
}
import React from "react"
import { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { useToast } from "../../../base/Toast"
import { getShopListFood } from "../../../core/apis/Requests"
import { Constant } from "../../../utils/Constant"
import { wait } from "../../../utils/Utils"
import { FoodDetailData } from "../../FoodDetail/FoodDetailScreen"
import { ShopFoodListShimmer } from "../ShopDetailShimmer.tsx"
import { ShopFoodItem } from "../ShopFoodItem"

export const ShopFoodList = React.memo((props: ShopFoodListProps) => {
    const [foodList, setFoodList] = useState<FoodDetailData[]>([])
    const [loading, setLoading] = useState(true)
    const [reachEndList, setReachEndList] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)

    const showToast = useToast()

    const fetchData = useCallback((pageIndex: number) => {
        setLoading(true)

        getShopListFood(
            props.shopId,
            pageIndex,
            (response) => {
                const data = response.data
                data.forEach(item => {
                    item.isFavorited = item.isFavorited == 1
                    item.isVerified = item.isVerified == 1
                });
                if (data.length < 10)
                    setReachEndList(true)
                setFoodList([...foodList, ...data])
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [foodList])

    useEffect(() => {
        setPageIndex(0)
        setReachEndList(false)
        fetchData(0)
    }, [])

    const renderItems = ({ item }) => {
        return (
            <ShopFoodItem data={item} />
        )
    }

    return (
        <FlatList
            renderItem={renderItems}
            data={foodList}
            keyExtractor={(_, index) => `${index}`}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (!reachEndList && !loading) {
                    fetchData(pageIndex + 1)
                    setPageIndex(pageIndex + 1)
                }
            }}
            ListFooterComponent={<ShopFoodListShimmer visible={loading} />}
        />
    )
})

export type ShopFoodListProps = {
    shopId: string
}

import React from "react"
import { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { getShopListFood } from "../../../core/apis/requests"
import { wait } from "../../../utils/Utils"
import { DUMMY_DATA, DUMMY_TYPE } from "../../Home/DummyData"
import { ShopFoodListShimmer } from "../ShopDetailShimmer.tsx"
import { ShopFoodItem, ShopFoodItemProps } from "../ShopFoodItem"

export const ShopFoodList = React.memo((props: ShopFoodListProps) => {
    const [foodList, setFoodList] = useState<DUMMY_TYPE[]>([])
    const [loading, setLoading] = useState(true)
    const [reachEndList, setReachEndList] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)

    const fetchData = useCallback(async () => {
        setLoading(true)
        await wait(2000)
        
        getShopListFood(
            props.shopId,
            pageIndex,
            (response) => {
                const data = response.data
                data.forEach(item => {
                    item.isFavorited = item.isFavorited == 1
                    item.isVerified = item.isVerified == 1
                });

                setFoodList([...foodList, ...data])
                setLoading(false)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [foodList])

    useEffect(() => {
        fetchData()
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
            scrollEnabled={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (!reachEndList) {
                    setPageIndex(pageIndex + 1)
                    fetchData()
                }
            }}
            ListFooterComponent={<ShopFoodListShimmer visible={loading} />}
        />
    )
})

export type ShopFoodListProps = {
    shopId: string
}

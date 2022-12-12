import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../base/View"
import { Text } from "../../base/Text"
import { FoodItem } from "../Home/FoodItem"
import { wait } from "../../utils/Utils"
import { FoodItemShimmer } from "../Home/FoodItemShimmer"
import { getFoodList } from "../../core/apis/Requests"
import { FoodDetailData, mapFoodDetailDataFromRequest1 } from "../FoodDetail/FoodDetailScreen"
import { useSelector } from "react-redux"
import { AppState } from "../../redux/Reducer"
import { I18NText } from "../../base/Text"
import { FoodListType } from "./FoodListType"
import { PopularFoodItem } from "../Home/FoodItem/PopularFoodItem"
import { PopularFoodData } from "../Home/HomeFoodList"
import { ListRenderItemInfo } from "react-native"
import { useToast } from "../../base/Toast"
import { Constant } from "../../utils/Constant"

export const FoodList = React.memo((props: FoodListProps) => {
    const appProps = useSelector((state: AppState) => ({
        categoryList: state.categoryList
    }))

    const showToast = useToast()

    const [reachListEnd, setReachListEnd] = useState(false)
    const [loadingMore, setLoadingMore] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const [listData, setListData] = useState<(FoodDetailData | PopularFoodData)[]>([])
    const [abortController, setAbortController] = useState<AbortController>(null)

    useEffect(() => {
        setReachListEnd(props.type == FoodListType.POPULAR_FOOD)
        setPageIndex(0)
        fetchMoreData(0)
    }, [props.type])

    
    const renderItem = ({ item, index }: ListRenderItemInfo<FoodDetailData | PopularFoodData>) => {
        //@ts-ignore
        if (props.type == FoodListType.POPULAR_FOOD || !item?.shopName)
            return <PopularFoodItem data={item as PopularFoodData} index={index} />

        return <FoodItem data={item as FoodDetailData} />
    }

    const extractor = (_: any, index: number) => `${index}`

    const fetchMoreData = useCallback((currentPageIndex: number) => {
        setLoadingMore(true)
        abortController?.abort()
        const newAbortController = new AbortController()
        setAbortController(newAbortController)

        if (currentPageIndex == 0 && listData.length > 0)
            setListData([])

        getFoodList(
            props.type,
            currentPageIndex,
            (response) => {
                const data = response.data
                if (props.type == FoodListType.POPULAR_FOOD) {
                    setListData(data.map((i: any): PopularFoodData => ({
                        productName: i.productName,
                        quantity: i.quantity,
                        productImageUrl: i.productImgUrl
                    })))
                } else {
                    const listFood = response.data.map((i) => mapFoodDetailDataFromRequest1(i))

                    if (listFood.length < 10)
                        setReachListEnd(true)

                    setListData(currentPageIndex == 0 ? listFood : [...listData, ...listFood])
                }
                setLoadingMore(false)
            },
            (e) => {
                console.log(e)
                setLoadingMore(false)
            },
            newAbortController
        )
    }, [listData, props.type, abortController])

    const getFoodListTitle = useCallback(() => {
        if (typeof props.type == "number") {
            return appProps.categoryList.filter((item) => item.id == props.type)[0]?.name
        }
        return props.type

    }, [props.type, appProps.categoryList])

    return (
        <View style={{
            flex: 1, flexGrow: 1, flexShrink: 1, marginTop: 10, borderRadius: 15, marginHorizontal: 10
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 5 }}>
                <I18NText
                    style={{ textAlign: 'left', fontWeight: '600', fontSize: 20 }}
                    text={getFoodListTitle()} />
            </TransparentView>

            <View style={{ flex: 1, flexGrow: 1, height: '100%', backgroundColor: 'transparent' }}>
                <FlatList
                    contentContainerStyle={{ flex: 1 }}
                    style={{}}
                    data={listData}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (!reachListEnd && !loadingMore) {
                            fetchMoreData(pageIndex + 1)
                            setPageIndex(pageIndex + 1)
                        }
                    }}
                    keyExtractor={extractor}
                    ListEmptyComponent={loadingMore ? null : <I18NText text='No Food Right Now, Please Comeback Later' />}
                    ListFooterComponent={<FoodItemShimmer visible={loadingMore} />}
                    ListFooterComponentStyle={{}} />
            </View>
        </View>
    )
})



export type ItemType = FoodDetailData

type FoodListProps = {
    type: string | number,
}

import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../base/View"
import { DUMMY_DATA, DUMMY_TYPE } from "../Home/DummyData"
import { Text } from "../../base/Text"
import { FoodItem } from "../Home/FoodItem"
import { wait } from "../../utils/Utils"
import { FoodItemShimmer } from "../Home/FoodItemShimmer"
import { FoodListType } from "./FoodListType"
import { getFoodList } from "../../core/apis/requests"

export const FoodList = React.memo((props: FoodListProps) => {
    const [reachListEnd, setReachListEnd] = useState(false)
    const [loadingMore, setLoadingMore] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)
    const [listData, setListData] = useState<DUMMY_TYPE[]>([])


    useEffect(() => {
        fetchMoreData(0)
    }, [props.type])

    const renderItem = ({ item }: { item: ItemType }) => {
        return <FoodItem {...item} />
    }

    const extractor = (_, index: number) => `${index}`

    const fetchMoreData = useCallback(async (currentPageIndex: number) => {
        setLoadingMore(true)
        if (currentPageIndex == 0 && listData.length > 0)
            setListData([])
            
        await wait(2000)

        getFoodList(
            '12323',
            props.type,
            currentPageIndex,
            (response) => {
                const data = response.data
                setListData(currentPageIndex == 0 ? data : [...listData, ...data])
                setLoadingMore(false)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [listData, props.type])

    return (
        <View style={{
            marginTop: 10, backgroundColor: '#a3c3c4', borderRadius: 15,
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 5 }}>
                <Text
                    style={{ textAlign: 'left', fontWeight: '600', fontSize: 20 }}
                    text={props.type.toString()} />
            </TransparentView>

            <View style={{ justifyContent: 'center', backgroundColor: 'transparent' }}>
                <FlatList
                    contentContainerStyle={{}}
                    style={{}}
                    showsHorizontalScrollIndicator={false}
                    data={listData}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (!reachListEnd) {
                            fetchMoreData(pageIndex + 1)
                            setPageIndex(pageIndex + 1)
                        }
                    }}
                    keyExtractor={extractor}
                    ListFooterComponent={<FoodItemShimmer visible={loadingMore} />}
                    ListFooterComponentStyle={{}} />
            </View>
        </View>
    )
})



export type ItemType = DUMMY_TYPE

type FoodListProps = {
    type: FoodListType,
}

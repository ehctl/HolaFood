import React, { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../components/View"
import { DUMMY_DATA, DUMMY_TYPE } from "../Dumm"
import { Text } from "../../components/Text"
import { VerticalFoodItem } from "../../components/PopularFoodItem"
import { HorizontalFoodItem } from "../../components/NewFoodItem"
import { ActivityIndicator } from 'react-native';
import { wait } from "../../utils/Utils"

export const FoodList = React.memo((props: FoodListProps) => {
    const [refreshing, setRefreshing] = useState(true)
    const [reachListEnd, setReachListEnd] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [data, setData] = useState(DUMMY_DATA)


    useEffect(() => {
        const timing = async () => {
            // await wait(2000)
            setRefreshing(false)
        }

        timing()
    })

    const renderItem = ({ item }: { item: ItemType }) => {
        // draft item in list :~:
        if (props.type == FoodListType.FAVORITE_FOOD || props.type == FoodListType.NEW_FOOD)
            return <HorizontalFoodItem {...item} />
        else
            return <VerticalFoodItem {...item} />
    }

    const extractor = (item: DUMMY_TYPE, index: number) => `${index}`

    const getTitle = (type: FoodListType) => {
        switch (type) {
            case FoodListType.FAVORITE_FOOD:
                return 'Favorite Food'
            case FoodListType.NEW_FOOD:
                return 'New Food'
            case FoodListType.POPULAR_FOOD:
                return 'Popular Food'
            default:
                console.log('Unsupported type')
        }
    }

    const getFooter = () => {
        return (
            <TransparentView style={{ margin: 10 }}>
                {
                    loadingMore ?
                        <ActivityIndicator color='orange' /> : null
                }
            </TransparentView>
        )
    }

    const fetchMoreData = useCallback(async () => {
        setLoadingMore(true)
        await wait(5000)
        setData([...data, ...DUMMY_DATA])
        setLoadingMore(false)
    }, [data])

    return (
        <View style={{
            marginTop: 10, backgroundColor: 'grey',
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: props.setListDirectionHorizon ? 0 : 15,
            borderBottomRightRadius: props.setListDirectionHorizon ? 0 : 15
        }}>
            <TransparentView>
                <Text
                    style={{ textAlign: 'left', paddingLeft: 10, paddingVertical: 10, fontWeight: '600', fontSize: 20 }}
                    text={getTitle(props.type)}
                />
            </TransparentView>
            <View style={{ flexDirection: props.type == FoodListType.POPULAR_FOOD ? 'column' : 'row', justifyContent: 'center', backgroundColor: 'transparent' }}>
                {
                    refreshing ?
                        <ActivityIndicator style={{ margin: 10 }} color='orange' />
                        : <FlatList
                            contentContainerStyle={{}}
                            style={{}}
                            horizontal={props.setListDirectionHorizon}
                            scrollEnabled={props.setListDirectionHorizon}
                            showsHorizontalScrollIndicator={false}
                            data={data}
                            renderItem={renderItem}
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                if (!reachListEnd)
                                    fetchMoreData()
                            }}
                            keyExtractor={extractor}
                            ListFooterComponent={getFooter()}
                            ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center' }} />
                }
            </View>
        </View>
    )
})

export enum FoodListType {
    FAVORITE_FOOD,
    NEW_FOOD,
    POPULAR_FOOD
}

export type ItemType = DUMMY_TYPE

type FoodListProps = {
    type: FoodListType,
    setListDirectionHorizon: boolean
}

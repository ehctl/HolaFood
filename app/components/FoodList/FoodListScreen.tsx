import React, { useEffect, useState } from "react"
import { ListRenderItemInfo } from "react-native"
import { Level2Header, Level2HeaderStat } from "../../base/Headers/Level2Header"
import { View } from "../../base/View"
import { AnimatedHeader } from "../../base/AnimatedHeader"
import { CategoryList } from "./CategoryList"
import { FoodList } from "./FoodList"
import { FoodListScreenContext, FoodListType } from "./FoodListType"


export const FoodListScreen = () => {
    const [foodListType, setFoodListType] = useState(FoodListType.POPULAR_FOOD)

    const renderItems = ({ item }: ListRenderItemInfo<ListItem>) => {
        switch (item) {
            case ListItem.CATEGORY_LIST: {
                return <CategoryList />
            }
            case ListItem.FOOD_LIST: {
                return <FoodList type={foodListType} />
            }
            default:
                console.log('Unsupported type')
        }
    }

    return (
        <FoodListScreenContext.Provider value={{ foodListType: foodListType, changeFoodListType: setFoodListType }}>
            <View style={{ flex: 1 }}>
                <AnimatedHeader
                    headerProps={{
                        header: <Level2Header title='Foods' />,
                        headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                    }}
                    flatListProps={{
                        style: { paddingHorizontal: 10 },
                        renderItem: renderItems,
                        data: getListItem(),
                        keyExtractor: (_, index) => `${index}`,
                    }}
                    hideReload={true}
                />
            </View>
        </FoodListScreenContext.Provider>
    )
}

enum ListItem {
    CATEGORY_LIST,
    FOOD_LIST
}

const getListItem = (): ListItem[] => {
    return [
        ListItem.CATEGORY_LIST,
        ListItem.FOOD_LIST,
    ]
}


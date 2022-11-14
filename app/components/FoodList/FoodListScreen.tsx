import React, { useEffect, useState } from "react"
import { ListRenderItemInfo } from "react-native"
import { Level2Header, Level2HeaderStat } from "../../base/Headers/Level2Header"
import { View } from "../../base/View"
import { AnimatedHeader } from "../../base/AnimatedHeader"
import { CategoryList } from "./CategoryList"
import { FoodList } from "./FoodList"
import { FoodListScreenContext, FoodListType } from "./FoodListType"
import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '../../navigation/StackGroup';


export const FoodListScreen = (props: FoodListScreenProps) => {
    const [foodListType, setFoodListType] = useState<string | number>(props.route.params?.type ?? FoodListType.POPULAR_FOOD)

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
        <View style={{ flex: 1 }}>
            <FoodListScreenContext.Provider value={{ foodListType: foodListType, changeFoodListType: setFoodListType }}>
                <AnimatedHeader
                    headerProps={{
                        header: <Level2Header title='Foods' />,
                        headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                    }}
                    flatListProps={{
                        contentContainerStyle: {flex: 1},
                        style: {},
                        renderItem: renderItems,
                        data: getListItem(),
                        keyExtractor: (_, index) => `${index}`,
                    }}
                    hideReload={true}
                />
            </FoodListScreenContext.Provider>
        </View>
    )
}

export interface FoodListScreenProps {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'FoodList'>;
    route: RouteProp<GroupStackParamList, 'FoodList'>
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


import { useCallback, useState } from "react"
import { HomePageHeader, HomePageHeaderStat } from "../../components/Headers/HomePageHeader"
import { AnimatedHeaderScreen } from ".././AnimatedHeaderScreen"
import React from "react"
import { News } from "./News"
import { Location } from "./Location"
import { FoodList, FoodListType } from "./FoodList"
import { View } from "../../components/View"


export const HomeDraft = React.memo(({ navigation }: any) => {
    const renderItem = ({ item }: { item: HomeItem }) => {
        // draft item in list :~:
        switch (item) {
            case HomeItem.NEWS:
                return <News />
            case HomeItem.LOCATION:
                return <Location />
            case HomeItem.FOOD_LIST:
                return <FoodList type={FoodListType.POPULAR_FOOD} horizon={false} />
            default:
                console.log('Unsupported item type')
        }
    }

    const [itemList, setItemList] = useState([
        HomeItem.NEWS,
        HomeItem.LOCATION,
        HomeItem.FOOD_LIST
    ])

    const extractor = (item: HomeItem, index: number) => `${index}`

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeaderScreen
                headerProps={{
                    header: < HomePageHeader />,
                    headerHeight: HomePageHeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: {marginHorizontal: 10},
                    renderItem: renderItem,
                    data: itemList,
                    keyExtractor: extractor,
                }}
            />
        </View>
    )
})

enum HomeItem {
    NEWS,
    LOCATION,
    FOOD_LIST
}



import { useCallback, useState } from "react"
import { Level1Header, Level1HeaderStats } from "../../base/Headers/Level1Header"
import { AnimatedHeader } from "../../base/AnimatedHeader"
import React from "react"
import { News } from "./News"
import { Location } from "./Location"
import { HomeFoodList } from "./HomeFoodList"
import { View } from "../../base/View"
import { FoodListType } from "../FoodList/FoodListType"
import { CategoryList } from "./CategoryList"


export const HomeScreen = React.memo(({ navigation }: any) => {
    const renderItem = ({ item }: { item: HomeItem }) => {
        // draft item in list :~:
        switch (item) {
            case HomeItem.NEWS:
                return <News />
            case HomeItem.LOCATION:
                return <Location />
            case HomeItem.CATEGORY_LIST:
                return <CategoryList />
            case HomeItem.FOOD_LIST:
                return <HomeFoodList type={FoodListType.POPULAR_FOOD} horizon={false} />
            default:
                console.log('Unsupported item type')
        }
    }

    const [itemList, setItemList] = useState([
        HomeItem.NEWS,
        HomeItem.LOCATION,
        HomeItem.CATEGORY_LIST,
        HomeItem.FOOD_LIST
    ])

    const extractor = (item: HomeItem, index: number) => `${index}`

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level1Header
                        text="HolaFood"
                        textColor="#d9091f"
                        leftIcons={['search', 'shopping-cart']}
                        leftIconsColor={['#4666a6', '#d14fa6']}
                        leftIconsTarget={['Search', 'Order']} />,
                    headerHeight: Level1HeaderStats.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: { marginHorizontal: 10 },
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
    CATEGORY_LIST,
    FOOD_LIST
}



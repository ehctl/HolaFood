import { useCallback, useEffect, useState } from "react"
import { Level1Header, Level1HeaderStats } from "../../base/Headers/Level1Header"
import { AnimatedHeader } from "../../base/AnimatedHeader"
import React from "react"
import { News } from "./News"
import { Location } from "./Location"
import { HomeFoodList } from "./HomeFoodList"
import { View } from "../../base/View"
import { FoodListType } from "../FoodList/FoodListType"
import { CategoryList } from "./CategoryList"
import { getListAddress } from "../../core/apis/Requests"
import { mapUserAddressFromResponse } from "../Menu/AccountScreen/Address"
import { useDispatch } from "react-redux"
import { setUserAddressList } from "../../redux/Reducer"
import { Constant } from "../../utils/Constant"
import { useToast } from "../../base/Toast"


export const HomeScreen = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch()
    const renderItem = ({ item }: { item: HomeItem }) => {

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

    const [itemList, _] = useState(getListItem())
    const [refresh, setRefresh] = useState(false)
    const extractor = (item: HomeItem, index: number) => `${index + String(refresh)}`
    const showToast = useToast()

    useEffect(() => {
        getListAddress(
            (response) => {
                const data = mapUserAddressFromResponse(response.data)
                dispatch(setUserAddressList(data))
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
            }
        )
    }, [refresh])

    return (
        <View style={{ flex: 1, height: '100%', backgroundColor: 'red', position: 'relative', margin: 0 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level1Header
                        text="HolaFood"
                        textColor="#d9091f"
                        leftIcons={['search', 'shopping-cart']}
                        leftIconsColor={['#4666a6', '#d14fa6']}
                        leftIconsTarget={['Search', 'Cart']} />,
                    headerHeight: Level1HeaderStats.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    style: { marginHorizontal: 10, height: '100%' },
                    contentContainerStyle: { height: '100%' },
                    renderItem: renderItem,
                    data: itemList,
                    keyExtractor: extractor,
                    extraData: refresh
                }}
                onRefresh={() => {
                    setRefresh(!refresh)
                }}
            />
        </View>
    )
})

const getListItem = () => (
    [
        HomeItem.NEWS,
        HomeItem.LOCATION,
        HomeItem.CATEGORY_LIST,
        HomeItem.FOOD_LIST
    ]
)

enum HomeItem {
    NEWS,
    LOCATION,
    CATEGORY_LIST,
    FOOD_LIST
}



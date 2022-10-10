import { useCallback, useState } from "react"
import { Animated, Image, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, FlatList, FlatListProps } from "react-native"
import { FontAwesome } from "../components/FontAwesome"
import { TransparentText as Text } from "../components/Text"
import { TransparentView as View, View as DefaultView } from "../components/View"
import { Dimensions } from 'react-native';
import { HomePageHeader, HomePageHeaderStat } from "../components/Headers/HomePageHeader"
import { AnimatedHeaderScreen } from "./AnimatedHeaderScreen"
import React from "react"
import { VerticalFoodItem } from "./Home/VerticalFoodItem"
import { HelperItem } from "./Home/FoodList"

export const DummbScreen = ({ navigation }: any) => {

    const renderItem = ({ item }: { item: DUMMY_TYPE }) => {

        // draft item in list :~:
        return (
            <VerticalFoodItem {...item} />
        )
    }

    const extractor = useCallback((item: DUMMY_TYPE) => item.id, [])

    return (
        <AnimatedHeaderScreen
            headerProps={{
                header: < HomePageHeader />,
                headerHeight: HomePageHeaderStat.HEADER_MAX_HEIGHT
            }}
            flatListProps={{
                renderItem: renderItem,
                data: DUMMY_DATA,
                keyExtractor: extractor
            }}
        />
    )
}

export const DUMMY_DATA: (DUMMY_TYPE | HelperItem)[] = [
    {
        id: '1',
        title: 'Gà rang muối',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: true,
        isVerified: true,
    },
    {
        id: '2',
        title: 'Gà rang muối 1',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: false,
        isVerified: false,
    },
    {
        id: '3',
        title: 'Gà rang muối 2',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: true,
        isVerified: false,
    },
    {
        id: '4',
        title: 'Gà rang muối 3',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: true,
        isVerified: true,
    },
    {
        id: '5',
        title: 'Gà rang muối 4',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: false,
        isVerified: true,
    },
    {
        id: '6',
        title: 'Gà rang muối 5',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: false,
        isVerified: true,
    },
    {
        id: '7',
        title: 'Gà rang muối 6',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: false,
        isVerified: true,
    },
    {
        id: '8',
        title: 'Gà rang muối 7',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isFavorite: false,
        isVerified: true,
    },
]

export type DUMMY_TYPE = {
    id: string,
    title: string,
    address: string,
    shopName: string,
    isFavorite: boolean,
    isVerified: boolean
}

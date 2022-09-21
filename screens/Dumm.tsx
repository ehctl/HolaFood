import { useCallback, useState } from "react"
import { Animated, Image, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, FlatList, FlatListProps } from "react-native"
import { FontAwesome } from "../components/FontAwesome"
import { Text } from "../components/Text"
import { View } from "../components/View"
import { getStyle, isIosDevice, wait } from "../utils/Utils"
import { Dimensions } from 'react-native';
import { HomePageHeader, HomePageHeaderStat } from "../components/Headers/HomePageHeader"
import { AnimatedHeaderScreen } from "./AnimatedHeaderScreen"
import React from "react"



export const Item = React.memo((item: DUMMY_TYPE) => {
    const windowWidth = Dimensions.get('window').width

    return (
        <View style={{
            flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, marginBottom: 8,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        }}>
            <Image
                source={{
                    uri: 'https://img.freepik.com/premium-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000'
                }}
                style={{ aspectRatio: 1, height: 100 }} />

            <View style={{ height: '100%', width: windowWidth - 165, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline', marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                    <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="shield" size={14} style={{ marginRight: 5 }} color='#97a842' />
                    </View>
                    <Text text="Openning" style={{ color: '#59abcf' }} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="chevron-up" size={14} style={{ marginRight: 5 }} color='#97a842' />
                    </View>
                    <Text text={item.title} numberOfLines={2} ellipsizeMode='tail' style={{ textAlign: 'left', fontWeight: '500', fontSize: 16 }} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="home" size={14} style={{ marginRight: 5 }} color='#422475' />
                    </View>
                    <Text text={item.shopName} numberOfLines={2} style={{ textAlign: 'left', opacity: 0.7 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                    <View style={{ width: 20, alignItems: 'center' }}>
                        <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                    </View>
                    <Text text={item.address} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7 }} />
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                    <View style={{ paddingTop: 15, paddingBottom: 5 }}>
                        <FontAwesome name="android" size={20} color={`${item.isVerified ? 'red' : 'grey'}`} />
                    </View>

                    <View style={{ paddingTop: 15, paddingBottom: 5, marginLeft: 20 }}>
                        <FontAwesome name="id-badge" size={20} color={`${item.isPinned ? 'green' : 'grey'}`} />
                    </View>
                </View>
            </View>
            <View style={{ height: '100%', width: 20, justifyContent: 'center', paddingLeft: 5 }}>
                <FontAwesome name="angle-right" size={30} />
            </View>
        </View>
    )
})

export const DummbScreen = ({ navigation }: any) => {

    const renderItem = ({ item }: { item: DUMMY_TYPE }) => {

        // draft item in list :~:
        return (
            <Item {...item} />
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

export const DUMMY_DATA: DUMMY_TYPE[] = [
    {
        id: '1',
        title: 'Gà rang muối',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: true,
    },
    {
        id: '2',
        title: 'Gà rang muối 1',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: false,
    },
    {
        id: '3',
        title: 'Gà rang muối 2',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: false,
    },
    {
        id: '4',
        title: 'Gà rang muối 3',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: true,
    },
    {
        id: '5',
        title: 'Gà rang muối 4',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '6',
        title: 'Gà rang muối 5',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '7',
        title: 'Gà rang muối 6',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '8',
        title: 'Gà rang muối 7',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
]

export type DUMMY_TYPE = {
    id: string,
    title: string,
    address: string,
    shopName: string,
    isPinned: boolean,
    isVerified: boolean
}

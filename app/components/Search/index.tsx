import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GroupStackParamList } from "../../navigation/StackGroup";
import { RouteProp } from "@react-navigation/core"
import { TransparentView, View } from "../../base/View";
import { I18NText, Text } from "../../base/Text";
import { FlatList } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray, wait } from "../../utils/Utils";
import { ActivityIndicator, NativeSyntheticEvent, Pressable, RefreshControl, TextInputEndEditingEventData } from "react-native";
import { FontAwesome, FontAwesome1 } from "../../base/FontAwesome";
import { TextInput } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { style } from "./style/index.css";
import { getSearchResult } from "../../core/apis/Requests";
import { FoodDetailData } from "../FoodDetail/FoodDetailScreen";
import { ShopData } from "../ShopDetail/ShopInfo.tsx";
import { FoodItem as HomeFoodItem } from "../Home/FoodItem";
import { ShopItem as SearchShopItem } from "./ShopItem";
import { useLanguage } from "../../base/Themed";


export const SearchScreen = React.memo((props: SearchScreenProp) => {
    const [searchData, setSearchData] = useState<SearchData[]>([])
    const [listRecentSearch, setListRecentSearch] = useState<SearchData[]>([])
    const [loading, setLoading] = useState(false);
    const [showRecentSearch, setShowRecentSearch] = useState(!props.route?.params?.keyword);
    const [abortController, setAbortController] = useState<AbortController>(null)
    const [searchText, setSearchText] = useState('')
    const [pageIndex, setPageIndex] = useState(0)

    const [reachEndList, setReachEndList] = useState(false)

    const I18NSearch = useLanguage('Search')

    const fetchSearches = useCallback(async () => {
        setListRecentSearch(await getRecentSearch())
        setSearchData(await getRecentSearch())
        // await AsyncStorage.clear()
    }, [])

    useEffect(() => {
        // const clear = async () => {
        //     await AsyncStorage.clear()
        // }

        // clear()

        return () => {
            abortController?.abort()
        }
    }, [])

    useEffect(() => {
        if (props.route?.params?.keyword) {
            searchTextChange(props.route?.params?.keyword, 0)
        } else {
            fetchSearches()
        }
    }, [props.route?.params?.keyword])

    const removeRecentSearch = async () => {
        try {
            const searchArr = await getRecentSearch()
            setSearchData(searchArr)
            setListRecentSearch(searchArr)
        } catch (e) {
            console.log(e)
        }
    }

    const itemOnClick = (text: string) => {
        if (showRecentSearch)
            searchTextChange(text, 0)
    }

    const renderItem = ({ item, index }: any) => {
        return <SearchItem index={index} removeRecentSearchOnClick={removeRecentSearch} itemOnClick={itemOnClick}  {...item} />
    }

    const getFooter = useCallback(() => {
        return (
            searchData.length == 0 && !loading ?
                <I18NText text="No Result" /> : null
        )
    }, [searchData])

    const searchTextChange = useCallback(async (text: string, newPageIndex: number) => {
        setSearchText(text)
        abortController?.abort()
        const newAbortController = new AbortController()
        setAbortController(newAbortController)
        const prevSearchData = [...searchData]

        if (newPageIndex == 0 && (reachEndList || pageIndex != 0)) {
            setReachEndList(false)
            setPageIndex(0)
        }

        setLoading(true)

        if (text.length > 0) {
            setShowRecentSearch(false)
            if (newPageIndex == 0)
                setSearchData([])

            getSearchResult(
                text,
                newPageIndex,
                (response) => {
                    const shopList = response.shop.map((item) => ({
                        id: Math.floor(Math.random() * 1000),
                        data: item,
                        type: "shop_item",
                    }))
                    const foodList = response.product.map((item) => ({
                        id: Math.floor(Math.random() * 1000),
                        data: item,
                        type: "food_item",
                    }))

                    const shuffledList = shuffleArray([...shopList, ...foodList])

                    if (shopList.length < 5 && foodList.length < 5)
                        setReachEndList(true)

                    setSearchData(newPageIndex == 0 ? shuffledList : [...prevSearchData, ...shuffledList])
                    setLoading(false)
                },
                (e) => {
                    console.log(e)
                    setLoading(false)
                },
                newAbortController
            )
        } else {
            setLoading(false)
            setShowRecentSearch(true)
            setSearchData(await getRecentSearch())
        }
    }, [listRecentSearch, showRecentSearch, abortController, reachEndList, pageIndex, searchData])

    const saveRecentSearch = useCallback(async (text: string) => {
        if (text.length > 0) {
            const recentSearches = await AsyncStorage.getItem("recentSearches")
            var arr = [{ id: "0", text: text }] as SavedKeywordType[]

            if (recentSearches) {
                arr = JSON.parse(recentSearches) as SavedKeywordType[]
                arr.unshift({ id: `${arr.length}`, text: text })
            }
            setListRecentSearch(mapSavedKWtoSearch(arr))
            await AsyncStorage.setItem("recentSearches", JSON.stringify(arr))
        }
    }, [listRecentSearch])

    const getRecentSearch = useCallback(async (): Promise<SearchData[]> => {
        const recentSearches = await AsyncStorage.getItem("recentSearches")
        return mapSavedKWtoSearch(JSON.parse(recentSearches) as SavedKeywordType[])
    }, [listRecentSearch])


    return (
        <View style={style.defaultView}>
            <View style={style.container}>
                <Pressable style={style.backButton} onPress={() => props.navigation.goBack()} >
                    <FontAwesome name="angle-left" size={30} />
                </Pressable>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#c0c6cf', flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 15, marginVertical: 5 }}>
                    <TextInput
                        style={{ fontSize: 18, flexGrow: 1, flexShrink: 1 }}
                        placeholder={I18NSearch}
                        value={searchText}
                        onChangeText={(v) => searchTextChange(v, 0)}
                        numberOfLines={1}
                        autoFocus={true}
                        keyboardType="web-search"
                        onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => saveRecentSearch(e.nativeEvent.text)} />
                    {
                        searchText.length > 0 ?
                            <Pressable onPress={() => searchTextChange('', 0)} style={{ paddingVertical: 10, paddingLeft: 10 }}>
                                < FontAwesome1 name="close" size={20} />
                            </Pressable>
                            : null
                    }
                </View>
            </View>
            <I18NText text={showRecentSearch ? "Recent Search" : "Search Result"} style={style.searchTitle} />
            {loading ? <ActivityIndicator animating={true} /> : null}
            <FlatList
                contentContainerStyle={{ marginHorizontal: 10, paddingBottom: 30 }}
                data={searchData}
                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyExtractor={(_, index) => `${index}`}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!reachEndList && !loading) {
                        searchTextChange(searchText, pageIndex + 1)
                        setPageIndex(pageIndex + 1)
                    }
                }}
                ListFooterComponent={() => getFooter()} />
        </View>
    )
})

const SearchItem = React.memo((props: SearchData) => {
    const removeRecentSearch = async () => {
        const recentSearches = await AsyncStorage.getItem("recentSearches")
        var searchArr = JSON.parse(recentSearches) as SavedKeywordType[]
        searchArr.splice(props.index, 1)
        await AsyncStorage.setItem("recentSearches", JSON.stringify(searchArr))

        props.removeRecentSearchOnClick()
    }

    const searchItemOnClick = async () => {
        props.itemOnClick(props.type == "food_item" ?
            (props.data as FoodDetailData).productName
            :
            (
                props.type == "shop_item" ?
                    (props.data as ShopData).shopName :
                    props.data as string
            )
        )

        const recentSearches = await AsyncStorage.getItem("recentSearches")
        var searchArr = JSON.parse(recentSearches) as SavedKeywordType[]
        const currentItem = searchArr.splice(props.index, 1)
        searchArr.unshift(currentItem[0])
        await AsyncStorage.setItem("recentSearches", JSON.stringify(searchArr))
    }

    return (
        <TransparentView>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 30, paddingVertical: 5, flexGrow: 1, flexShrink: 1 }}
                    onPress={() => { searchItemOnClick() }}>

                    {
                        props.type == "food_item" ?
                            <FoodItem {...props.data as FoodDetailData} />
                            :
                            (
                                props.type == "shop_item" ?
                                    <ShopItem {...props.data as ShopData} /> :
                                    <Text text={props.data as string} style={{ textAlign: 'left', fontSize: 18, padding: 5 }} />
                            )
                    }
                </Pressable>
                {
                    props.type == 'recent_search' ?
                        <FontAwesome1
                            name="close" style={{ padding: 10 }} size={18}
                            onPress={() => removeRecentSearch()} /> : null

                }
            </TransparentView>
            <View style={{ backgroundColor: 'grey', height: 1 }} />
        </TransparentView>
    )
})

const FoodItem = React.memo((props: FoodDetailData) => {
    return (
        <TransparentView style={{ flex: 1 }}>
            <HomeFoodItem data={props} hideDivider={true} />
        </TransparentView>
    )
})

const ShopItem = React.memo((props: ShopData) => {
    return (
        <TransparentView style={{ flex: 1 }}>
            <SearchShopItem data={props} hideDivider={true} />
        </TransparentView>
    )
})

export interface SearchScreenProp {
    navigation: NativeStackNavigationProp<GroupStackParamList, "Search">;
    route: RouteProp<GroupStackParamList, "Search">
}


type SearchData = {
    id: string,
    data: FoodDetailData | ShopData | string,
    type: "shop_item" | "food_item" | "recent_search",
    index?: number,
    removeRecentSearchOnClick?: () => void,
    itemOnClick?: (text: string) => void
}

type SavedKeywordType = {
    id: string,
    text: string
}

const mapSavedKWtoSearch = (arr: SavedKeywordType[]): SearchData[] => {
    return arr ? arr.map((item) => ({
        id: (Math.random() * 100).toString(),
        data: item.text,
        type: 'recent_search'
    })) : []
}


import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GroupStackParamList } from "../../navigation/StackGroup";
import { RouteProp } from "@react-navigation/core"
import { TransparentView, View } from "../../base/View";
import { Text } from "../../base/Text";
import { FlatList } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef, useState } from "react";
import { wait } from "../../utils/Utils";
import { ActivityIndicator, NativeSyntheticEvent, Pressable, RefreshControl, TextInputEndEditingEventData } from "react-native";
import { FontAwesome, FontAwesome1 } from "../../base/FontAwesome";
import { TextInput } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { style } from "./style/index.css";
import { getSearchResult } from "../../core/apis/requests";

export const SearchScreen = React.memo((props: SearchScreenProp) => {
    const [searchData, setSearchData] = useState<SearchData[]>([])
    const [listRecentSearch, setListRecentSearch] = useState<SearchData[]>([])
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRecentSearch, setShowRecentSearch] = useState(true);
    const [abortController, setAbortController] = useState<AbortController>(null)
    const [searchText, setSearchText] = useState('') 

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        const fetchSearches = async () => {
            setListRecentSearch(await getRecentSearch())
            setSearchData(await getRecentSearch())
            // await AsyncStorage.clear()
        }

        fetchSearches()
    }, [])

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
        searchTextChange(text)
    }

    const renderItem = ({ item, index }: any) => {
        return <SearchItem index={index} removeRecentSearchOnClick={removeRecentSearch} itemOnClick={itemOnClick}  {...item} />
    }

    const getFooter = () => {
        return (
            searchData.length == 0 && !loading ?
                <Text text="List Empty" /> : null
        )
    }

    const searchTextChange = useCallback(async (text: string) => {
        setSearchText(text)
        abortController?.abort()
        const newAbortController = new AbortController()
        setAbortController(newAbortController)

        if (text.length > 0) {
            setShowRecentSearch(false)
            setLoading(true)
            setSearchData([])

            getSearchResult(
                text,
                (response) => {
                    const data = response.data
                    const result = data.filter(item => item.title.toLowerCase().includes(text.toLowerCase()))
                    setSearchData(result)
                    setLoading(false)
                },
                (e) => {
                    console.log(e)
                },
                newAbortController
            )
        } else {
            setLoading(false)
            setShowRecentSearch(true)
            setSearchData(await getRecentSearch())
        }

    }, [listRecentSearch, showRecentSearch])

    const saveRecentSearch = useCallback(async (text: string) => {
        if (text.length > 0) {
            const recentSearches = await AsyncStorage.getItem("recentSearches")
            var arr = [{ id: "0", title: text }]

            if (recentSearches) {
                arr = JSON.parse(recentSearches) as SearchData[]
                arr.unshift({ id: `${arr.length}`, title: text })
            }
            setListRecentSearch(arr as SearchData[])
            await AsyncStorage.setItem("recentSearches", JSON.stringify(arr))
        }
    }, [listRecentSearch])

    const getRecentSearch = useCallback(async (): Promise<SearchData[]> => {
        const recentSearches = await AsyncStorage.getItem("recentSearches")
        return JSON.parse(recentSearches) as SearchData[]
    }, [listRecentSearch])


    return (
        <View style={style.defaultView}>
            <View style={style.container}>
                <Pressable style={style.backButton} onPress={() => props.navigation.goBack()} >
                    <FontAwesome name="angle-left" size={30} />
                </Pressable>
                <TextInput
                    style={{ backgroundColor: '#c0c6cf', flex: 1, paddingVertical: 10, fontSize: 18, borderRadius: 10, paddingHorizontal: 15, marginVertical: 5 }}
                    placeholder="Search"
                    value={searchText}
                    onChangeText={searchTextChange}
                    numberOfLines={1}
                    autoFocus={true}
                    keyboardType="web-search"
                    onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => saveRecentSearch(e.nativeEvent.text)} />
            </View>
            <Text text={showRecentSearch ? "Recent searches" : "Search results"} style={style.searchTitle} />
            {loading ? <ActivityIndicator animating={true} /> : null}
            <FlatList
                contentContainerStyle={{ marginHorizontal: 10 }}
                data={searchData}
                renderItem={renderItem}
                keyExtractor={(_, index) => `${index}`}
                ListFooterComponent={() => getFooter()} />
        </View>
    )
})

const SearchItem = React.memo((props: SearchData) => {
    const removeRecentSearch = async () => {
        const recentSearches = await AsyncStorage.getItem("recentSearches")
        var searchArr = JSON.parse(recentSearches) as SearchData[]
        searchArr.splice(props.index, 1)
        await AsyncStorage.setItem("recentSearches", JSON.stringify(searchArr))

        props.removeRecentSearchOnClick()
    }

    const searchItemOnClick = async () => {
        const recentSearches = await AsyncStorage.getItem("recentSearches")
        var searchArr = JSON.parse(recentSearches) as SearchData[]
        const currentItem = searchArr.splice(props.index, 1)
        searchArr.unshift(currentItem[0])
        await AsyncStorage.setItem("recentSearches", JSON.stringify(searchArr))

        props.itemOnClick(props.title)
    }

    return (
        <TransparentView>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable
                    style={{ alignSelf: 'flex-start', paddingRight: 30, paddingVertical: 10 }}
                    onPress={() => { searchItemOnClick() }}>

                    <Text text={props.title} style={{ textAlign: 'left', fontSize: 18 }} />
                    {
                        props.type == "search_item" ?
                            <Text text={props.shopName} style={{ textAlign: 'left' }} /> : null
                    }
                    {
                        props.type == "search_item" ?
                            <Text text={props.description} style={{ textAlign: 'left' }} /> : null
                    }
                </Pressable>
                <FontAwesome1
                    name="close" style={{ padding: 10 }} size={18}
                    onPress={() => removeRecentSearch()} />
            </TransparentView>
            <View style={{ backgroundColor: 'grey', height: 1 }} />
        </TransparentView>
    )
})


export interface SearchScreenProp {
    navigation: NativeStackNavigationProp<GroupStackParamList, "Search">;
    route: RouteProp<GroupStackParamList, "Search">
}


type SearchData = {
    id: string,
    type: "search_item" | "recent_search"
    title: string,
    shopName: string,
    description: string,
    index: number,
    removeRecentSearchOnClick: () => void
    itemOnClick: (text: string) => void
}


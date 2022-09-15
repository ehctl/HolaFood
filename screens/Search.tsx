import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GroupStackParamList } from "../navigation/StackGroup";
import { RouteProp } from '@react-navigation/core'
import { View } from "../components/View";
import { Text } from "../components/Text";
import { FlatList } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import { getStyle, wait } from "../Utils/Utils";
import { ActivityIndicator, NativeSyntheticEvent, Pressable, RefreshControl, TextInputEndEditingEventData } from "react-native";
import { StyleSheet } from "react-native"
import { FontAwesome } from "../components/FontAwesome";
import { TextInput } from "../components/TextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SearchScreen = (props: SearchScreenProp) => {
    const [searchData, setSearchData] = useState<SearchData[]>([])
    const [listRecentSearch, setListRecentSearch] = useState<SearchData[]>([])
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRecentSearch, setShowRecentSearch] = useState(true);

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

    const renderItem = ({ item }: any) => {
        return <SearchItem {...item} />
    }

    const searchTextChange = async (text: string) => {
        if (text.length > 0) {
            setShowRecentSearch(false)
            const result = dummyData.filter(item => item.title.toLowerCase().includes(text.toLowerCase()))
            setLoading(true)
            setSearchData([])
            // dang bi bug await :d 
            await wait(2000)
            setSearchData(result)
            setLoading(false)
        } else {
            console.log(listRecentSearch)
            setShowRecentSearch(true)
            setSearchData(listRecentSearch)
        }
    }

    const saveRecentSearch = async (text: string) => {
        if (text.length > 0) {
            const recentSearches = await AsyncStorage.getItem('recentSearches')
            var arr = [{ id: '0', title: text }]
            setListRecentSearch({ ...arr as SearchData[], ...listRecentSearch })

            if (recentSearches) {
                arr = JSON.parse(recentSearches) as SearchData[]
                arr.unshift({ id: `${arr.length}`, title: text })
            }
            await AsyncStorage.setItem('recentSearches', JSON.stringify(arr))
        }
    }

    const getRecentSearch = async (): Promise<SearchData[]> => {
        const recentSearches = await AsyncStorage.getItem('recentSearches')
        return JSON.parse(recentSearches) as SearchData[]
    }


    return (
        <View style={getStyle().defaultView}>
            <View style={style.container}>
                <Pressable style={{ paddingHorizontal: 10 }} onPress={() => props.navigation.goBack()} >
                    <FontAwesome name="angle-left" size={30} />
                </Pressable>
                <TextInput
                    style={{ flex: 1, fontSize: 20, padding: 5 }}
                    placeholder='mlem mlem'
                    onChangeText={searchTextChange}
                    numberOfLines={1}
                    keyboardType='web-search'
                    onEndEditing={(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => saveRecentSearch(e.nativeEvent.text)} />
            </View>
            <Text text={showRecentSearch ? 'Recent searches' : 'Search results'} style={{ textAlign: 'left', marginLeft: 10, marginTop: 10, fontSize: 24 }} />
            {loading ? <ActivityIndicator animating={true} /> : null}
            <FlatList
                data={searchData}
                renderItem={renderItem}
                keyExtractor={item => item.id} />
        </View>
    )
}

const SearchItem = (props: SearchData) => {
    return (
        <View>
            <Text text={props.title} />
            {
                props.type == 'search_item' ?
                    <Text text={props.shopName} /> : null
            }
            {
                props.type == 'search_item' ?
                    <Text text={props.description} /> : null
            }
            <View style={{ height: 1, marginTop: 5, marginHorizontal: 10, backgroundColor: 'black' }} />
        </View>
    )
}


export interface SearchScreenProp {
    navigation: NativeStackNavigationProp<GroupStackParamList, 'Search'>;
    route: RouteProp<GroupStackParamList, 'Search'>
}


type SearchData = {
    id: string,
    type: 'search_item' | 'recent_search'
    title: string,
    shopName: string,
    description: string
}

const dummyData: SearchData[] = [
    {
        id: '1',
        type: 'search_item',
        title: 'adfsadfasdfdsf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '2',
        type: 'search_item',
        title: 'asdfasdfasdfa',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '3',
        type: 'search_item',
        title: 'adfasdfasfsdfs',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '4',
        type: 'search_item',
        title: 'asdfafsaf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '5',
        type: 'search_item',
        title: 'adfadfasf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '6',
        type: 'search_item',
        title: 'asdfafsfsdf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '7',
        type: 'search_item',
        title: 'asfsdfasdfa',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '8',
        type: 'search_item',
        title: 'adsfasdfasf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '9',
        type: 'search_item',
        title: 'asdfadfasf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
    {
        id: '10',
        type: 'search_item',
        title: 'asdfasdf',
        shopName: 'dafsdfaf',
        description: 'dafsdfasf'
    },
]

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    }
})
import React, { useCallback, useEffect, useState } from "react"
import { TransparentView } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import { ListRenderItemInfo, Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { getFoodCategory } from "../../../core/apis/Requests"
import { CategoryListShimmer } from "./CategoryListShimmer/CategoryListShimmer"
import { AppState, setStateListCategory } from "../../../redux/Reducer"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { Image } from "../../../base/Image"
import { useToast } from "../../../base/Toast"
import { Constant } from "../../../utils/Constant"
import { FlatList } from "react-native-gesture-handler"
import { CategoryItemProps } from "../../FoodList/CategoryList"


export const CategoryList = React.memo(() => {
    const dispatch = useDispatch()
    const stateProps = useSelector((state: AppState) => ({
        categoryList: state.categoryList
    }))
    const [loading, setLoading] = useState(false)
    const showToast = useToast()
    const [customizeList, setCustomizeList] = useState<CategoryData[][]>([])


    const fetchData = useCallback(() => {
        setLoading(true)
        dispatch(setStateListCategory([]))
        getFoodCategory(
            (response) => {
                const data = response.data
                dispatch(setStateListCategory(data ?? []))
                setLoading(false)
            },
            (e) => {
                showToast(Constant.API_ERROR_OCCURRED)
                console.log(e)
                setLoading(false)
            }
        )
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const size = 2
        const originArr = [...stateProps.categoryList]
        const arr = []

        while (originArr.length > 0)
            arr.push(originArr.splice(0, size));

            setCustomizeList(arr)
    }, [stateProps.categoryList])

    const renderItem = ({ item, index }: ListRenderItemInfo<CategoryData[]>) => {
        return <HomeCategoryColumn items={item} />
    }

    const extractor = (_: CategoryData[], index: number) => `home_category_item_${index}`

    return (
        <TransparentView style={{ marginTop: 20 }}>
            <I18NText
                style={{ textAlign: 'left', fontWeight: '600', fontSize: 20, marginRight: 20 }}
                text='Food Category' />

            <CategoryListShimmer visible={loading} />

            <FlatList
                contentContainerStyle={{ paddingVertical: 10, borderRadius: 10 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={extractor}
                data={customizeList}
            />

        </TransparentView>
    )
})

export const HomeCategoryColumn = React.memo((props: HomeCategoryItemProps) => {

    return (
        <TransparentView style={{}}>
            <HomeCategoryItem
                id={props.items[0].id}
                usedOnHomePage={true}
                key={'home_category_item_' + props.items[0].id}
                name={props.items[0].name}
                iconSource={props.items[0].imageCategory}
            />

            {
                props.items.length > 1 ?
                    <HomeCategoryItem
                        id={props.items[1].id}
                        usedOnHomePage={true}
                        key={'home_category_item_' + props.items[1].id}
                        name={props.items[1].name}
                        iconSource={props.items[1].imageCategory}
                    />
                    : null
            }
        </TransparentView>
    )
})

export const HomeCategoryItem = React.memo((props: CategoryItemProps) => {
    const navigation = useNavigation()
    return (
        <Pressable
            style={
                [
                    {
                        marginHorizontal: 5, marginVertical: 5, justifyContent: 'center', alignItems: 'center'
                    },
                    props.style
                ]
            }
            onPress={() => {
                props.onPress?.()
                props.usedOnHomePage ? navigation.navigate('FoodList' as never, { type: props.id } as never) : null
            }}
            onLayout={(e) => { props?.onLayout?.(e) }} >

            {
                props.iconSource != null ?
                    <Image
                        resizeMode="cover"
                        source={{
                            uri: props.iconSource
                        }}
                        style={{ width: 70, height: 70, borderRadius: 10, marginRight: 10 }} />
                    : null
            }
            <Text text={props.name} style={{fontWeight: '500', marginTop: 10, fontSize: 16}}/>
        </Pressable>
    )
})

export type HomeCategoryItemProps = {
    items: CategoryData[]
}

export type CategoryData = {
    id: number,
    name: string,
    imageCategory: string
}
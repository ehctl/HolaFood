import React, { useCallback, useEffect, useState } from "react"
import { TransparentView } from "../../../base/View"
import { BText, I18NText, Text } from "../../../base/Text"
import { Image as DefaultView, LayoutChangeEvent, Pressable } from "react-native"
import { ImageSourcePropType } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { getFoodCategory } from "../../../core/apis/Requests"
import { CategoryListShimmer } from "./CategoryListShimmer/CategoryListShimmer"
import { AppState, setStateListCategory } from "../../../redux/Reducer"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { mapFoodDetailDataFromRequest } from "../../FoodDetail/FoodDetailScreen"
import { Image } from "../../../base/Image"


export const CategoryList = React.memo(() => {
    const dispatch = useDispatch()
    const stateProps = useSelector((state: AppState) => ({
        categoryList: state.categoryList
    }))
    const [loading, setLoading] = useState(false)

    const fetchData = useCallback(() => {
        setLoading(true)
        dispatch(setStateListCategory([]))
        getFoodCategory(
            (response) => {
                const data = response.data
                dispatch(setStateListCategory(data))
                setLoading(false)
            },
            (e) => {
                setLoading(false)
                console.log(e)
            }
        )
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <TransparentView style={{ marginTop: 20 }}>
            <I18NText
                style={{ textAlign: 'left', fontWeight: '600', fontSize: 20, marginRight: 20 }}
                text='Food Category' />

            <CategoryListShimmer visible={loading} />

            <TransparentView style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    stateProps.categoryList.map((item, index) => (
                        <CategoryItem
                            id={item.id}
                            usedOnHomePage={true}
                            key={index}
                            name={item.name}
                            iconSource={item.imageCategory} />
                    ))
                }
            </TransparentView>
        </TransparentView>
    )
})

export const CategoryItem = React.memo((props: CategoryItemProps) => {
    const navigation = useNavigation()
    return (
        <Pressable
            style={
                [{ height: 40, marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#c0c6cf', borderRadius: 25, marginVertical: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
                props.style]
            }
            onPress={() => {
                props.onPress?.()
                props.usedOnHomePage ? navigation.navigate('FoodList' as never, { type: props.id } as never) : null
            }}
            onLayout={(e) => { props?.onLayout?.(e) }} >

            {
                props.iconSource != null ?
                    <Image
                        resizeMode="center"
                        source={{
                            uri: props.iconSource
                        }}
                        style={{ width: 25, height: 25, borderRadius: 10, marginRight: 10 }} />
                    : null
            }
            <BText text={props.name} />
        </Pressable>
    )
})

export type CategoryItemProps = {
    id: number,
    name: string,
    usedOnHomePage?: boolean,
    iconSource: string,
    style?: DefaultView['props']['style'],
    onPress?: () => void,
    onLayout?: (event: LayoutChangeEvent) => void
}

export type CategoryData = {
    id: number,
    name: string,
    imageCategory: string
}
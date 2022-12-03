import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../base/View"
import { I18NText, Text } from "../../base/Text"
import { FoodItem } from "./FoodItem"
import { wait } from "../../utils/Utils"
import { PopupModal } from "../../base/PopupModal"
import { RadioButtonGroup, RadioButton, RadioButtonIcon } from "../../base/RadioGroup"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../base/FontAwesome"
import { FoodItemShimmer } from "./FoodItemShimmer"
import { ListRenderItemInfo, Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { FoodListType, } from "../FoodList/FoodListType"
import { getFoodList } from "../../core/apis/Requests"
import { FoodDetailData, mapFoodDetailDataFromRequest1 } from "../FoodDetail/FoodDetailScreen"
import { PopularFoodItem } from "./FoodItem/PopularFoodItem"
import { Constant } from "../../utils/Constant"
import { useToast } from "../../base/Toast"

export const HomeFoodList = React.memo((props: FoodListProps) => {
    const [loading, setLoading] = useState(false)
    const [listData, setListData] = useState<(FoodDetailData | PopularFoodData)[]>([])
    const [foodListType, setFoodListType] = useState(FoodListType.POPULAR_FOOD)
    const popupModalRef = useRef(null)
    const navigation = useNavigation()
    
    const showToast = useToast()

    const fetchData = useCallback(async () => {
        setLoading(true)
        setListData([])
        await wait(2000)

        getFoodList(
            foodListType,
            0,
            (response) => {
                const data = response.data
                if (foodListType == FoodListType.POPULAR_FOOD) {
                    setListData(data.map((i: FoodDetailData) => ({
                        productName: i.productName
                    })))
                } else {
                    setListData(data.map((i) => mapFoodDetailDataFromRequest1(i)))
                }
                setLoading(false)
            },
            (response) => {
                console.log(response)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [foodListType])

    useEffect(() => {
        fetchData()
    }, [foodListType])

    const renderItem = ({ item, index }: ListRenderItemInfo<FoodDetailData | PopularFoodData>) => {
        if (foodListType == FoodListType.POPULAR_FOOD)
            return <PopularFoodItem data={item as PopularFoodData} index={index} />

        return <FoodItem data={item as FoodDetailData} />
    }

    const getFlatlistHeader = () => {
        return (
            <FoodItemShimmer visible={loading} />
        )
    }

    const getFlatListFooter = () => {
        return (
            <Pressable
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}
                onPress={() => navigation.navigate('FoodList' as never, { type: foodListType } as never)}>
                <I18NText text='See More' style={{ fontSize: 16, marginHorizontal: 15 }} />
                <FontAwesome1 name="rightcircleo" size={18} />
            </Pressable>
        )
    }

    const extractor = (item: FoodDetailData, index: number) => `home_list_item_${index}`

    const changeFoodListType = useCallback(async (value: FoodListType) => {
        setListData([])
        setFoodListType(value)
    }, [])

    return (
        <View style={{
            marginVertical: 20,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, }}>
                <I18NText
                    style={{ textAlign: 'left', fontWeight: '600', fontSize: 20, marginRight: 20 }}
                    text={foodListType.toString()} />

                <FontAwesome1
                    name="ellipsis1" size={28}
                    onPress={() =>
                        popupModalRef.current.changeVisibility(true)
                    } />
            </View>

            <PopupModal ref={popupModalRef} title='Food'>
                <RadioButtonGroup
                    selectedColor='#207499'
                    value={foodListType}
                    valueChange={(value: string) => {
                        popupModalRef.current.changeVisibility(false)
                        changeFoodListType(value as FoodListType)
                    }}>

                    <RadioButton value={FoodListType.POPULAR_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="thumbs-up" size={22} color='#207499' />
                            </View>
                            <I18NText text={FoodListType.POPULAR_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>

                    <RadioButton value={FoodListType.NEW_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome1 name="upcircleo" size={22} color='#207499' />
                            </View>
                            <I18NText text={FoodListType.NEW_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>

                    <RadioButton value={FoodListType.FAVORITE_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#c0c6cf', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome2 name="format-list-numbered" size={25} color='#207499' />
                            </View>
                            <I18NText text={FoodListType.FAVORITE_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>
                </RadioButtonGroup>
            </PopupModal>

            <View style={{
                flexDirection: props.type == FoodListType.POPULAR_FOOD ? 'column' : 'row', justifyContent: 'center',
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
                borderTopRightRadius: props.horizon ? 0 : 15,
                borderBottomRightRadius: props.horizon ? 0 : 15
            }}>
                <FlatList
                    contentContainerStyle={{}}
                    style={{}}
                    horizontal={props.horizon}
                    scrollEnabled={props.horizon}
                    showsHorizontalScrollIndicator={false}
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={extractor}
                    ListEmptyComponent={loading ? null : <I18NText text='No Food Right Now, Please Comeback Later' />}
                    ListHeaderComponent={getFlatlistHeader()}
                    ListFooterComponent={getFlatListFooter()}
                    ListFooterComponentStyle={{}} />
            </View>
        </View>
    )
})

type FoodListProps = {
    type: FoodListType,
    horizon: boolean
}

export type PopularFoodData = {
    productName: string,
}

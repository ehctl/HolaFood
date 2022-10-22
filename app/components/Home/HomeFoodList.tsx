import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../base/View"
import { DUMMY_DATA, DUMMY_TYPE } from "./DummyData"
import { Text } from "../../base/Text"
import { FoodItem } from "./FoodItem"
import { wait } from "../../utils/Utils"
import { PopupModal } from "../../base/PopupModal"
import { RadioButtonGroup } from "../../base/RadioGroup/RadioButtonGroup"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../base/FontAwesome"
import { RadioButton, RadioButtonIcon } from "../../base/RadioGroup/RadioButton"
import { FoodItemShimmer } from "./FoodItemShimmer"
import { Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { FoodListType } from "../FoodList/FoodListType"
import { getFoodList } from "../../core/apis/requests"

export const HomeFoodList = React.memo((props: FoodListProps) => {
    const [loading, setLoading] = useState(false)
    const [listData, setListData] = useState<DUMMY_TYPE[]>([])
    const [foodListType, setFoodListType] = useState(FoodListType.POPULAR_FOOD)
    const popupModalRef = useRef(null)
    const navigation = useNavigation()

    const fetchData = useCallback(async () => {
        setLoading(true)
        setListData([])
        await wait(2000)

        getFoodList(
            '123123',
            foodListType,
            0,
            (response) => {
                const data = response.data
                setListData(data)
                setLoading(false)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [foodListType])

    useEffect(() => {
        fetchData()
    }, [foodListType])

    const renderItem = ({ item }: { item: ItemType }) => {
        return <FoodItem {...item} />
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
                onPress={() => navigation.navigate('FoodList' as never)}>
                <Text text='More' style={{ fontSize: 16, marginHorizontal: 15 }} />
                <FontAwesome1 name="rightcircleo" size={18} />
            </Pressable>
        )
    }

    const extractor = (item: DUMMY_TYPE, index: number) => `${index}`

    const changeFoodListType = useCallback(async (value: FoodListType) => {
        setFoodListType(value)
    }, [])

    return (
        <View style={{
            marginVertical: 10, backgroundColor: '#c0c6cf',
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: props.horizon ? 0 : 15,
            borderBottomRightRadius: props.horizon ? 0 : 15
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 5 }}>
                <Text
                    style={{ textAlign: 'left', fontWeight: '600', fontSize: 20 }}
                    text={foodListType.toString()} />

                <FontAwesome1
                    name="ellipsis1" size={28}
                    onPress={() => popupModalRef.current.changeVisibility(true)} />
            </TransparentView>

            <PopupModal ref={popupModalRef} title='Food'>
                <RadioButtonGroup
                    defaultColor='#34838a'
                    value={foodListType}
                    valueChange={(value: string) => {
                        popupModalRef.current.changeVisibility(false)
                        changeFoodListType(value as FoodListType)
                    }}>

                    <RadioButton value={FoodListType.POPULAR_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1,justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="thumbs-o-up" size={22} />
                            </View>
                            <Text text={FoodListType.POPULAR_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>

                    <RadioButton value={FoodListType.FAVORITE_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1,justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome2 name="format-list-numbered" size={25} />
                            </View>
                            <Text text={FoodListType.FAVORITE_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>
                    <RadioButton value={FoodListType.NEW_FOOD} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 1000, padding: 10, width: 50, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome1 name="upcircleo" size={22} />
                            </View>
                            <Text text={FoodListType.NEW_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>
                        <RadioButtonIcon size={5} />
                    </RadioButton>
                    
                </RadioButtonGroup>
            </PopupModal>

            <View style={{ flexDirection: props.type == FoodListType.POPULAR_FOOD ? 'column' : 'row', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <FlatList
                    contentContainerStyle={{}}
                    style={{}}
                    horizontal={props.horizon}
                    scrollEnabled={props.horizon}
                    showsHorizontalScrollIndicator={false}
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={extractor}
                    ListHeaderComponent={getFlatlistHeader()}
                    ListFooterComponent={getFlatListFooter()}
                    ListFooterComponentStyle={{}} />
            </View>
        </View>
    )
})

export type ItemType = DUMMY_TYPE

type FoodListProps = {
    type: FoodListType,
    horizon: boolean
}

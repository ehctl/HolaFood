import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { TransparentView, View } from "../../components/View"
import { DUMMY_DATA, DUMMY_TYPE } from "../Dumm"
import { Text } from "../../components/Text"
import { VerticalFoodItem } from "./VerticalFoodItem"
import { ActivityIndicator } from 'react-native';
import { wait } from "../../utils/Utils"
import { PopupModal } from "../../components/PopupModal"
import { RadioButtonGroup } from "../../components/RadioGroup/RadioButtonGroup"
import { FontAwesome, FontAwesome1, FontAwesome2 } from "../../components/FontAwesome"
import { RadioButton } from "../../components/RadioGroup/RadioButton"

export const FoodList = React.memo((props: FoodListProps) => {
    const [reachListEnd, setReachListEnd] = useState(false)
    const [loadingMore, setLoadingMore] = useState(true)
    const [data, setData] = useState(DUMMY_DATA)
    const [foodListType, setFoodListType] = useState(FoodListType.POPULAR_FOOD)
    const popupModalRef = useRef(null)

    useEffect(() => {
        const timing = async () => {
            // await wait(2000)
            setLoadingMore(false)
        }

        timing()
    }, [])

    const renderItem = ({ item }: { item: ItemType }) => {
        return <VerticalFoodItem {...item} />
    }

    const extractor = (item: DUMMY_TYPE, index: number) => `${index}`

    const getFooter = () => {
        return (
            <TransparentView style={{ margin: 10 }}>
                {
                    loadingMore ?
                        <ActivityIndicator color='orange' /> : null
                }
            </TransparentView>
        )
    }

    const fetchMoreData = useCallback(async () => {
        setLoadingMore(true)
        await wait(5000)
        setData([...data, ...DUMMY_DATA])
        setLoadingMore(false)
    }, [data])

    const changeFoodListType = useCallback(async (value: FoodListType) => {
        setFoodListType(value)
        setLoadingMore(true)
        setData([])
        await wait(5000)
        setData([...data])
        setLoadingMore(false)
    }, [])

    return (
        <View style={{
            marginTop: 10, backgroundColor: 'grey',
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: props.horizon ? 0 : 15,
            borderBottomRightRadius: props.horizon ? 0 : 15
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 5 }}>
                <Text
                    style={{ textAlign: 'left', fontWeight: '600', fontSize: 20 }}
                    text={foodListType} />

                <FontAwesome1
                    name="ellipsis1" size={28}
                    onPress={() => popupModalRef.current.changeVisibility(true)} />
            </TransparentView>
            <PopupModal ref={popupModalRef} >
                <RadioButtonGroup
                    color='#34838a'
                    value={foodListType}
                    valueChange={(value: string) => {
                        popupModalRef.current.changeVisibility(false)
                        changeFoodListType(value as FoodListType)
                    }}>

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 50, padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome2 name="format-list-numbered" size={25} />
                            </View>
                            <Text text={FoodListType.FAVORITE_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>

                        <RadioButton value={FoodListType.FAVORITE_FOOD} />
                    </TransparentView>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 50, padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }}>

                                <FontAwesome1 name="upcircleo" size={22} />
                            </View>
                            <Text text={FoodListType.NEW_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>

                        <RadioButton value={FoodListType.NEW_FOOD} />
                    </TransparentView>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'grey', borderRadius: 50, padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="thumbs-o-up" size={22} />
                            </View>
                            <Text text={FoodListType.POPULAR_FOOD} style={{ fontSize: 18, marginLeft: 15 }} />
                        </TransparentView>

                        <RadioButton value={FoodListType.POPULAR_FOOD} />
                    </TransparentView>
                </RadioButtonGroup>
            </PopupModal>

            <View style={{ flexDirection: props.type == FoodListType.POPULAR_FOOD ? 'column' : 'row', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <FlatList
                    contentContainerStyle={{}}
                    style={{}}
                    horizontal={props.horizon}
                    scrollEnabled={props.horizon}
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        if (!reachListEnd)
                            fetchMoreData()
                    }}
                    keyExtractor={extractor}
                    ListFooterComponent={getFooter()}
                    ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center' }} />
            </View>
        </View>
    )
})

export enum FoodListType {
    FAVORITE_FOOD = 'Favorite Food',
    NEW_FOOD = 'New Food',
    POPULAR_FOOD = 'Popular Food'
}

export type ItemType = DUMMY_TYPE

type FoodListProps = {
    type: FoodListType,
    horizon: boolean
}

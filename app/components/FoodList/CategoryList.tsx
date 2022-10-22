import { ScrollView } from "react-native-gesture-handler"
import { Text } from "../../base/Text"
import { Pressable } from "react-native"
import React from "react"
import { FoodListScreenContext, FoodListType } from "./FoodListType"

export const CategoryList = React.memo(() => {
    return (
        <FoodListScreenContext.Consumer>
            {({ foodListType, changeFoodListType }) => (
                <ScrollView
                    horizontal={true}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ borderRadius: 15 }} >
                    {
                        Object.values(FoodListType).map((value: string, index: number) => (
                            <Pressable 
                                key={index}
                                style={{
                                    borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginRight: 10,
                                    backgroundColor: foodListType == value ? '#47bac4' : '#dad7de'
                                }}
                                onPress={() => {
                                    changeFoodListType(value as FoodListType)
                                }}>
                                <Text text={value} />
                            </Pressable>
                        ))
                    }
                </ScrollView>
            )}
        </FoodListScreenContext.Consumer>
    )
})


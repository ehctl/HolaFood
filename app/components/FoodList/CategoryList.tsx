import { ScrollView } from "react-native-gesture-handler"
import React, { useContext, useEffect, useRef, useState } from "react"
import { FoodListScreenContext, FoodListType } from "./FoodListType"
import { CategoryItem } from "../Home/CategoryList"
import { getListCategory, getListIcon } from "../Home/CategoryList"


export const CategoryList = React.memo(() => {
    const iconList = useRef(getListIcon()).current
    const [dataSourceCords, setDataSourceCords] = useState({});
    const scrollViewRef = useRef<ScrollView>(null)
    const { foodListType, changeFoodListType } = useContext(FoodListScreenContext)


    useEffect(() => {
        if (Object.keys(dataSourceCords).length == Object.keys(FoodListType).length + getListCategory().length) {
            scrollViewRef.current.scrollTo({
                x: dataSourceCords[foodListType] - 10,
                animated: true
            })
        }
    }, [dataSourceCords])

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} >
            {
                Object.values(FoodListType).map((value: string, index: number) => (
                    <CategoryItem
                        key={index}
                        name={value}
                        iconSource={null}
                        style={{
                            backgroundColor: foodListType == value ? '#47bac4' : '#dad7de'
                        }}
                        onPress={() => {
                            scrollViewRef.current.scrollTo({
                                x: dataSourceCords[value] - 10,
                                animated: true
                            })
                            changeFoodListType(value)
                        }}
                        onLayout={(event) => {
                            dataSourceCords[value] = event.nativeEvent.layout.x;
                            setDataSourceCords({...dataSourceCords});
                        }} />
                ))
            }

            {
                getListCategory().map((item, index) => (
                    <CategoryItem
                        key={index + Object.values(FoodListType).length}
                        name={item.name}
                        iconSource={iconList[index]}
                        style={{
                            backgroundColor: foodListType == item.name ? '#47bac4' : '#dad7de'
                        }}
                        onPress={() => {
                            scrollViewRef.current.scrollTo({
                                x: dataSourceCords[item.name] - 10,
                                animated: true
                            })
                            changeFoodListType(item.name)
                        }}
                        onLayout={(event) => {
                            dataSourceCords[item.name] = event.nativeEvent.layout.x;
                            setDataSourceCords({...dataSourceCords});
                        }} />
                ))
            }
        </ScrollView>
    )
})



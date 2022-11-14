import { ScrollView } from "react-native-gesture-handler"
import React, { useContext, useEffect, useRef, useState } from "react"
import { FoodListScreenContext, FoodListType } from "./FoodListType"
import { CategoryItem } from "../Home/CategoryList"
import { useSelector } from "react-redux"
import { AppState } from "../../redux/Reducer"


export const CategoryList = React.memo(() => {
    const stateProps = useSelector((state: AppState) => ({
        categoryList: state.categoryList
    }))
    const [dataSourceCords, setDataSourceCords] = useState({});
    const scrollViewRef = useRef<ScrollView>(null)
    const { foodListType, changeFoodListType } = useContext(FoodListScreenContext)


    useEffect(() => {
        if (Object.keys(dataSourceCords).length == Object.keys(FoodListType).length + stateProps.categoryList.length) {
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
                        id={index}
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
                stateProps.categoryList.map((item, index) => (
                    <CategoryItem
                        id={item.id}
                        key={index + Object.values(FoodListType).length}
                        name={item.name}
                        iconSource={null}
                        style={{
                            backgroundColor: foodListType == item.id ? '#47bac4' : '#dad7de'
                        }}
                        onPress={() => {
                            scrollViewRef.current.scrollTo({
                                x: dataSourceCords[item.id] - 10,
                                animated: true
                            })
                            changeFoodListType(item.id)
                        }}
                        onLayout={(event) => {
                            dataSourceCords[item.id] = event.nativeEvent.layout.x;
                            setDataSourceCords({...dataSourceCords});
                        }} />
                ))
            }
        </ScrollView>
    )
})



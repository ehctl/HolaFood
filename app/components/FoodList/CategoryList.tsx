import { ScrollView } from "react-native-gesture-handler"
import React, { useContext, useEffect, useRef, useState } from "react"
import { FoodListScreenContext, FoodListType } from "./FoodListType"
import { useSelector } from "react-redux"
import { AppState } from "../../redux/Reducer"
import { Image } from "../../base/Image"
import { BText } from "../../base/Text"
import { LayoutChangeEvent, Pressable } from "react-native"
import { View as DefaultView} from 'react-native'
import { useNavigation } from '@react-navigation/native';


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
                        iconSource={item.imageCategory}
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

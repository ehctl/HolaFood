import React, { useRef } from "react"
import { TransparentView, View } from "../../../base/View"
import { I18NText, Text } from "../../../base/Text"
import { FlatList } from "react-native-gesture-handler"
import { FontAwesome } from "../../../base/FontAwesome"
import { Image } from "../../../base/Image"
import { Image as DefaultView, LayoutChangeEvent, Pressable } from "react-native"
import { ImageSourcePropType } from "react-native"
import { useNavigation } from '@react-navigation/native';

export const CategoryList = React.memo(() => {
    const iconList = useRef(getListIcon()).current


    return (
        <TransparentView style={{ marginTop: 20 }}>
            <I18NText
                style={{ textAlign: 'left', fontWeight: '600', fontSize: 20, marginRight: 20 }}
                text='Food Category' />

            <TransparentView style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    getListCategory().map((item, index) => (
                        <CategoryItem
                            usedOnHomePage={true}
                            key={index} {...item}
                            iconSource={iconList[index]}
                            onPress={() => {

                            }} />
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
                props?.onPress()
                props.usedOnHomePage ? navigation.navigate('FoodList' as never, { type: props.name } as never) : null
            }}
            onLayout={(e) => {props?.onLayout?.(e)}} >

            {
                props.iconSource != null ?
                    <Image
                        resizeMode="center"
                        source={props.iconSource}
                        style={{ width: 25, height: 25, borderRadius: 10, marginRight: 10 }} />
                    : null
            }
            <Text text={props.name} />
        </Pressable>
    )
})

export type CategoryItemProps = {
    name: string,
    usedOnHomePage?: boolean,
    iconSource: ImageSourcePropType,
    style?: DefaultView['props']['style'],
    onPress?: () => void,
    onLayout?: (event: LayoutChangeEvent) => void
}

export const getListIcon = () => (
    [
        require('../../../../assets/images/pho.jpg'),
        require('../../../../assets/images/milktea.jpg'),
        require('../../../../assets/images/drink.jpg'),
        require('../../../../assets/images/rice.jpg'),
        require('../../../../assets/images/pho.jpg'),
        require('../../../../assets/images/pho.jpg'),
        require('../../../../assets/images/pho.jpg'),
        require('../../../../assets/images/pho.jpg'),
    ]
)

// dummy
export const getListCategory = () => {
    return [
        {
            "name": "Phở",
        },
        {
            "name": "Trà sữa",
        },
        {
            "name": "Đồ uống",
        },
        {
            "name": "Cơm suất",
        },
        {
            "name": "Hải sản",
        },
        {
            "name": "Bún đậu",
        },
        {
            "name": "Ốc ",
        },
        {
            "name": "Thịt chó",
        },
    ]
}

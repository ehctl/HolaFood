import React from "react";
import { TransparentView, View } from "../../../../base/View";
import { PopularFoodData } from "../../HomeFoodList";
import { BText, Text } from "../../../../base/Text";
import { Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircle } from "../../../../base/AnimatedCircle";
import { Image } from "../../../../base/Image";


export const PopularFoodItem = React.memo((props: PopularFoodItemProps) => {
    const navigation = useNavigation()

    return (
        <Pressable
            onPress={() => {
                navigation.navigate('Search' as never, { keyword: props.data.productName } as never)
            }}
            style={{ flex: 1 }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative' }}>
                {/* <AnimatedCircle
                        size={4}
                        color={getColorList()[props.index]} >

                        <Text text={(props.index + 1).toString()} style={{ fontSize: 14, fontWeight: '500' }} />
                    </AnimatedCircle> */}
                <Text text={(props.index + 1).toString() + '.'} style={{fontWeight: '500', fontSize: 18}}/>

                <Text
                    text={props.data.productName}
                    style={{ fontSize: 18, textAlign: 'left', flexGrow: 1, flexShrink: 1, paddingHorizontal: 10, fontWeight: '500' }} />

                <Image
                    resizeMode="cover"
                    source={{
                        uri: props.data.productImageUrl
                    }}
                    style={{ width: 120, height: 120, borderRadius: 10, marginRight: 10, marginVertical: 10 }} />
            </TransparentView>

            <View style={{ height: 1, backgroundColor: 'grey' }} />
        </Pressable>
    )
})

const getColorList = () => ([
    '#f70529',
    '#00829c',
    '#a1a103',
    '#0dba3b',
    '#a405ed',
    '#eda405',
    '#0533ed',
    '#ed05d6',
    '#6ecc02',
    '#05dfe3',
])


export type PopularFoodItemProps = {
    data: PopularFoodData,
    index: number,
} 
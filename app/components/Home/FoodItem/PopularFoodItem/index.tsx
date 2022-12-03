import React from "react";
import { TransparentView, View } from "../../../../base/View";
import { PopularFoodData } from "../../HomeFoodList";
import { BText, Text } from "../../../../base/Text";
import { Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircle } from "../../../../base/AnimatedCircle";


export const PopularFoodItem = React.memo((props: PopularFoodItemProps) => {
    const navigation = useNavigation()

    return (
        <View>
            <Pressable
                onPress={() => {
                    navigation.navigate('Search' as never, { keyword: props.data.productName } as never)
                }}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', height: 75 }}>
                    <AnimatedCircle
                        size={4}
                        color={getColorList()[props.index]} >

                        <Text text={(props.index + 1).toString()} style={{ fontSize: 16, fontWeight: '500' }} />
                    </AnimatedCircle>

                    <View
                        style={{
                            marginLeft: 30, paddingVertical: 10, backgroundColor: '#c0c6cf', borderRadius: 10,
                            paddingLeft: 5, flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 1
                        }}>
                        <BText
                            text={props.data.productName}
                            style={{ fontSize: 18, textAlign: 'center', flexGrow: 1, flexShrink: 1, paddingHorizontal: 10 }} numberOfLines={3} />
                    </View>
                </TransparentView>
            </Pressable>
        </View >
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
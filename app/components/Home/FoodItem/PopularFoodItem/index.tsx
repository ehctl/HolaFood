import React from "react";
import { TransparentView, View } from "../../../../base/View";
import { PopularFoodData } from "../../HomeFoodList";
import { Text } from "../../../../base/Text";
import { Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from "@expo/vector-icons";



export const PopularFoodItem = React.memo((props: PopularFoodItemProps) => {
    const navigation = useNavigation()

    return (
        <View>
            <Pressable
                onPress={() => {
                    navigation.navigate('Search' as never, { keyword: props.data.productName } as never)
                }}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', height: 70 }}>

                    <View style={{
                        position: 'absolute', left: 0, zIndex: 1,
                        width: 55, aspectRatio: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: getColorList()[props.index],
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                        marginBottom: 10
                    }}>
                        <Text text={(props.index + 1).toString()} style={{ fontSize: 23, fontWeight: '600', color: 'white' }} />
                    </View>

                    <View
                        style={{
                            marginLeft: 30, paddingVertical: 10, backgroundColor: '#c0c6cf', borderRadius: 10,
                            paddingLeft: 50, flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
                        }}>
                        <Text
                            text={props.data.productName}
                            style={{ fontSize: 18, textAlign: 'left', flexGrow: 1 }} />
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
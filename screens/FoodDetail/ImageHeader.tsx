import { Image,  } from "react-native"
import { View } from "../../components/View"
import { ScrollView } from "react-native-gesture-handler"
import React from "react"
import { FoodDetailData } from "./FoodDetail"

export const ImageHeader = React.memo((props: FoodDetailData) => {

    return (
        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
            <ScrollView
                contentContainerStyle={{ height: 400 }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {
                    props.images.map((imageUrl, index) => {
                        return (
                            <Image
                                key={index}
                                style={{ height: '100%', aspectRatio: 1 }}
                                source={{
                                    uri: imageUrl
                                }} />
                        )
                    })
                }
            </ScrollView>
        </View>
    )
})

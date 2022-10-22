import { View } from "../../base/View"
import { ScrollView } from "react-native-gesture-handler"
import React from "react"
import { FoodDetailData } from "./FoodDetailScreen"
import FastImage from 'react-native-fast-image'
import { Image } from "../../base/Image"

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

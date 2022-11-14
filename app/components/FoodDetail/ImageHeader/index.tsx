import { View } from "../../../base/View"
import React from "react"
import { FoodDetailData } from "../FoodDetailScreen"
import { Image } from "../../../base/Image"

export const ImageHeader = React.memo((props: FoodDetailData) => {

    return (
        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
            <Image
                style={{ height: 400, aspectRatio: 1 }}
                source={{
                    uri: props.productImgURL
                }} />
        </View>
    )
})

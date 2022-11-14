import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { TransparentView, View } from "../../../base/View"

export const FoodItemShimmer = React.memo((props: FoodItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem
                    style={{ aspectRatio: 1, width: 125, borderRadius: 15, margin: 5 }} />
                <TransparentView style={{ flexDirection: 'column', flexGrow: 1, flexShrink: 1, marginLeft: 10 }}>
                    <ShimmerItem style={{ height: 20, borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 20, borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 20, borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 20, borderRadius: 15, margin: 5 }} />
                </TransparentView>
            </TransparentView>
            
        </ShimmerGroup>
    )
})

export type FoodItemShimmerType = {
    visible: boolean
}
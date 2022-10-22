import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { TransparentView, View } from "../../../base/View"

export const ShopInfoShimmer = React.memo((props: FoodDetailShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ width: 100, aspectRatio: 1, borderRadius: 1000, margin: 5 }} />
                <TransparentView style={{ flexGrow: 1, flexShrink: 1, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                    <ShimmerItem style={{ height: 20, width: '100%', borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 20, width: '100%', borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 20, width: '100%', borderRadius: 15, margin: 5 }} />
                </TransparentView>
            </TransparentView>
        </ShimmerGroup>
    )
})


export const ShopFoodListShimmer = React.memo((props: FoodDetailShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: 5 }}>
                    <ShimmerItem style={{ height: 100, width: '40%', borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 100, width: '40%', borderRadius: 15, margin: 5 }} />
                </TransparentView>
                <ShimmerItem style={{ height: 20, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 20, width: '90%', borderRadius: 15, margin: 5 }} />
            </TransparentView>

        </ShimmerGroup>
    )
})

export type FoodDetailShimmerType = {
    visible: boolean
}
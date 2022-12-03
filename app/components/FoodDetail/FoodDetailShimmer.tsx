import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../base/Shimmer"
import { TransparentView } from "../../base/View"

export const FoodDetailShimmer = React.memo((props: FoodDetailShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 400, aspectRatio: 1, borderRadius: 15, margin: 5 }} />

                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5, marginTop: 30 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type FoodDetailShimmerType = {
    visible: boolean
}
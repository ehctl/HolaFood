import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../base/Shimmer"
import { TransparentView, View } from "../../base/View"

export const OrderItemShimmer = React.memo((props: OrderItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 40, width: '100%', borderRadius: 15, margin: 5 }} />

                <ShimmerItem style={{ height: 25, width: '100%', borderRadius: 15, margin: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type OrderItemShimmerType = {
    visible: boolean
}
import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { TransparentView, View } from "../../../base/View"

export const OrderItemShimmer = React.memo((props: OrderItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'center', alignItems: 'flex-start', margin: 5 }}>
                <ShimmerItem style={{ height: 20, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 20, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '40%', borderRadius: 15, margin: 5, marginLeft: 20 }} />
                <ShimmerItem style={{ height: 15, width: '40%', borderRadius: 15, margin: 5, marginLeft: 20 }} />
                <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5}} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type OrderItemShimmerType = {
    visible: boolean
}
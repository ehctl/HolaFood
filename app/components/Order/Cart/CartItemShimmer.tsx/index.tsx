import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../../base/Shimmer"
import { TransparentView, View } from "../../../../base/View"

export const CartItemShimmer = React.memo((props: CartItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 5 }}>
                <ShimmerItem style={{ height: 100, aspectRatio: 1, borderRadius: 10, margin: 5 }} />

                <TransparentView style={{flexGrow: 1}}>
                    <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
                    <ShimmerItem style={{ height: 15, width: '20%', alignSelf: 'flex-start', borderRadius: 15, margin: 5 }} />
                </TransparentView>
            </TransparentView>
        </ShimmerGroup>
    )
})

export type CartItemShimmerType = {
    visible: boolean
}
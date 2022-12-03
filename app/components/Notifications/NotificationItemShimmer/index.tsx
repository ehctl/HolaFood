import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../base/Shimmer"
import { TransparentView } from "../../../base/View"

export const NotificationItemShimmer = React.memo((props: NotificationItemShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ justifyContent: 'flex-start', alignItems: 'flex-start', margin: 5 }}>
                <ShimmerItem style={{ height: 15, width: 150, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: 250, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: 150, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: 250, borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
                <ShimmerItem style={{ height: 15, width: '90%', borderRadius: 15, margin: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})


export type NotificationItemShimmerType = {
    visible: boolean
}

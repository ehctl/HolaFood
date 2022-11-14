import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../../base/Shimmer"
import { TransparentView } from "../../../../base/View"

export const CategoryListShimmer = React.memo((props: CategoryListShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <ShimmerItem style={{ height: 40, width: 200, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 40, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 60, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 120, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 140, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 50, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                <ShimmerItem style={{ height: 40, width: 150, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
            </TransparentView>
        </ShimmerGroup>
    )
})

export type CategoryListShimmerType = {
    visible: boolean
}
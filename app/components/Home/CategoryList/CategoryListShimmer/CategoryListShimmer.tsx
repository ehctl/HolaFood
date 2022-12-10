import React from "react"
import { ShimmerGroup, ShimmerItem } from "../../../../base/Shimmer"
import { TransparentView } from "../../../../base/View"

export const CategoryListShimmer = React.memo((props: CategoryListShimmerType) => {
    return (
        <ShimmerGroup visible={props.visible}>
            <TransparentView style={{ flexDirection: 'row', overflow: 'hidden' }}>
                <TransparentView style={{ margin: 5 }}>
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                </TransparentView>

                <TransparentView style={{ margin: 5 }}>
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                </TransparentView>
                <TransparentView style={{ margin: 5 }}>
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                </TransparentView>
                <TransparentView style={{ margin: 5 }}>
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                </TransparentView>
                <TransparentView style={{ margin: 5 }}>
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                    <ShimmerItem style={{ height: 70, width: 70, borderRadius: 15, marginHorizontal: 5, marginVertical: 5 }} />
                </TransparentView>
            </TransparentView>
        </ShimmerGroup>
    )
})

export type CategoryListShimmerType = {
    visible: boolean
}
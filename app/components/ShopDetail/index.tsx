import { AnimatedHeader } from "../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../base/Headers/Level2Header"
import { TransparentView, View } from "../../base/View"
import { I18NText } from "../../base/Text"
import React from "react"
import { ShopInfo } from "./ShopInfo.tsx"
import { ShopFoodList } from "./ShopFoodList"

export const ShopDetail = React.memo((props: ShopDetailProps) => {

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header title='Shop' />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    data: [],
                    renderItem: (_: any) => <View />,
                    ListFooterComponent:
                        <TransparentView style={{ flex: 1 }}>
                            <ShopInfo shopId={props.shopId} />
                            <I18NText text="Food" style={{ textAlign: 'left', fontSize: 30, fontWeight: '500', marginLeft: 10, marginTop: 30 }} />
                            <ShopFoodList shopId={props.shopId} />
                        </TransparentView>

                }}
                hideReload={true} >

            </AnimatedHeader>
        </View>
    )
})



export type ShopDetailProps = {
    shopId?: string,
}


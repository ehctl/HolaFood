import { AnimatedHeader } from "../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../base/Headers/Level2Header"
import { TransparentView, View } from "../../base/View"
import { I18NText } from "../../base/Text"
import React, { useState } from "react"
import { ShopInfo } from "./ShopInfo.tsx"
import { ShopFoodList } from "./ShopFoodList"

export const ShopDetail = React.memo(({route} : any) => {
    const [shopName, setShopName] = useState('Loading...')

    return (
        <View style={{ flex: 1 }}>
            <AnimatedHeader
                headerProps={{
                    header: <Level2Header title={shopName} />,
                    headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    data: [],
                    renderItem: (_: any) => <View />,
                    ListFooterComponent:
                        <TransparentView style={{ flex: 1 }}>
                            <ShopInfo shopId={route.params?.shopId}  setShopName={setShopName} />
                            <I18NText text="Food" style={{ textAlign: 'left', fontSize: 26, fontWeight: '500', marginLeft: 10, marginTop: 30 }} />
                            <ShopFoodList shopId={route.params?.shopId} />
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


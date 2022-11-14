import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { Image } from "../../../base/Image"
import React, { useCallback, useEffect, useState } from "react"
import { ShopInfoShimmer } from "../ShopDetailShimmer.tsx"
import { wait } from "../../../utils/Utils"
import { getShopInfo } from "../../../core/apis/Requests"

export const ShopInfo = React.memo((props: ShopInfoProps) => {
    const [shopData, setShopData] = useState<ShopData>(null)

    const fetchData = useCallback(async () => {
        getShopInfo(
            props.shopId,
            (response) => {
                const data = response.data as ShopData
                setShopData(data)
            },
            (e) => {
                console.log(e)
            }
        )
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        shopData ?
            <TransparentView style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
                {/* <Text text={shopData.shopName + ' - ' + shopData.shopAddress} style={{ fontSize: 18, fontWeight: '500', textAlign: 'left' }} numberOfLines={3} /> */}
                <TransparentView style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        source={{ uri: shopData.urlImg }}
                        style={{ width: 150, height: 150, borderRadius: 15 }}
                    />
                    <TransparentView style={{ marginHorizontal: 10, flexGrow: 1, flexShrink: 1 }}>
                        <Text text={shopData.shopName + ' - ' + shopData.shopAddress} style={{ marginTop: 10, fontSize: 14, fontWeight: '500', textAlign: 'left' }} numberOfLines={3} />
                        <Text text={shopData.description} style={{ marginTop: 10, fontSize: 14, textAlign: 'left', flexShrink: 1 }} numberOfLines={10} />
                    </TransparentView>
                </TransparentView>
            </TransparentView>
            : <ShopInfoShimmer visible={true} />
    )
})

export type ShopInfoProps = {
    shopId: string
}

export type ShopData = {
    id: number,
    shopName: string,
    shopAddress: string,
    description: string
    urlImg: string,
    userId: number
}

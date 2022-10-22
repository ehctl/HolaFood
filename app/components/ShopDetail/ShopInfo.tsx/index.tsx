import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { Image } from "../../../base/Image"
import React, { useCallback, useEffect, useState } from "react"
import { ShopInfoShimmer } from "../ShopDetailShimmer.tsx"
import { wait } from "../../../utils/Utils"
import { getShopInfo } from "../../../core/apis/requests"

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
            <TransparentView style={{ flexDirection: 'row' }}>
                <Image
                    source={{ uri: 'https://images.foody.vn/res/g2/15853/s800/foody-123-zzo-pho-vong-894-637208138119392999.jpg' }}
                    style={{ width: 100, aspectRatio: 1, borderRadius: 100 }}
                />
                <TransparentView style={{ marginHorizontal: 10, flexGrow: 1, flexShrink: 1 }}>
                    <Text text={shopData.name} style={{ fontSize: 18, fontWeight: '500', textAlign: 'left' }} numberOfLines={3} />
                    <Text text={shopData.location} style={{ marginTop: 10, fontSize: 14, fontWeight: '500', textAlign: 'left' }} numberOfLines={3} />
                    <Text text={shopData.description} style={{ marginTop: 10, fontSize: 14, fontWeight: '500', textAlign: 'left', flexShrink: 1 }} numberOfLines={5} />
                </TransparentView>
            </TransparentView>
            : <ShopInfoShimmer visible={true} />
    )
})

export type ShopInfoProps = {
    shopId: string
}

export type ShopData = {
    id: string,
    name: string,
    location: string,
    description: string
}

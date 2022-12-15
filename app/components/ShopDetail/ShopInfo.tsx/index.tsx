import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { Image } from "../../../base/Image"
import React, { useCallback, useEffect, useState } from "react"
import { ShopInfoShimmer } from "../ShopDetailShimmer.tsx"
import { wait } from "../../../utils/Utils"
import { getShopInfo } from "../../../core/apis/Requests"
import { FontAwesome } from "../../../base/FontAwesome"
import { Pressable } from 'react-native'
import { Linking } from "react-native"
import { Constant } from "../../../utils/Constant"
import { useToast } from "../../../base/Toast"

export const ShopInfo = React.memo((props: ShopInfoProps) => {
    const [shopData, setShopData] = useState<ShopData>(null)

    const showToast = useToast()

    const fetchData = useCallback(async () => {
        getShopInfo(
            props.shopId,
            (response) => {
                const data = response.data as ShopData
                setShopData(data)
                props.setShopName(data.shopName)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
            }
        )
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        shopData ?
            <TransparentView style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: shopData.urlImg }}
                        style={{ width: 150, height: 150, borderRadius: 15 }}
                    />
                    <TransparentView style={{ marginHorizontal: 10, flexGrow: 1, flexShrink: 1 }}>
                        <Text text={shopData.shopAddress} style={{ fontSize: 14, fontWeight: '500', textAlign: 'left' }} />

                        <Pressable
                            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}
                            onPress={() => Linking.openURL(`tel:+${shopData.phone}`)}>

                            <FontAwesome name="phone" size={22} color='#0c53c4' />
                            <Text
                                text={shopData.phone}
                                style={{ marginLeft: 10 }} />
                        </Pressable>

                        <Text text={shopData.description} style={{ marginTop: 10, fontSize: 14, textAlign: 'left', flexShrink: 1 }} />
                    </TransparentView>
                </TransparentView>
            </TransparentView>
            : <ShopInfoShimmer visible={true} />
    )
})

export type ShopInfoProps = {
    shopId: string,
    setShopName: (name: string) => void
}

export type ShopData = {
    id: number,
    shopName: string,
    shopAddress: string,
    description: string
    urlImg: string,
    userId: number,
    phone: string
}

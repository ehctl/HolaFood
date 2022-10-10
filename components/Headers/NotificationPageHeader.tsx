import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TransparentView, View } from "../View"
import { TransparentText } from "../Text"
import { useNavigation } from '@react-navigation/native';
import React from "react"

export const NotificationPageHeader = React.memo((props: NotificationPageHeader) => {
    const navigation = useNavigation()

    return (
        <View
            style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10,
                paddingTop: 5, height: NotificationPageHeaderStat.HEADER_MAX_HEIGHT
            }}>

            <TransparentView style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                <TransparentText text="Notifications" style={{ fontSize: 22, fontWeight: '700', color: '#2dbd26' }} />
            </TransparentView>

            <TransparentView style={{ flexDirection: 'row' }}>
                <Pressable
                    style={{
                        borderRadius: 25, backgroundColor: '#d4d4d4', padding: 10,  marginRight: 5, marginLeft: 10,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    }}
                    onPress={() => {
                        navigation.navigate('Search' as never)
                    }} >
                    <FontAwesome name="search" size={20} color='#4666a6'/>
                </Pressable>
            </TransparentView>
        </View>
    )
})

export type NotificationPageHeader = {
}

export const NotificationPageHeaderStat = {
    HEADER_MAX_HEIGHT: 60,
}

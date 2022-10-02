import { ImageBackground, Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TransparentView, View } from "../View"
import { TransparentText } from "../Text"
import { useNavigation } from '@react-navigation/native';
import React from "react"

export const HomePageHeader = React.memo((props: HomeHeaderProp) => {
    const navigation = useNavigation()

    return (
        <View style={[style.container, { height: HomePageHeaderStat.HEADER_MAX_HEIGHT }]}>


                <TransparentView style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TransparentText text="HolaFood" style={{ fontSize: 22, fontWeight: '700', }} />
                </TransparentView>
                <Pressable style={style.iconContainer}
                    onPress={() => {
                        props.onSearchIconPress?.()
                        // ?? ?error
                        navigation.navigate('Search')
                    }} >
                    <FontAwesome name="search" size={20} />
                </Pressable>
        </View>
    )
})

export type HomeHeaderProp = {
    // already navigate to Search screen, this function is for additional things...
    onSearchIconPress?: () => void,
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingBottom: 10,
        paddingTop: 5
    },
    iconContainer: {
        borderRadius: 25,
        backgroundColor: '#d4d4d4',
        padding: 10,
        marginRight: 10
    }
})

export const HomePageHeaderStat = {
    HEADER_MAX_HEIGHT: 60,
}

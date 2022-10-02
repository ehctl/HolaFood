import { Image, Pressable } from "react-native"
import { FontAwesome } from "../components/FontAwesome"
import { TransparentText as Text } from "../components/Text"
import { TransparentView as View } from "../components/View"
import React from "react"
import { ItemType } from "../screens/Home/FoodList"
import { DUMMY_TYPE } from "../screens/Dumm"
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const HorizontalFoodItem = React.memo((item: ItemType) => {
    const convertedItem = item as DUMMY_TYPE
    const isHelperItem = (convertedItem.address == undefined)
    const navigation = useNavigation()

    return (
        isHelperItem ?
            <ActivityIndicator style={{ margin: 10 }} color='orange' />
            :
            <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('FoodDetail', { itemId: '123123' })}>

                <View style={{
                    paddingLeft: 10, paddingRight: 20, marginBottom: 8,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    backgroundColor: 'transparent'
                }}>
                    <Image
                        source={{
                            uri: 'https://img.freepik.com/premium-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000'
                        }}
                        style={{ aspectRatio: 1, height: 180, borderRadius: 15 }} />

                    <View style={{ backgroundColor: 'transparent', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline', maxWidth: 160 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="chevron-up" size={14} style={{ marginRight: 5 }} color='#97a842' />
                            </View>
                            <Text text={convertedItem.title + 'fadksjfa;skdfja;fkasjfsafkjas;fjasfls'} numberOfLines={3} ellipsizeMode='tail' style={{ textAlign: 'left', fontWeight: '500', fontSize: 22 }} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="home" size={14} style={{ marginRight: 5 }} color='#422475' />
                            </View>
                            <Text text={convertedItem.shopName} numberOfLines={2} style={{ textAlign: 'left', opacity: 0.7 }} />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 20, alignItems: 'center' }}>
                                <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                            </View>
                            <Text text={convertedItem.address} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7 }} />
                        </View>
                    </View>
                </View>
            </Pressable>
    )
})

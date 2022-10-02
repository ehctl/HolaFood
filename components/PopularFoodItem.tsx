import { Image, Pressable } from "react-native"
import { FontAwesome } from "../components/FontAwesome"
import { TransparentText as Text } from "../components/Text"
import { TransparentView as View, View as DefaultView } from "../components/View"
import { Dimensions } from 'react-native';
import React from "react";
import { ItemType } from "../screens/Home/FoodList";
import { DUMMY_TYPE } from "../screens/Dumm"
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const VerticalFoodItem = React.memo((item: ItemType) => {
    const windowWidth = Dimensions.get('window').width
    const convertedItem = item as DUMMY_TYPE
    const isHelperItem = (convertedItem.address == undefined)
    const navigation = useNavigation()

    return (
        isHelperItem ?
            <ActivityIndicator style={{ margin: 10 }} color='orange' />
            :
            <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('FoodDetail', { itemId: '123123' })}>
                <View style={{
                    flex: 1, flexDirection: 'row', paddingLeft: 10, marginVertical: 8,
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
                        style={{ aspectRatio: 1, width: 100, borderRadius: 15 }} />

                    <View style={{ backgroundColor: 'transparent', height: '100%', width: windowWidth - 180, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline', marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="shield" size={14} style={{ marginRight: 5 }} color='#97a842' />
                            </View>
                            <Text text="Openning" style={{ color: '#59abcf', fontSize: 14 }} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name="chevron-up" size={14} style={{ marginRight: 5 }} color='#97a842' />
                            </View>
                            <Text text={convertedItem.title} numberOfLines={2} ellipsizeMode='tail' style={{ textAlign: 'left', fontWeight: '500', fontSize: 18 }} />
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
                    <View style={{ width: 30, flexDirection: 'row' }}>
                        {
                            convertedItem.isFavorite ?
                                <FontAwesome name="bookmark" size={20} color='orange' />
                                : null
                        }
                    </View>
                </View>
                <DefaultView style={{ height: 1, backgroundColor: 'azure', marginHorizontal: 20 }} />
            </Pressable>
    )
})

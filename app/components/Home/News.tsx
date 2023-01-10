import React, { useRef } from "react"
import { TransparentView, View } from "../../base/View"
import { Animated, Pressable } from 'react-native';
import { BText, Text } from "../../base/Text";
import { FontAwesome } from "../../base/FontAwesome";
import Swiper from 'react-native-swiper'
import { Image } from "../../base/Image";
import { useNavigation } from '@react-navigation/native';
import { Slider } from "../../base/Slider";


export const News = () => {
    const navigation = useNavigation()

    return (
        <Animated.View style={{ flex: 1, backgroundColor: '#dbd9d5', borderRadius: 15 }} >
            <Swiper
                style={{ height: 240 }}
                containerStyle={{ margin: 0, padding: 0 }}
                contentContainerStyle={{ margin: 0 }}
                showsButtons={false}
                removeClippedSubviews={false}
                scrollEnabled={true}
                autoplay={true}
                activeDotColor="orange" >

                <Pressable
                    onPress={() => navigation.navigate('FoodList' as never, { type: 169 } as never)}
                    style={{ marginTop: 25, marginBottom: 5, marginHorizontal: 10, flexDirection: 'row', flexGrow: 1, flexShrink: 1 }}>
                    <Image
                        resizeMode="cover"
                        source={require('../../../assets/images/banhmi.jpg')}
                        style={{ width: 170, height: 170, borderRadius: 20 }} />

                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginBottom: 45 }}>
                        <BText
                            text='Bánh mỳ là một trong những món ăn ưa thích số 1 của các bạn sinh viên cũng như mọi người dân bởi sự tiên dụng và hướng vị độc đáo vốn có.'
                            style={{ textAlign: 'left', flexShrink: 1, marginLeft: 10, fontWeight: '500', fontSize: 16 }} />
                    </TransparentView>
                </Pressable>

                <Pressable
                    onPress={() => navigation.navigate('FoodList' as never, { type: 176 } as never)}
                    style={{ marginTop: 25, marginBottom: 5, marginHorizontal: 10, flexDirection: 'row', flexGrow: 1, flexShrink: 1 }}>
                    <Image
                        resizeMode="cover"
                        source={require('../../../assets/images/che.jpg')}
                        style={{ width: 170, height: 170, borderRadius: 20 }} />

                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginBottom: 45 }}>
                        <BText
                            text='Chè là một món ăn nhanh độc đáo của Việt Nam, nó chứa nhiều chất dinh dưỡng, trong đó có nhiều hoạt chất và chất khoáng có khả năng đào thải độc tố, thanh nhiệt, mát gan.'
                            style={{ textAlign: 'left', flexShrink: 1, marginLeft: 10, fontWeight: '500', fontSize: 16 }} />
                    </TransparentView>
                </Pressable>

                <Pressable
                    onPress={() => navigation.navigate('FoodList' as never, { type: 2 } as never)}
                    style={{ marginTop: 25, marginBottom: 5, marginHorizontal: 10, flexDirection: 'row', flexGrow: 1, flexShrink: 1 }}>
                    <Image
                        resizeMode="cover"
                        source={require('../../../assets/images/phobo.jpg')}
                        style={{ width: 170, height: 170, borderRadius: 20 }} />
                    <TransparentView style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginBottom: 45 }}>
                        <BText
                            text='Phở là một món ăn truyền thống và không thể thiếu trong cuộc sống hàng ngày của chúng ta'
                            style={{ textAlign: 'left', flexShrink: 1, marginLeft: 10, fontWeight: '500', fontSize: 16 }} />
                    </TransparentView>
                </Pressable>
            </Swiper>

            {/* <Slider>
                <View style={{backgroundColor: 'red', height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text text="view 1"/>
                </View>
                <View style={{backgroundColor: 'green', height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text text="view 2"/>
                </View>
                <View style={{backgroundColor: 'green', height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text text="view 3"/>
                </View>
                <View style={{backgroundColor: 'green', height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text text="view 4"/>
                </View>
            </Slider> */}
        </Animated.View>
    )
}
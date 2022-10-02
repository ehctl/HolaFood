import React, { useRef } from "react"
import { View } from "../../components/View"
import { Animated, Pressable } from 'react-native';
import { Text } from "../../components/Text";
import { FontAwesome } from "../../components/FontAwesome";

export const News = () => {
    const animatedHeight = useRef(new Animated.Value(200)).current
    const animatedOpcity = useRef(Animated.divide(animatedHeight, 200)).current

    const closeAnim = () => {
        Animated.sequence([
            Animated.timing(animatedHeight, {
                useNativeDriver: false,
                toValue: 0,
                duration: 500
            }),
            Animated.timing(animatedHeight, {
                useNativeDriver: false,
                toValue: 200,
                duration: 500
            }),
        ]).start();
    }

return (
    <Animated.View style={{ position: 'relative', backgroundColor: 'grey', opacity: animatedOpcity, borderRadius: 15, height: animatedHeight, padding: 10 }} >
        <Pressable style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'transparent', height: 30, padding: 5 }} onPress={closeAnim}>
            <FontAwesome name="close" size={20} />
        </Pressable>
        <View style={{ marginTop: 35, backgroundColor: 'transparent' }}>
            <Text text='HOLA Food là 1 sản phẩm dành riêng cho người Hòa Lạc. Mời các bạn trải nghiệm :D' numberOfLines={10} />
        </View>
    </Animated.View>
)
}
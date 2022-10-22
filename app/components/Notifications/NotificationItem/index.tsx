import { TransparentView, View } from "../../../base/View"
import { BText, Text } from "../../../base/Text"
import { FontAwesome } from "../../../base/FontAwesome"
import { Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native';

export const NotificationItem = (props: NotificationItemData) => {
    const navigation = useNavigation()

    return (
        <Pressable
            style={{ marginHorizontal: 5 }}
            onPress={() => {
                navigation.navigate('FoodList' as never)
            }}>
            <View style={{ backgroundColor: '#c0c6cf', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 1, borderRadius: 10, marginTop: 15, paddingVertical: 10, paddingHorizontal: 10 }}>
                <FontAwesome name="shopping-basket" style={{}} size={22} color='#1b5bc2' />
                <BText text={props.text} numberOfLines={10} style={{ marginLeft: 10, textAlign: 'left', flexShrink: 1 }} />
            </View>
        </Pressable>
    )
}

export const getListItem = (): NotificationItemData[] => {
    return [
        {
            text: 'Welcome, welcome! Go Shopping around and pick up what you want !!!'
        },
    ]
}

export type NotificationItemData = {
    text: string
}
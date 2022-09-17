import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TextInput } from "../TextInput"
import { View } from "../View"
import { Text } from "../Text"
import { useNavigation } from '@react-navigation/native';

export const HomePageHeader = (props: HomeHeaderProp) => {
    const navigation = useNavigation()

    return (
        <View style={[style.container, { height: HomePageHeaderStat.HEADER_MAX_HEIGHT }]}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome name="folder-open-o" size={22} />
                <Text text="HolaFood" style={{ fontSize: 14 }} />
            </View>
            <Pressable style={style.iconContainer}
                onPress={() => {
                    props.onSearchIconPress?.()
                    navigation.navigate('Search')
                }} >
                <FontAwesome name="search" size={22} />
            </Pressable>
        </View>
    )
}

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
    HEADER_MAX_HEIGHT: 70,
}

import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "../FontAwesome"
import { TextInput } from "../TextInput"
import { View } from "../View"
import { Text } from "../Text"

export const SearchHeader = (props: SearchHeaderProp) => {
    return (
        <View style={style.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="folder-open-o" color={'blue'} size={22} />
                <Text text="HolaFood" style={{fontSize: 14}}/>
            </View>
            <Pressable style={style.iconContainer} onPress={props.onSearchIconPress} >
                <FontAwesome name="search" size={22} />
            </Pressable>
        </View>
    )
}

export type SearchHeaderProp = {
    onSearchIconPress: () => void,
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

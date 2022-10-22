import { StyleSheet } from 'react-native'

export const style = StyleSheet.create({
    containerView: {
        flex: 1,
        justifyContent: 'space-between',
        position: 'relative'
    },
    pressableView: {
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: 'grey',
        opacity: 0.5
    },
    childrenContainer: {
        position: 'absolute',
        opacity: 1,
        left: 0, right: 0, bottom: 0,
        paddingHorizontal: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})
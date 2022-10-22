import { StyleSheet } from "react-native"

export const style = StyleSheet.create({
    defaultView: {
        flex: 1
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    backButton: {
        paddingHorizontal: 10
    },
    searchItemDivider: {
        height: 1, 
        marginTop: 5, 
        marginHorizontal: 10, 
        backgroundColor: 'black' 
    },
    searchTitle: {
        textAlign: 'left', 
        marginLeft: 10, 
        marginTop: 10, 
        fontSize: 24 
    },
    searchTextInput: {
        flex: 1, 
        fontSize: 20,
        padding: 5
    }
})
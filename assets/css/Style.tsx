import { StyleSheet } from "react-native"

export const Style = StyleSheet.create({
    flex_c_c: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex_c_s: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    defaultView:{ 
        flex: 1,
        backgroundColor: 'white'
    },
    drawerLeftIcon: {
        marginLeft: 5,
    },
    defaultButton: {
        flexDirection: 'row', 
        fontSize: 20,
        backgroundColor: '#6aabd9',
        margin: 5,
        padding: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    defaultTextInput: {
        fontSize: 20,
        margin: 10,
        padding: 10,
        borderStyle: 'solid',
        borderColor: '#6495ed',
        borderWidth: 1,
        borderRadius: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        position: 'relative'
    },
    headerLeftIcon: {
        position: 'absolute',
        height: '200%',
        left: 5,
        zIndex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    headerRightIcon: {
        position: 'absolute',
        height: '200%',
        right: 5,
        zIndex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    headerTitleCointainer: {
        flexGrow: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    },
    headerDivider: {
        width: '100%',
        backgroundColor: 'black',
        opacity: 0.8,
        height: 0.2
    }
})

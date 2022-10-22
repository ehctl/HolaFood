import { Modal, Pressable } from "react-native"
import { TransparentView, View } from "../View"
import React, { forwardRef, useImperativeHandle, useState } from "react"
import { style } from "./style/style.css"
import { ScrollView, SafeAreaView } from 'react-native'
import { StatusBar } from "expo-status-bar"
import { FontAwesome1 } from "../FontAwesome"
import { Text } from "../Text"
import { useWindowDimensions } from 'react-native';
import { isIosDevice, useKeyboard } from "../../utils/Utils"


export const PopupModal = React.memo(forwardRef<any, PopupModalProps>((props: PopupModalProps, ref) => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const { height } = useWindowDimensions();
    const keyboardHeight = (isIosDevice() && props.shouldAvoidKeyboard) ? useKeyboard() : 0

    useImperativeHandle(
        ref,
        () => ({
            changeVisibility: (visibility: boolean) => { setModalVisibility(visibility) }
        })
    )

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisibility}
            statusBarTranslucent={false}
            onRequestClose={() => {
                setModalVisibility(!modalVisibility);
            }} >
            {/* {
                isIosDevice() ?
                    <StatusBar hidden={modalVisibility} />
                    : null
            } */}
            <TransparentView style={[style.containerView]}>
                <Pressable style={style.pressableView} onPress={() => setModalVisibility(false)} />
                <View
                    style={style.childrenContainer} >
                    <TransparentView style={{ flex: 1, position: 'relative', maxHeight: height - 100 }}>
                        <TransparentView style={{ position: 'absolute', height: 50, left: 0, right: 0, top: 0 }}>
                            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text text={props.title} style={{ fontSize: 18 }} />
                                <FontAwesome1 name="close" size={22} onPress={() => setModalVisibility(false)} style={{ paddingVertical: 15 }} />
                            </TransparentView>
                            <View style={{ height: 1, backgroundColor: 'grey' }} />
                        </TransparentView>
                        <TransparentView style={{ marginTop: 50 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}>
                                {props.children}
                            </ScrollView>
                        </TransparentView>
                    </TransparentView>
                    <TransparentView style={{ height: keyboardHeight }} />
                </View>
            </TransparentView>
        </Modal>
    )
}))



export type PopupModalProps = {
    title: string,
    shouldAvoidKeyboard?: boolean,
    children?: React.ReactNode[] | React.ReactNode
}
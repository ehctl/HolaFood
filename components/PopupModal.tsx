import { Modal, Pressable } from "react-native"
import { TransparentView, View } from "../components/View"
import React, { forwardRef, useImperativeHandle, useState } from "react"


export const PopupModal = React.memo(forwardRef<any, PopupModalProps>((props: PopupModalProps, ref) => {
    const [modalVisibility, setModalVisibility] = useState(false)

    useImperativeHandle(
        ref,
        () => ({
            changeVisibility: (visibility: boolean) => {setModalVisibility(visibility)}
        })
    )

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisibility}
            onRequestClose={() => {
                setModalVisibility(!modalVisibility);
            }} >

            <TransparentView style={{ flex: 1, justifyContent: 'space-between', position: 'relative' }}>
                <Pressable style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'grey', opacity: 0.5 }} onPress={() => setModalVisibility(false)} />
                <View
                    style={{
                        position: 'absolute', opacity: 1, left: 0, right: 0, bottom: 0, paddingHorizontal: 10,
                        borderTopLeftRadius: 20, borderTopRightRadius: 20
                    }} >
                    { props.children }
                </View>
            </TransparentView>
        </Modal>
    )
}))

export type PopupModalProps = {
    children?: React.ReactNode[] | React.ReactNode
}
import { TransparentView, View } from "../../../base/View"
import { Text } from "../../../base/Text"
import { FontAwesome2 } from "../../../base/FontAwesome"
import { PopupModal } from "../../../base/PopupModal"
import { useRef, useState } from "react"
import { Pressable, TextInput } from "react-native"


export const Info = () => {
    const updateUsernameModal = useRef(null)
    const updatePhoneNumberModal = useRef(null)
    const updatePasswordModal = useRef(null)

    return (
        <TransparentView>
            <TransparentView style={{ marginHorizontal: 10 }}>
                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <Text text="Name" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                            <Text text="Tuấn Linh" style={{ fontSize: 18, fontWeight: '500', marginTop: 5 }} />
                        </TransparentView>
                        <FontAwesome2 name="auto-fix-high" size={24} color='grey' onPress={() => updateUsernameModal.current.changeVisibility(true)} style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <Text text="Phone" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                            <Text text="0968550429" style={{ fontSize: 18, fontWeight: '500', marginTop: 5 }} />
                        </TransparentView>
                        <FontAwesome2 name="auto-fix-high" size={24} color='grey' onPress={() => updatePhoneNumberModal.current.changeVisibility(true)} style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <Text text="Password" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                            <Text text="" style={{ fontSize: 18, marginTop: 5 }} />
                        </TransparentView>
                        <FontAwesome2 name="auto-fix-high" size={24} color='grey' onPress={() => updatePasswordModal.current.changeVisibility(true)} style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>
            </TransparentView>

            <PopupModal ref={updateUsernameModal} title="Update" shouldAvoidKeyboard={true}>
                <UpdateUsername username="Tuan Linh" />
            </PopupModal>
            
            <PopupModal ref={updatePhoneNumberModal} title="Update" shouldAvoidKeyboard={true}>
                <UpdatePhone phoneNumber="0968550429" />
            </PopupModal>
            
            <PopupModal ref={updatePasswordModal} title="Update" shouldAvoidKeyboard={true}>
                <UpdatePassword password='sadfsdfasf' />
            </PopupModal>
        </TransparentView>
    )
}

export const UpdateUsername = (props: { username: string }) => {
    const [userName, setUsername] = useState(props.username)

    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 30, alignItems: 'stretch' }}>
                <Text text="Name" style={{ textAlign: 'left', fontSize: 22 }} />
                <TextInput
                    value={userName}
                    onChangeText={(v) => setUsername(v)}
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />
            </TransparentView>

            <Pressable
                style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => {
                    console.log('update')
                }}>
                <Text text="Update your name" />
            </Pressable>
        </TransparentView>
    )
}

export const UpdatePhone = (props: { phoneNumber: string }) => {
    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)

    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 30, alignItems: 'stretch' }}>
                <Text text="Phone" style={{ textAlign: 'left', fontSize: 22 }} />
                <TextInput
                    value={phoneNumber}
                    onChangeText={(v) => setPhoneNumber(v)}
                    keyboardType='decimal-pad'
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />
            </TransparentView>

            <Pressable
                style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => {
                    console.log('update')
                }}>
                <Text text="Update your phone number" />
            </Pressable>
        </TransparentView>
    )
}

export const UpdatePassword = (props: { password: string }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 30, alignItems: 'stretch' }}>
                <Text text="Password" style={{ textAlign: 'left', fontSize: 22 }} />
                <TextInput
                    placeholder='Old Password'
                    value={oldPassword}
                    onChangeText={(v) => setOldPassword(v)}
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />

                <TextInput
                    placeholder='New Password'
                    value={newPassword}
                    onChangeText={(v) => setNewPassword(v)}
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />

                <TextInput
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChangeText={(v) => setConfirmPassword(v)}
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />
            </TransparentView>

            <Pressable
                style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => {
                    console.log('update')
                }}>
                <Text text="Update your password" />
            </Pressable>
        </TransparentView>
    )
}

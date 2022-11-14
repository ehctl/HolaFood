import { TransparentView, View } from "../../../../base/View"
import { I18NText, Text } from "../../../../base/Text"
import { FontAwesome, FontAwesome2 } from "../../../../base/FontAwesome"
import { PopupModal } from "../../../../base/PopupModal"
import { useCallback, useRef, useState } from "react"
import { ActivityIndicator, Pressable, TextInput } from "react-native"
import { useSelector } from "react-redux"
import { AppState, setUserInfo } from "../../../../redux/Reducer"
import { useLanguage } from "../../../../base/Themed"
import React from "react"
import { isValidNormalText, isValidPassword, isValidPhoneNumber } from "../../../../validation/validate"
import { changePassword, updateUserInfo } from "../../../../core/apis/Requests"
import { deleteInfoBeforeLogout, formatAccountRole, saveUserInfoLocalStorage } from "../../../../utils/Utils"
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux"


export const Info = React.memo(() => {
    const dispatch = useDispatch()
    const appStateProps = useSelector((state: AppState) => ({
        userInfo: state.userInfo
    }))
    const [updateMode, setUpdateMode] = useState(null)
    const updateModal = useRef(null)

    const updateAllUserInfo = (
        firstName: string,
        lastName: string,
        phone: string,
    ) => {
        updateUserInfo(
            firstName,
            lastName,
            phone,
            async (response) => {
                const userInfo = {
                    id: appStateProps.userInfo?.id,
                    email: appStateProps.userInfo?.email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    role: appStateProps.userInfo?.role,
                }

                dispatch(setUserInfo(userInfo))
                await saveUserInfoLocalStorage(userInfo)

                updateModal.current.changeVisibility(false)
            },
            (e) => {
                console.log(e)
                updateModal.current.changeVisibility(false)
            }
        )
    }

    const changeFirstName = (firstName: string) => {
        updateAllUserInfo(firstName, appStateProps.userInfo?.lastName, appStateProps.userInfo?.phone)
    }

    const changeLastName = (lastName: string) => {
        updateAllUserInfo(appStateProps.userInfo?.firstName, lastName, appStateProps.userInfo?.phone)
    }

    const changePhone = (phone: string) => {
        updateAllUserInfo(appStateProps.userInfo?.firstName, appStateProps.userInfo?.lastName, phone)
    }


    const getUpdateModal = useCallback(() => {
        switch (updateMode) {
            case UpdateMode.FIRST_NAME:
                return <UpdateUsername updateFirstName={true} name={appStateProps.userInfo?.firstName ?? ''} callback={changeFirstName} />
            case UpdateMode.LAST_NAME:
                return <UpdateUsername updateFirstName={false} name={appStateProps.userInfo?.lastName ?? ''} callback={changeLastName} />
            case UpdateMode.PHONE_NUMBER:
                return <UpdatePhone phoneNumber={appStateProps.userInfo?.phone ?? ''} callback={changePhone} />
            case UpdateMode.PASSWORD:
                return <UpdatePassword />
        }

    }, [updateMode, appStateProps.userInfo])

    return (
        <TransparentView>
            <TransparentView style={{ marginHorizontal: 10 }}>
                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <I18NText text="Email" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                                <Text text=" ﹡ " style={{ color: 'red', textAlign: 'left', fontSize: 18 }} />
                            </TransparentView>
                            <Text text={appStateProps.userInfo?.email?.trim() ?? ''} style={{ fontSize: 18, fontWeight: '500', marginTop: 5, textAlign: 'left' }} />
                        </TransparentView>
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <I18NText text="Role" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                                <Text text=" ﹡ " style={{ color: 'red', textAlign: 'left', fontSize: 18 }} />
                            </TransparentView>
                            <Text text={formatAccountRole(appStateProps.userInfo?.role ?? '')} style={{ fontSize: 18, fontWeight: '500', marginTop: 5, textAlign: 'left' }} />
                        </TransparentView>
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <I18NText text="First Name" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                                <Text text=" ﹡ " style={{ color: 'red', textAlign: 'left', fontSize: 18 }} />
                            </TransparentView>

                            <Text text={appStateProps.userInfo?.firstName?.trim() ?? ''} style={{ fontSize: 18, fontWeight: '500', marginTop: 5, textAlign: 'left' }} />
                        </TransparentView>
                        <FontAwesome2
                            name="auto-fix-high" size={24} color='grey'
                            onPress={() => {
                                setUpdateMode(UpdateMode.FIRST_NAME)
                                updateModal.current.changeVisibility(true)
                            }}
                            style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <I18NText text="Last Name" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                                <Text text=" ﹡ " style={{ color: 'red', textAlign: 'left', fontSize: 18 }} />
                            </TransparentView>

                            <Text text={appStateProps.userInfo?.lastName?.trim() ?? ''} style={{ fontSize: 18, fontWeight: '500', marginTop: 5, textAlign: 'left' }} />
                        </TransparentView>
                        <FontAwesome2
                            name="auto-fix-high" size={24} color='grey'
                            onPress={() => {
                                setUpdateMode(UpdateMode.LAST_NAME)
                                updateModal.current.changeVisibility(true)
                            }}
                            style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <I18NText text="Phone Number" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                            <Text text={appStateProps.userInfo?.phone?.trim() ?? ''} style={{ fontSize: 18, fontWeight: '500', marginTop: 5, textAlign: 'left' }} />
                        </TransparentView>
                        <FontAwesome2
                            name="auto-fix-high" size={24} color='grey'
                            onPress={() => {
                                setUpdateMode(UpdateMode.PHONE_NUMBER)
                                updateModal.current.changeVisibility(true)
                            }}
                            style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>

                <TransparentView style={{ marginTop: 5 }}>
                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
                        <TransparentView>
                            <TransparentView style={{ flexDirection: 'row' }}>
                                <I18NText text="Password" style={{ textAlign: 'left', color: '#a19e9d', fontSize: 18 }} />
                                <Text text=" ﹡ " style={{ color: 'red', textAlign: 'left', fontSize: 18 }} />
                            </TransparentView>
                            
                            <Text text="" style={{ fontSize: 18, marginTop: 5 }} />
                        </TransparentView>
                        <FontAwesome2
                            name="auto-fix-high" size={24} color='grey'
                            onPress={() => {
                                setUpdateMode(UpdateMode.PASSWORD)
                                updateModal.current.changeVisibility(true)
                            }}
                            style={{ padding: 10 }} />
                    </TransparentView>
                    <View style={{ backgroundColor: 'grey', height: 1, marginLeft: -10 }} />
                </TransparentView>
            </TransparentView>

            <PopupModal ref={updateModal} title="Update" shouldAvoidKeyboard={true}>
                {getUpdateModal()}
            </PopupModal>
        </TransparentView>
    )
})

export const UpdateUsername = (props: { name: string, updateFirstName: boolean, callback: (value: string) => void }) => {
    const [userName, setUsername] = useState(props.name)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const onSubmit = useCallback(() => {
        const nameValidate = isValidNormalText(userName)
        if (userName == props.name) {
            setErrorMsg('Value was not changed')
        } else if (!nameValidate.qualify) {
            setErrorMsg(nameValidate.message)
        } else {
            setLoading(true)
            props.callback?.(userName)
        }
    }, [userName])

    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 30, alignItems: 'stretch' }}>
                <I18NText text="Name" style={{ textAlign: 'left', fontSize: 22 }} />
                <TextInput
                    value={userName}
                    onChangeText={(v) => setUsername(v)}
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />

                <I18NText text={errorMsg} style={{ color: 'red', textAlign: 'left', marginTop: 5 }} />
            </TransparentView>

            <Pressable
                style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => onSubmit()}>

                <I18NText text="Update Your Name" />
                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>
        </TransparentView>
    )
}

export const UpdatePhone = (props: { phoneNumber: string, callback: (value: string) => void }) => {
    const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const onSubmit = useCallback(() => {
        const nameValidate = isValidPhoneNumber(phoneNumber)
        if (phoneNumber == props.phoneNumber) {
            setErrorMsg('Value was not changed')
        } else if (!nameValidate.qualify) {
            setErrorMsg(nameValidate.message)
        } else {
            setLoading(true)
            props.callback?.(phoneNumber)
        }
    }, [phoneNumber])


    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 30, alignItems: 'stretch' }}>
                <I18NText text="Phone" style={{ textAlign: 'left', fontSize: 22 }} />
                <TextInput
                    value={phoneNumber}
                    onChangeText={(v) => setPhoneNumber(v)}
                    keyboardType='decimal-pad'
                    style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 10, padding: 10, backgroundColor: '#cacecf', borderRadius: 10 }} />
                <I18NText text={errorMsg} style={{ color: 'red', textAlign: 'left', marginTop: 5 }} />
            </TransparentView>

            <Pressable
                style={{ marginTop: 40, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => onSubmit()}>
                <I18NText text="Update Your Phone Number" />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>
        </TransparentView>
    )
}

export const UpdatePassword = () => {
    const navigation = useNavigation<any>()
    const I18NOldPassword = useLanguage('Old Password')
    const I18NNewPassword = useLanguage('New Password')

    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordErrorMsg, setOldPasswordErrorMsg] = useState('')
    const [hideOldPassword, setHideOldPassword] = useState(true)

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState('')
    const [hideNewPassword, setHideNewPassword] = useState(true)

    const [loading, setLoading] = useState(false)

    const onChangePassword = useCallback(() => {
        const oldPasswordValidate = isValidNormalText(oldPassword)
        const newPasswordValidate = isValidPassword(newPassword)

        if (!oldPasswordValidate.qualify || !newPasswordValidate.qualify) {
            setOldPasswordErrorMsg(oldPasswordValidate.message)
            setNewPasswordErrorMsg(newPasswordValidate.message)
        } else {
            setLoading(true)
            changePassword(
                oldPassword,
                newPassword,
                async (response) => {
                    await deleteInfoBeforeLogout()
                    navigation.replace('Authentication')
                },
                (e) => {
                    console.log(e)
                    setLoading(false)
                    setNewPasswordErrorMsg(e.message ?? 'Password is not valid')
                }
            )
        }
    }, [oldPassword, newPassword])

    return (
        <TransparentView>
            <TransparentView style={{ marginTop: 15, alignItems: 'stretch' }}>
                <I18NText text="Password" style={{ textAlign: 'left', fontSize: 22 }} />
                <View style={{ flexDirection: 'row', backgroundColor: '#cacecf', justifyContent: 'space-between', alignItems: 'center', flexShrink: 1, borderRadius: 10 }}>
                    <TextInput
                        placeholder={I18NOldPassword}
                        secureTextEntry={hideOldPassword}
                        onChangeText={(v) => setOldPassword(v)}
                        style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 5, padding: 10, flexGrow: 1, flexShrink: 1 }} />
                    <I18NText text={oldPasswordErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} />
                    <Pressable onPress={() => setHideOldPassword(!hideOldPassword)} style={{ padding: 5 }}>
                        <FontAwesome name={hideOldPassword ? 'eye-slash' : 'eye'} color='#0793a8' size={18} />
                    </Pressable>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: '#cacecf', justifyContent: 'space-between', alignItems: 'center', flexShrink: 1, borderRadius: 10, marginTop: 10 }}>
                    <TextInput
                        placeholder={I18NNewPassword}
                        secureTextEntry={hideNewPassword}
                        onChangeText={(v) => setNewPassword(v)}
                        style={{ textAlign: 'left', fontSize: 18, fontWeight: '500', marginTop: 5, padding: 10, borderRadius: 10, flexGrow: 1, flexShrink: 1 }} />
                    <I18NText text={newPasswordErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} />

                    <Pressable onPress={() => setHideNewPassword(!hideNewPassword)} style={{ padding: 5 }}>
                        <FontAwesome name={hideNewPassword ? 'eye-slash' : 'eye'} color='#0793a8' size={18} />
                    </Pressable>
                </View>
            </TransparentView>

            <Pressable
                style={{ marginTop: 30, marginBottom: 20, backgroundColor: '#c0c6cf', padding: 10, borderRadius: 10 }}
                onPress={() => onChangePassword()}>
                <Text text="Update Your Password" />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>
        </TransparentView>
    )
}

enum UpdateMode {
    FIRST_NAME,
    LAST_NAME,
    PHONE_NUMBER,
    PASSWORD
} 
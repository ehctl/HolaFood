import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome, FontAwesome1, FontAwesome2 } from '../../base/FontAwesome';
import { I18NText, Text } from '../../base/Text';
import { TextInput } from 'react-native'
import { TransparentView, View } from '../../base/View';
import { setUserApiToken, UserType } from '../../redux/Reducer';
import { AuthenticationMode } from './AuthenticationMode';
import { isValidEmail, isValidNormalText, isValidPassword, isValidPhoneNumber } from '../../validation/validate';
import { addNotificationToken, signup, verifyEmail } from '../../core/apis/Requests';
import { useDispatch } from 'react-redux';
import { Constant } from '../../utils/Constant';
import { mapResponseToUserInfo } from '../../hooks/usePrefetchedData';
import { setUserInfo } from '../../redux/Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveApiTokenInfoLocalStorage, saveUserInfoLocalStorage } from '../../utils/Utils';
import { useLanguage } from '../../base/Themed';
import React from 'react';

export const Signup = (props: SignupScreenProp) => {
    const [email, setEmail] = useState('')
    const [canGoBack, setCanGoBack] = useState(false)
    const [verifySuccess, setVerifySuccess] = useState(false)
    const [reset, setReset] = useState(false)

    const onVerifySuccess = useCallback((email: string) => {
        setEmail(email)
        setVerifySuccess(true)
    }, [])


    return (
        <View style={{
            backgroundColor: '#7a7a79', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5,
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10, paddingVertical: 5 }}>
                {
                    canGoBack ?
                        <Pressable
                            onPress={() => { setVerifySuccess(false), setReset(!reset), setCanGoBack(false) }}
                            style={{ position: 'absolute', left: 0 }}>
                            <FontAwesome name='angle-left' size={32} color='white' />
                        </Pressable>
                        : null
                }

                <I18NText text='Sign Up' style={{ alignSelf: 'center', color: 'white', fontSize: 22, fontWeight: '500' }} />
            </TransparentView>

            {
                !verifySuccess ?
                    <VerifyEmail onBeginVerify={() => setCanGoBack(true)} onVerifySuccess={onVerifySuccess} reset={reset} />
                    :
                    <SignUpDetail email={email} onSuccess={props.onSuccess} />
            }


            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <I18NText text='or' style={{ marginHorizontal: 5, color: 'white' }} />
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
            </TransparentView>

            <Pressable
                style={{
                    position: 'relative', backgroundColor: 'grey', paddingVertical: 10, borderRadius: 10, shadowColor: "#000", marginTop: 25,
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => props.changeMode(AuthenticationMode.LOGIN)} >

                <I18NText text='Login' style={{ color: 'white' }} />
            </Pressable>
        </View>
    )
}

export type VerifyEmailType = {
    onBeginVerify: () => void,
    onVerifySuccess: (email: string) => void,
    reset: boolean
}

export const VerifyEmail = React.memo((props: VerifyEmailType) => {
    const [email, setEmail] = useState('')
    const [emailErrorMsg, setEmailErrorMsg] = useState('')

    const [otpCode, setOtpCode] = useState('')
    const [otpCodeErrorMsg, setOtpCodeErrorMsg] = useState('')

    const [verifyEmailCode, setVerifyEmailCode] = useState('')
    const [verifyStage, setVerifyStage] = useState(false)

    const [verifyingEmail, setVerifyingEmail] = useState(false)

    const I18NOtpCode = useLanguage('Otp Code')

    useEffect(() => {
        setVerifyStage(false)
        setVerifyingEmail(false)
    }, [props.reset])

    const onVerifyEmail = useCallback(() => {
        const emailValidate = isValidEmail(email)

        if (!emailValidate.qualify) {
            setEmailErrorMsg(emailValidate.message)
        } else {
            setVerifyingEmail(true)
            
            verifyEmail(
                email,
                (response) => {
                    const otpCode = response.message
                    console.log(otpCode)
                    setVerifyingEmail(false)
                    setEmailErrorMsg('')
                    setVerifyEmailCode(otpCode)
                    setVerifyStage(true)
                    props?.onBeginVerify()
                },
                (e) => {
                    setVerifyingEmail(false)
                    setEmailErrorMsg(e.message ?? e)
                }
            )
        }
    }, [email])

    const onCheckOtpCode = useCallback(() => {
        if (otpCode == verifyEmailCode) {
            props.onVerifySuccess(email)
        } else {
            setOtpCodeErrorMsg('OTP Code Is Not Correct')
        }
    }, [otpCode, verifyEmailCode, email])

    return (
        <TransparentView>
            {
                !verifyStage ?
                    <TransparentView>
                        <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name='envelope' color='#e8be41' size={17} />
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor='#bfbfbd'
                                onChangeText={(text) => setEmail(text)}
                                style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
                        </TransparentView>
                        <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />
                        {
                            emailErrorMsg.length != 0 ?
                                <I18NText text={emailErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
                        }

                        <Pressable
                            style={{
                                position: 'relative', backgroundColor: '#e8be41', paddingVertical: 10, borderRadius: 10, shadowColor: "#000", marginTop: 20,
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5
                            }}
                            onPress={() => onVerifyEmail()} >

                            <I18NText text='Verify Email' style={{ color: 'white' }} />

                            <ActivityIndicator
                                animating={verifyingEmail}
                                color='black'
                                style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
                        </Pressable>
                    </TransparentView>
                    :
                    <TransparentView>
                        <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome1 name='qrcode' color='#e8be41' size={17} />
                            <TextInput
                                placeholder={I18NOtpCode}
                                placeholderTextColor='#bfbfbd'
                                value={otpCode}
                                onChangeText={(text) => setOtpCode(text)}
                                style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
                        </TransparentView>

                        <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

                        <I18NText
                            text='A Code Has Been Sent To Your Email Address. Please Check And Fill Text Below To Verify Your Email.'
                            style={{ textAlign: 'left', marginTop: 3, color: 'white' }} numberOfLines={2} />

                        {
                            otpCodeErrorMsg.length != 0 ?
                                <I18NText text={otpCodeErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
                        }

                        <Pressable
                            style={{
                                position: 'relative', backgroundColor: '#e8be41', paddingVertical: 10, borderRadius: 10, shadowColor: "#000", marginTop: 20,
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5
                            }}
                            onPress={() => onCheckOtpCode()} >

                            <I18NText text='Confirm' style={{ color: 'white' }} />

                        </Pressable>
                    </TransparentView>
            }

        </TransparentView>
    )
})


export type SignUpDetailType = {
    email: string,
    onSuccess: (userType: UserType) => void
}

export const SignUpDetail = React.memo((props: SignUpDetailType) => {
    const dispatch = useDispatch()

    const [firstName, setFirstName] = useState('')
    const [firstNameErrorMsg, setFirstNameErrorMsg] = useState('')

    const [lastName, setLastName] = useState('')
    const [lastNameErrorMsg, setLastNameErrorMsg] = useState('')

    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberErrorMsg, setPhoneNumberErrorMsg] = useState('')

    const [password, setPassword] = useState('')
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('')
    const [hidePassword, setHidePassword] = useState(true)

    const [loading, setLoading] = useState(false)
    const I18NOverLoad = useLanguage('System overloaded. Please wait for a moment')
    const I18NFirstName = useLanguage('First Name')
    const I18NLastName = useLanguage('Last Name')
    const I18NPassword = useLanguage('Password')
    const I18NPhoneNumber = useLanguage('Phone Number')

    const onLoginSuccess = useCallback(async (response) => {
        const token = response.token
        const userInfo = mapResponseToUserInfo(response.data)
        const notiToken = (await AsyncStorage.getItem(Constant.APP_NOTIFICATION_TOKEN)) ?? ''

        dispatch(setUserApiToken(token))
        dispatch(setUserInfo(userInfo))
        saveApiTokenInfoLocalStorage(token)
        saveUserInfoLocalStorage(userInfo)

        if (notiToken.length > 0) {
            addNotificationToken(
                notiToken,
                (response) => {
                    console.log('Add notification token success')
                },
                (e) => {
                    console.log(e)
                }
            )
        }

        props.onSuccess('customer')
    }, [])

    const onSignUp = useCallback(() => {
        const firstNameValidate = isValidNormalText(firstName)
        const lastNameValidate = isValidNormalText(lastName)
        const passwordValidate = isValidPassword(password)
        const phoneNumberValidate = isValidPhoneNumber(phoneNumber)

        if (!passwordValidate.qualify || !firstNameValidate.qualify || !lastNameValidate.qualify || !phoneNumberValidate.qualify) {
            setFirstNameErrorMsg(firstNameValidate.message)
            setLastNameErrorMsg(lastNameValidate.message)
            setPasswordErrorMsg(passwordValidate.message)
            setPhoneNumberErrorMsg(phoneNumberValidate.message)
        } else {
            setLoading(true)
            signup(
                firstName,
                lastName,
                password,
                props.email,
                phoneNumber,
                (response) => {
                    onLoginSuccess(response)
                },
                (e) => {
                    setLoading(false)
                    console.log(e)
                    setPasswordErrorMsg(e.message ?? I18NOverLoad)
                }
            )
        }

    }, [props.email, firstName, lastName, password, phoneNumber])

    return (
        <TransparentView>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='envelope' color='#e8be41' size={17} />
                <Text
                    text={props.email}
                    style={{ flexGrow: 1, borderWidth: 0, padding: 10, fontSize: 18, textAlign: 'left', color: 'white' }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome2 name='format-list-numbered' color='#e8be41' size={17} />
                <TextInput
                    placeholder={I18NFirstName + ' ﹡'}
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setFirstName(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                firstNameErrorMsg.length != 0 ?
                    <I18NText text={firstNameErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome2 name='format-list-numbered' color='#e8be41' size={17} />
                <TextInput
                    placeholder={I18NLastName + ' ﹡'}
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setLastName(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                lastNameErrorMsg.length != 0 ?
                    <I18NText text={lastNameErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome name='phone' color='#e8be41' size={20} />
                <TextInput
                    placeholder={I18NPhoneNumber + ' ﹡'}
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setPhoneNumber(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                phoneNumberErrorMsg.length != 0 ?
                    <I18NText text={phoneNumberErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome name='lock' color='#e8be41' size={26} />
                <TextInput
                    placeholder={I18NPassword + ' ﹡'}
                    placeholderTextColor='#bfbfbd'
                    secureTextEntry={hidePassword}
                    onChangeText={(text) => setPassword(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
                <Pressable onPress={() => setHidePassword(!hidePassword)} style={{ padding: 5 }}>
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} size={16} />
                </Pressable>
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                passwordErrorMsg.length != 0 ?
                    <I18NText text={passwordErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <Pressable
                style={{
                    position: 'relative', marginTop: 45, backgroundColor: '#e8be41', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => onSignUp()} >

                <I18NText text='Sign Up' style={{ color: 'white' }} />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>
        </TransparentView>
    )
})

export type SignupScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
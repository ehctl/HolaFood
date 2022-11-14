import { useCallback, useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome, FontAwesome2 } from '../../base/FontAwesome';
import { I18NText, Text } from '../../base/Text';
import { TextInput } from 'react-native'
import { TransparentView, View } from '../../base/View';
import { setUserApiToken, UserType } from '../../redux/Reducer';
import { AuthenticationMode } from './AuthenticationMode';
import { isValidEmail, isValidNormalText, isValidPassword, isValidPhoneNumber } from '../../validation/validate';
import { signup } from '../../core/apis/Requests';
import { useDispatch } from 'react-redux';
import { Constant } from '../../utils/Constant';
import { mapResponseToUserInfo } from '../../hooks/usePrefetchedData';
import { setUserInfo } from '../../redux/Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveApiTokenInfoLocalStorage, saveUserInfoLocalStorage } from '../../utils/Utils';
import { useLanguage } from '../../base/Themed';

export const Signup = (props: SignupScreenProp) => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [emailErrorMsg, setEmailErrorMsg] = useState('')

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
    const I18NOverLoad = useLanguage('System overloaded. Please wait for a moment.')
    const I18NFirstName = useLanguage('First Name')
    const I18NLastName = useLanguage('Last Name')
    const I18NPassword = useLanguage('Password')
    const I18NPhoneNumber = useLanguage('Phone Number')

    const onLoginSuccess = useCallback(async (response) => {
        const token = response.token
        const userInfo = mapResponseToUserInfo(response.data)
        dispatch(setUserApiToken(token))
        dispatch(setUserInfo(userInfo))
        saveApiTokenInfoLocalStorage(token)
        saveUserInfoLocalStorage(userInfo)
        props.onSuccess('user')
    }, [])

    const onSignUp = useCallback(() => {
        const emailValidate = isValidEmail(email)
        const firstNameValidate = isValidNormalText(firstName)
        const lastNameValidate = isValidNormalText(lastName)
        const passwordValidate = isValidPassword(password)
        const phoneNumberValidate = isValidPhoneNumber(phoneNumber)

        if (!emailValidate.qualify || !passwordValidate.qualify || !firstNameValidate.qualify || !lastNameValidate.qualify || (phoneNumber.length == 0 || phoneNumberValidate.qualify)) {
            setEmailErrorMsg(emailValidate.message)
            setFirstNameErrorMsg(firstNameValidate.message)
            setLastNameErrorMsg(lastNameValidate.message)
            setPasswordErrorMsg(passwordValidate.message)
            setPhoneNumberErrorMsg(phoneNumber.length == 0 ? '' : phoneNumberValidate.message)
        } else {
            setLoading(true)
            signup(
                firstName,
                lastName,
                password,
                email,
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

    }, [email, firstName, lastName, password])

    return (
        <View style={{
            backgroundColor: 'grey', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5,
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        }}>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='envelope' color='#62c7db' size={17} />
                <TextInput
                    placeholder='Email ﹡'
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setEmail(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                emailErrorMsg.length != 0 ?
                    <I18NText text={emailErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome2 name='format-list-numbered' color='#62c7db' size={17} />
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
                <FontAwesome2 name='format-list-numbered' color='#62c7db' size={17} />
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
                <FontAwesome name='phone' color='#62c7db' size={20} />
                <TextInput
                    placeholder={I18NPhoneNumber}
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
                <FontAwesome name='lock' color='#62c7db' size={26} />
                <TextInput
                    placeholder={I18NPassword + ' ﹡'}
                    placeholderTextColor='#bfbfbd'
                    secureTextEntry={hidePassword}
                    onChangeText={(text) => setPassword(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
                <Pressable onPress={() => setHidePassword(!hidePassword)} style={{ padding: 5 }}>
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} color='#0793a8' size={16} />
                </Pressable>
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            {
                passwordErrorMsg.length != 0 ?
                    <I18NText text={passwordErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} numberOfLines={2} /> : null
            }

            <Pressable
                style={{
                    position: 'relative', marginTop: 45, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => onSignUp()} >

                <I18NText text='Sign Up' />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>


            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <I18NText text='or' style={{ marginHorizontal: 5 }} />
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
            </TransparentView>

            <Pressable
                style={{
                    position: 'relative', backgroundColor: 'grey', paddingVertical: 10, borderRadius: 10, shadowColor: "#000", marginTop: 20,
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => props.changeMode(AuthenticationMode.LOGIN)} >

                <I18NText text='Login' />
            </Pressable>
        </View>
    )
}

export type SignupScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
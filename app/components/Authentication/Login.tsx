import { useCallback, useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome } from '../../base/FontAwesome';
import { I18NText, Text } from '../../base/Text';
import { TransparentView, View } from '../../base/View';
import { setUserApiToken, setUserInfo, UserType } from '../../redux/Reducer';
import { getStyle, saveApiTokenInfoLocalStorage, saveUserInfoLocalStorage } from '../../utils/Utils';
import { AuthenticationMode } from './AuthenticationMode';
import { TextInput } from 'react-native'
import { useLanguage } from '../../base/Themed';
import { validateLoginInfo } from '../../validation/validate';
import { login } from '../../core/apis/Requests';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constant } from '../../utils/Constant';
import { mapResponseToUserInfo } from '../../hooks/usePrefetchedData';


export const Login = (props: LoginScreenProp) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('tuanlinh29718@gmail.com')
    const [password, setPassword] = useState('123')
    const [loading, setLoading] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)
    const [errorMsg, setErroMsg] = useState('')

    const I18NPassword = useLanguage('Password')

    const onLoginSuccess = useCallback(async (response) => {
        const token = response.token
        const userInfo = mapResponseToUserInfo(response.data)
        dispatch(setUserApiToken(token))
        dispatch(setUserInfo(userInfo))
        saveApiTokenInfoLocalStorage(token)
        saveUserInfoLocalStorage(userInfo)
        props.onSuccess('user')
    }, [])

    const onLogin = useCallback(() => {
        setLoading(true)
        login(
            email,
            password,
            (response) => {
                onLoginSuccess(response)
                setLoading(false)
            },
            (e) => {
                setErroMsg('Email or Password is invalid')
                setLoading(false)
            }
        )

    }, [email, password])

    return (

        <View style={{
            backgroundColor: 'grey', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            opacity: 0.98
        }}>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesome name='envelope' color='#62c7db' size={17} style={{ marginLeft: 5 }} />
                <TextInput
                    placeholder='Email'
                    placeholderTextColor='#bfbfbd'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />
            </TransparentView>

            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <FontAwesome name='lock' color='#62c7db' size={26} style={{ marginLeft: 5 }} />

                <TextInput
                    placeholder={I18NPassword}
                    value={password}
                    secureTextEntry={hidePassword}
                    maxLength={30}
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setPassword(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18, color: 'white' }} />

                <Pressable onPress={() => setHidePassword(!hidePassword)} style={{ padding: 5 }}>
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} color='#0793a8' size={16} />
                </Pressable>
            </TransparentView>

            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />
            {
                errorMsg ?
                    <Text text={errorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 5 }} /> : null
            }

            <Pressable
                style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 15 }}
                onPress={() => { props.changeMode(AuthenticationMode.FORGOT_PASSWORD) }}>

                <I18NText text='Forgot Password' style={{ fontSize: 18, fontWeight: '400', color: '#bfbfbd' }} />
                <I18NText text=' ?' style={{ fontSize: 18, fontWeight: '400', color: '#bfbfbd' }} />
            </Pressable>

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
                onPress={() => onLogin()} >

                <I18NText text='Login as User' />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>

            <Pressable
                style={{
                    marginTop: 10, backgroundColor: '#6aabd9', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => { props.onSuccess('shipper') }} >

                <I18NText text='Login as Shipper' />
            </Pressable>

            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <I18NText text='or' style={{ marginHorizontal: 5 }} />
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
            </TransparentView>

            <Button
                onPress={() => {
                    props.changeMode(AuthenticationMode.SINGUP)
                }}
                text='Sign Up'
                style={{ alignSelf: 'center', marginTop: 20, backgroundColor: 'grey' }} />
        </View>
    )
}

export type LoginScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
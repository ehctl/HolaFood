import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { FontAwesome } from '../../base/FontAwesome';
import { I18NText } from '../../base/Text';
import { TransparentView, View } from '../../base/View';
import { setUserApiToken, setUserInfo, setUserType, UserType } from '../../redux/Reducer';
import { getUserRole, saveApiTokenInfoLocalStorage, saveUserInfoLocalStorage } from '../../utils/Utils';
import { AuthenticationMode } from './AuthenticationMode';
import { TextInput } from 'react-native'
import { useLanguage } from '../../base/Themed';
import { addNotificationToken, login } from '../../core/apis/Requests';
import { useDispatch } from 'react-redux';
import { mapResponseToUserInfo, mapResponseToUserInfo1 } from '../../hooks/usePrefetchedData';
import { Constant } from '../../utils/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const Login = (props: LoginScreenProp) => {
    const dispatch = useDispatch()
    // const [email, setEmail] = useState('tuanlinh29718@gmail.com')
    // const [password, setPassword] = useState('123')
    // const [email, setEmail] = useState('dungkaka2000tq@gmail.com')
    const [email, setEmail] = useState('giaohang@gmail.com')
    const [password, setPassword] = useState('321')
    const [loading, setLoading] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)
    const [errorMsg, setErroMsg] = useState('')

    const I18NPassword = useLanguage('Password')

    const onLoginSuccess = useCallback(async (response) => {
        const token = response.token
        const userInfo = mapResponseToUserInfo1(response)
        const userType = getUserRole(userInfo.role)
        const notiToken = (await AsyncStorage.getItem(Constant.APP_NOTIFICATION_TOKEN)) ?? ''

        dispatch(setUserType(userType))
        dispatch(setUserApiToken(token))
        dispatch(setUserInfo(userInfo))
        saveApiTokenInfoLocalStorage(token)
        saveUserInfoLocalStorage(userInfo)

        if (userType == 'customer' && notiToken.length > 0) {
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

        props.onSuccess(userType)
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
                console.log(e)
                setErroMsg('Email or Password Is Invalid')
                setLoading(false)
            }
        )

    }, [email, password])

    return (

        <View style={{
            backgroundColor: '#7a7a79', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            opacity: 0.98
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10, paddingVertical: 5 }}>
                <I18NText text='Login' style={{ alignSelf: 'center', color: 'white', fontSize: 22, fontWeight: '500' }} />
            </TransparentView>

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
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} size={16} />
                </Pressable>
            </TransparentView>

            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />
            {
                errorMsg ?
                    <I18NText text={errorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 5 }} /> : null
            }

            <Pressable
                style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 15 }}
                onPress={() => { props.changeMode(AuthenticationMode.FORGOT_PASSWORD) }}>

                <I18NText text='Forgot Password' style={{ fontSize: 18, fontWeight: '400', color: '#bfbfbd' }} />
                <I18NText text=' ?' style={{ fontSize: 18, fontWeight: '400', color: '#bfbfbd' }} />
            </Pressable>

            <Pressable
                style={{
                    position: 'relative', marginTop: 45, backgroundColor: '#3199ad', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => onLogin()} >

                <I18NText text='Login' style={{ color: 'white' }} />

                <ActivityIndicator
                    animating={loading}
                    color='black'
                    style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} />
            </Pressable>

            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <I18NText text='or' style={{ marginHorizontal: 5, color: 'white' }} />
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
            </TransparentView>

            <Pressable
                style={{
                    position: 'relative', marginTop: 25, backgroundColor: 'grey', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => props.changeMode(AuthenticationMode.SINGUP)} >

                <I18NText text='Sign Up' style={{ color: 'white' }} />

            </Pressable>
        </View>
    )
}

export type LoginScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
import { useCallback, useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome } from '../../base/FontAwesome';
import { I18NText, Text } from '../../base/Text';
import { TextInput } from 'react-native'
import { TransparentView, View } from '../../base/View';
import { UserType } from '../../redux/Reducer';
import { AuthenticationMode } from './AuthenticationMode';
import { resetPassword } from '../../core/apis/Requests';
import { isValidEmail } from '../../validation/validate';

export const ForgotPassword = (props: SignupScreenProp) => {
    const [email, setEmail] = useState('')
    const [emailErrorMsg, setEmailErrorMsg] = useState('')

    const [loading, setLoading] = useState(false)
    const [sentLinkToEmail, setSentLinkToEmail] = useState(false)

    const onForgetPassword = useCallback(() => {
        const emailValidate = isValidEmail(email)
        setSentLinkToEmail(false)

        if (emailValidate.qualify) {
            setLoading(true)
            resetPassword(
                email,
                (response) => {
                    setSentLinkToEmail(true)
                    setLoading(false)
                    setEmailErrorMsg('')
                },
                (e) => {
                    setLoading(false)
                    console.log(e)
                    setEmailErrorMsg(e.message ?? e)
                }
            )
        } else {
            setEmailErrorMsg(emailValidate.message)
        }
    }, [email])

    return (
        <View style={{
            backgroundColor: 'grey', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5,
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        }}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10, paddingVertical: 5 }}>
                <I18NText text='Forgot Password' style={{ alignSelf: 'center', color: 'white', fontSize: 22, fontWeight: '500' }} />
            </TransparentView>

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
                sentLinkToEmail ?
                    <I18NText
                        text='We Have Sent A Reset Password Link To Your Email. Please Check Your Email'
                        style={{ textAlign: 'left', color: 'white', marginTop: 10 }} />
                    : null
            }

            {
                emailErrorMsg.length != 0 ?
                    <I18NText text={emailErrorMsg} style={{ color: '#cc1818', textAlign: 'left', marginTop: 3 }} /> : null
            }

            <Pressable
                style={{
                    position: 'relative', marginTop: 25, backgroundColor: '#e8be41', paddingVertical: 10, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                }}
                onPress={() => onForgetPassword()} >

                <I18NText text='Forgot Password' style={{ color: 'white' }} />

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
                onPress={() => props.changeMode(AuthenticationMode.LOGIN)} >

                <I18NText text='Login' style={{ color: 'white' }} />
            </Pressable>
        </View>
    )
}

export type SignupScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
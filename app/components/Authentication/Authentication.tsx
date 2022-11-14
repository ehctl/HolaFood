import React from 'react';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { View, ViewProps } from '../../base/View';
import { getStyle } from '../../utils/Utils';
import { Login } from './Login';
import { Signup } from './Signup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackRoot } from '../../navigation/AppNavigation';
import { AuthenticationMode } from './AuthenticationMode';
import { setUserType, UserType } from '../../redux/Reducer';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image'
import { Text } from '../../base/Text';
import { ForgotPassword } from './ForgotPassword';

export const AuthenticationScreen = React.memo(({ navigation }: any) => {
    return (
        <View style={[getStyle().flex_c_s,]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, position: 'relative', justifyContent: 'space-between' }} >
                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '100%', aspectRatio: 1 }}>
                    <Image style={{ flex: 1, height: null, width: null }}
                        source={require('../../../assets/images/food_background.jpg')} />
                </View>

                <View />
                <SmallModule style={{ backgroundColor: 'transparent', margin: 20 }} />
            </KeyboardAvoidingView>
        </View>
    )
})




export const SmallModule = React.memo((props: ViewProps) => {
    const [mode, setMode] = useState(AuthenticationMode.LOGIN)
    const { replace } = useNavigation<NativeStackNavigationProp<StackRoot>>()
    const dispatch = useDispatch()

    const changeMode = (mode) => {
        setMode(mode)
    }

    const onSucces = (userType: UserType) => {
        dispatch(setUserType(userType))
        replace('Root')
    }

    const getAuthenComp = (mode: AuthenticationMode) => {
        switch (mode) {
            case AuthenticationMode.LOGIN:
                return <Login
                    changeMode={changeMode}
                    onSuccess={onSucces} />
            case AuthenticationMode.SINGUP:
                return <Signup
                    changeMode={changeMode}
                    onSuccess={onSucces} />
            case AuthenticationMode.FORGOT_PASSWORD:
                return <ForgotPassword
                    changeMode={changeMode}
                    onSuccess={onSucces} />
        }
    }

    return (
        <View style={props.style}>
            {
                getAuthenComp(mode)
            }
        </View>
    )
})

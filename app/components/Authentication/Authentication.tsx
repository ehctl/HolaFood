import React from 'react';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { View, ViewProps } from '../../base/View';
import { getStyle } from '../../utils/Utils';
import { LoginScreen } from './Login';
import { SignupScreen } from './Signup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackRoot } from '../../navigation/AppNavigation';
import { AuthenticationMode } from './AuthenticationMode';
import { setUserType, UserType } from '../../redux/Reducer';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image'
import { Text } from '../../base/Text';

export const AuthenticationScreen = React.memo(({ navigation }: any) => {
    return (
        <View style={[getStyle().flex_c_s,]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, position: 'relative', justifyContent: 'space-between' }} >
                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '100%', aspectRatio: 1 }}>
                    <Image style={{ flex: 1, height: null, width: null }}
                        source={require('./styles/images/food_background.jpg')} />
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

    return (
        <View style={props.style}>
            {
                mode == AuthenticationMode.LOGIN
                    ? <LoginScreen
                        changeMode={mode => setMode(mode)}
                        onSuccess={(userType: UserType) => {
                            dispatch(setUserType(userType))
                            replace('Root')
                        }} />
                    : <SignupScreen
                        changeMode={mode => setMode(mode)}
                        onSuccess={(userType: UserType) => {
                            dispatch(setUserType(userType))
                            replace('Root')
                        }} />
            }
        </View>
    )
})

import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../components/Button';
import { FontAwesome } from '../../components/FontAwesome';
import { TransparentText, Text } from '../../components/Text';
import { TextInput } from '../../components/TextInput';
import { TransparentView, View } from '../../components/View';
import { getStyle } from '../../utils/Utils';
import { AuthenticationMode } from './AuthenticationMode';

export const LoginScreen = (props: LoginScreenProp) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)


    return (

        <View style={{
            backgroundColor: 'grey', borderRadius: 15, paddingHorizontal: 10, paddingBottom: 40, paddingTop: 5, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        }}>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='envelope' color='#62c7db' size={17} style={{ marginLeft: 5 }} />
                <TextInput
                    placeholder='Username / Email' onChangeText={(text) => setUsername(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0 }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='lock' color='#62c7db' size={26} style={{ marginLeft: 5 }} />
                <TextInput
                    placeholder='Password' secureTextEntry={hidePassword} maxLength={30}
                    onChangeText={(text) => setPassword(text)} style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0 }} />
                <Pressable onPress={() => setHidePassword(!hidePassword)} style={{ padding: 5 }}>
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} color='black' size={16} />
                </Pressable>
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <Button
                onPress={() => {
                    props.onSuccess()
                }}
                text='Login'
                style={{ alignSelf: 'center', marginTop: 10 }} />

            <ActivityIndicator animating={loading} size='large' />

            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <TransparentText text='or' style={{ marginHorizontal: 5 }} />
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
            </TransparentView>

            <Button
                onPress={() => {
                    props.changeMode(AuthenticationMode.SINGUP)
                }}
                text='Sign Up'
                style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'grey' }} />
        </View>
    )
}

export type LoginScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: () => void
}
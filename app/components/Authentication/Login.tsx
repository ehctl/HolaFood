import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome } from '../../base/FontAwesome';
import { Text } from '../../base/Text';
import { TransparentView, View } from '../../base/View';
import { UserType } from '../../redux/Reducer';
import { getStyle } from '../../utils/Utils';
import { AuthenticationMode } from './AuthenticationMode';
import { TextInput } from 'react-native'


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
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18 }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='lock' color='#62c7db' size={26} style={{ marginLeft: 5 }} />
                <TextInput
                    placeholder='Password' secureTextEntry={hidePassword} maxLength={30}
                    onChangeText={(text) => setPassword(text)} style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18  }} />
                <Pressable onPress={() => setHidePassword(!hidePassword)} style={{ padding: 5 }}>
                    <FontAwesome name={hidePassword ? 'eye-slash' : 'eye'} color='black' size={16} />
                </Pressable>
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <Button
                onPress={() => {
                    props.onSuccess('user')
                }}
                text='Login as User'
                style={{ alignSelf: 'center', marginTop: 10, }} />

            <Button
                onPress={() => {
                    props.onSuccess('shipper')
                }}
                text='Login as Shipper'
                style={{ alignSelf: 'center', marginTop: 10 }} />

            <ActivityIndicator animating={loading} size='large' />

            <TransparentView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ height: 0.5, flexGrow: 0.5 }} />
                <Text text='or' style={{ marginHorizontal: 5 }} />
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
    onSuccess: (userType: UserType) => void
}
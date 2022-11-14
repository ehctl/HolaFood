import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { Button } from '../../base/Button';
import { FontAwesome } from '../../base/FontAwesome';
import { I18NText, Text } from '../../base/Text';
import { TextInput } from 'react-native'
import { TransparentView, View } from '../../base/View';
import { UserType } from '../../redux/Reducer';
import { AuthenticationMode } from './AuthenticationMode';

export const ForgotPassword = (props: SignupScreenProp) => {
    const [email, setEmail] = useState('')

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
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='envelope' color='#62c7db' size={17} />
                <TextInput
                    placeholder='Email'
                    placeholderTextColor='#bfbfbd'
                    onChangeText={(text) => setEmail(text)}
                    style={{ flexGrow: 1, backgroundColor: 'transparent', borderWidth: 0, padding: 10, fontSize: 18 }} />
            </TransparentView>
            <View style={{ height: 0.5, backgroundColor: '#62c7db' }} />

            <Button
                onPress={() => {
                    props.onSuccess('shipper')
                }}
                text='Forgot Password'
                style={{ alignSelf: 'center', marginTop: 45 }} />

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

export type SignupScreenProp = {
    changeMode: (mode: AuthenticationMode) => void,
    onSuccess: (userType: UserType) => void
}
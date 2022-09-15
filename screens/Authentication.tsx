import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { View } from '../components/View';
import { getStyle } from '../utils/Utils';

export const Authentication = ({ navigation }: any) => {
    const [authenMode, setAuthenMode] = useState(AuthenticationMode.LOGIN)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <View style={getStyle().flex_c_s}>
            <TextInput placeholder='Username / Email' onChangeText={(text) => setUsername(text)} />
            <TextInput placeholder='Password' secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>

            <ActivityIndicator animating={true} size='large' />
            <Button 
                onPress={() => {
                    navigation.replace('Root')
                }}
                text='Go to main page' 
                style={{alignSelf: 'center' }}/>
        </View>
    )
}

enum AuthenticationMode {
    LOGIN,
    REGISTER,
    RESET_PASSWORD
}
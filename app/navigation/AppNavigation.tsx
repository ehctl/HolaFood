import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AuthenticationScreen as Authentication } from '../components/Authentication/Authentication';
import { AppState, setUserInfo } from '../redux/Reducer';
import { Constant } from '../utils/Constant';
import { Root } from './StackGroup';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator<StackRoot>();

export const AppNavigation = React.memo(() => {
    const dispatch = useDispatch()
    const appState = useSelector((state: AppState) => {
        return ({
            userInfo: state.userInfo
        })
    })

    const updateUserInfo = useCallback(async () => {
        try {
            const userInfo = JSON.parse(await AsyncStorage.getItem(Constant.APP_USER_INFO))
            dispatch(setUserInfo(userInfo))
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        if (!appState.userInfo) {
            updateUserInfo()
        } 
    }, [appState.userInfo])

    return (
        <Stack.Navigator initialRouteName={appState.userInfo ? 'Root' : 'Authentication'} >
            <Stack.Screen
                name='Authentication'
                component={Authentication}
                options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen
                name='Root'
                component={Root}
                options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Navigator>
    )
})

export type StackRoot = {
    Authentication: undefined;

    Root: undefined;
};

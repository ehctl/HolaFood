import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Authentication } from '../screens/Authentication';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Reducer';
import React from 'react';
import { Root } from './StackGroup';

const Stack = createNativeStackNavigator();

export const AppNavigation = React.memo(() => {
    const props = useSelector((state: AppState) => {
        return {
            theme: state.theme
        }
    })

    return (
        <NavigationContainer
            theme={props.theme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName='Login' >
                <Stack.Screen
                    name='Authentication'
                    component={Authentication}
                    options={{ headerShown: false, animation: 'fade' }} />
                <Stack.Screen
                    name='Root'
                    component={Root}
                    options={{ headerShown: false, animation: 'fade' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
})
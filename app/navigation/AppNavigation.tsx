import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthenticationScreen as Authentication } from '../components/Authentication/Authentication';
import { Root } from './StackGroup';

const Stack = createNativeStackNavigator<StackRoot>();

export const AppNavigation = React.memo(() => {

    return (
        <Stack.Navigator initialRouteName='Authentication' >
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

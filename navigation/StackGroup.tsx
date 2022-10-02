import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingScreen } from '../screens/Setting/Setting';
import { WebView } from '../components/WebView';
import { SearchScreen as Search } from '../screens/Search';
import { BottomTabNavigator } from './BottomTabBar';
import { DummbScreen } from '../screens/Dumm';
import React from 'react';
import { LanguageScreen } from '../screens/Setting/Languague';
import { LoginScreen } from '../screens/Authentication/Login';
import { SignupScreen } from '../screens/Authentication/Signup';
import { FoodDetailScreen } from '../screens/FoodDetail/FoodDetail';


const Stack = createNativeStackNavigator<GroupStackParamList>();

export const Root = React.memo(() => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name='RootTab'
                component={BottomTabNavigator} options={{ headerShown: false, animation: 'fade' }} />

            <Stack.Screen name='Setting' component={SettingScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name='WebView' component={WebView} options={{ animation: 'slide_from_bottom', }} />
            <Stack.Screen name='Search' component={Search} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='Dummb' component={DummbScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='Language' component={LanguageScreen} options={{ animation: 'slide_from_right', }} />
            <Stack.Screen name='FoodDetail' component={FoodDetailScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
        </Stack.Navigator>
    )
})

export type GroupStackParamList = {
    RootTab: undefined;

    Setting: undefined;

    WebView: { uri: string };

    Search: undefined;

    Dummb: undefined;

    Language: undefined;

    FoodDetail: undefined;
};


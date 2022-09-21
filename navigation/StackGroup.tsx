import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { Mock } from '../screens/Mock';
import { Setting } from '../screens/Setting/Setting';
import { WebView } from '../components/WebView';
import { SearchScreen as Search } from '../screens/Search';
import { BottomTabNavigator } from './BottomTabBar';
import { DummbScreen } from '../screens/Dumm';
import React from 'react';
import { LanguageScreen } from '../screens/Setting/Languague';


const Stack = createNativeStackNavigator<GroupStackParamList>();

export const Root = React.memo(() => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name='RootTab'
                component={BottomTabNavigator} options={{ headerShown: false, animation: 'fade' }}   />

            <Stack.Screen name='Setting' component={Setting} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name='Mock' component={Mock} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='WebView' component={WebView} options={{ animation: 'slide_from_bottom', }} />
            <Stack.Screen name='Search' component={Search} options={{ animation: 'slide_from_right', headerShown: false}} />
            <Stack.Screen name='Dummb' component={DummbScreen} options={{ animation: 'slide_from_right', headerShown: false}} />
            <Stack.Screen name='Language' component={LanguageScreen} options={{ animation: 'slide_from_right', }} />
        </Stack.Navigator>
    )
})

export type GroupStackParamList = {
    RootTab: undefined;

    Setting: undefined;

    Mock: { data: Array<string> };

    WebView: { uri: string };

    Search: undefined;

    Dummb: undefined;

    Language: undefined;
};


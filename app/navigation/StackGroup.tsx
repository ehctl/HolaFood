import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingSection } from '../components/Menu/SettingSection';
import { WebView } from '../base/WebView';
import { SearchScreen as Search } from '../components/Search';
import { BottomTabNavigator } from './BottomTabBar';
import React from 'react';
import { LanguageScreen } from '../components/Menu/LanguageScreen';
import { FoodDetailScreen } from '../components/FoodDetail/FoodDetailScreen';
import { FoodListScreen } from '../components/FoodList/FoodListScreen';
import { AccountScreen } from '../components/Menu/AccountScreen';
import { ShopDetail } from '../components/ShopDetail';
import { FAQScreen } from '../components/Menu/FAQScreen';


const Stack = createNativeStackNavigator<GroupStackParamList>();

export const Root = React.memo(() => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name='RootTab'
                component={BottomTabNavigator} options={{ headerShown: false, animation: 'fade' }} />

            <Stack.Screen name='WebView' component={WebView} options={{ animation: 'slide_from_bottom', }} />
            <Stack.Screen name='Search' component={Search} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='Language' component={LanguageScreen} options={{ animation: 'slide_from_right', }} />
            <Stack.Screen name='FoodDetail' component={FoodDetailScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='FoodList' component={FoodListScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='Account' component={AccountScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='ShopDetail' component={ShopDetail} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='FAQScreen' component={FAQScreen} options={{ animation: 'slide_from_right', headerShown: false }} />
        </Stack.Navigator>
    )
})

export type GroupStackParamList = {
    RootTab: undefined;

    WebView: { uri: string };

    Search: undefined;

    Language: undefined;

    FoodDetail: undefined;

    ShopDetail: undefined;

    FoodList: { type: string};

    Account: undefined;

    FAQScreen: undefined;
};


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingSection } from '../components/Menu/SettingSection';
import { WebView } from '../base/WebView';
import { SearchScreen as Search } from '../components/Search';
import { BottomTabNavigator } from './BottomTabBar';
import React, { useEffect } from 'react';
import { LanguageScreen } from '../components/Menu/LanguageScreen';
import { FoodDetailData, FoodDetailScreen } from '../components/FoodDetail/FoodDetailScreen';
import { FoodListScreen } from '../components/FoodList/FoodListScreen';
import { AccountScreen } from '../components/Menu/AccountScreen';
import { ShopDetail } from '../components/ShopDetail';
import { FAQScreen } from '../components/Menu/FAQScreen';
import { AddToCartScreen } from '../components/FoodDetail/AddToCartScreen';
import { CartItemData } from '../components/Order/Cart';
import { OrderData } from '../components/Order/OrderItem';
import { OrderDetail } from '../components/Order/OrderDetail';
import { OrderHistoryScreen } from '../components/Menu/OrderHistoryScreen';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Reducer';
import { AddToOrderScreen } from '../components/FoodDetail/AddToOrderScreen';
import { AddAddressScreen } from '../components/Menu/AccountScreen/AddAddressScreen';


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
            <Stack.Screen name='AddToCart' component={AddToCartScreen} options={{ animation: 'slide_from_bottom', headerShown: false }} />
            <Stack.Screen name='AddToOrder' component={AddToOrderScreen} options={{ animation: 'slide_from_bottom', headerShown: false }} />
            <Stack.Screen name='OrderDetail' component={OrderDetail} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='OrderHistory' component={OrderHistoryScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name='AddAddress' component={AddAddressScreen} options={{ animation: 'slide_from_bottom', headerShown: false }} />
        </Stack.Navigator>
    )
})

export type GroupStackParamList = {
    RootTab: undefined;

    WebView: { uri: string };

    Search: { keyword: string };

    Language: undefined;

    FoodDetail: { itemId: number };

    ShopDetail: { shopId: number };

    FoodList: { type: string };

    Account: undefined;

    FAQScreen: undefined;

    AddToCart: {
        isUpdateMode?: boolean,
        foodDetail?: FoodDetailData,
        cartItemDetail?: CartItemData
    };

    AddToOrder: {
        cartItems: CartItemData[],
        usingNewCartItem: boolean,
    };

    OrderDetail: {
        data: OrderData
    };

    OrderHistory: undefined,

    AddAddress: undefined
};


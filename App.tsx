import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Notification from './app/notification/Notification';
import { AppNavigation } from './app/navigation/AppNavigation';
import Colors from './app/constants/Colors';
import useColorScheme from './app/hooks/useColorScheme';
import { createStore } from "redux";
import { AppLanguage, changeApplicationState, changeLanguage, changeTheme, reducer, setUserInfo, setUserType } from './app/redux/Reducer';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppState } from './app/redux/Reducer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import { AppState as ApplicationState } from 'react-native';
import { Constant } from './app/utils/Constant';
import usePrefetchedData from './app/hooks/usePrefetchedData';
import { getLocale, getUserRole } from './app/utils/Utils';
import Warehouse from './app/utils/Warehouse';
import React from 'react';
import { NavigationContainer, useNavigationContainerRef, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { View, Image } from 'react-native'
import * as SplashScreen from 'expo-splash-screen';
import { Dimensions } from 'react-native';
import { Toast, ToastWrapper } from './app/base/Toast';



export default function App() {
  const { isLoadingComplete } = usePrefetchedData();
  const store = createStore(reducer)

  return (
    isLoadingComplete ?
      <Provider store={store}>
        <AppRoot />
      </Provider>
      : null
  );
}


const AppRoot = React.memo(() => {
  const dispatch = useDispatch()
  const osColorScheme = useColorScheme()
  const props = useSelector((state: AppState) => ({
    appState: state.applicationState,
    theme: state.theme,
    userInfo: state.userInfo
  }))

  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const appStateListener = useRef(null);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    // set up notification
    const loadStoredData = async () => {
      try {
        // setup notification
        Notification.getInstance().registerForPushNotificationsAsync().then(token => Notification.getInstance().setExpoToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          Notification.getInstance().newNotification(dispatch, notification)
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          if (response.notification.request.content.data?.type == "OrderStatusChange")
            // navigationRef.current.navigate('Notification' as never, { needRefresh: true } as never)
            navigationRef.current.navigate('OrderDetail' as never, { orderId: response.notification.request.content.data.orderId } as never)
        });

        try {
          const userInfo = JSON.parse(await AsyncStorage.getItem(Constant.APP_USER_INFO))
          dispatch(setUserInfo(userInfo))
          if (userInfo.role)
            dispatch(setUserType(getUserRole(userInfo.role)))
        } catch (e) {
          dispatch(setUserInfo(undefined))
        }

        // setup darkmode
        const value = await AsyncStorage.getItem(Constant.APP_THEME);
        const darkMode = value !== null ? (value === Constant.APP_DARK_THEME ? true : false) : (osColorScheme === Constant.APP_DARK_THEME ? true : false)
        dispatch(changeTheme(darkMode ? Constant.APP_DARK_THEME : Constant.APP_LIGHT_THEME))

        // setup locale
        const locale = await AsyncStorage.getItem(Constant.APP_LOCALE) ?? 'vi'
        dispatch(changeLanguage(locale as AppLanguage))

        // tracking app state : [inactive(ios only), background, active]
        appStateListener.current = ApplicationState.addEventListener("change", nextAppState => {
          Warehouse.getInstance().setAppState(nextAppState)

          props.appState = nextAppState;
          dispatch(changeApplicationState(props.appState))
        });

      } catch (err) {
        console.log(`Error: ${err}`)
      }
    }

    loadStoredData()

    return () => {
      appStateListener.current.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: Colors[props.theme].background, flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor={Colors[props.theme].background}
          barStyle={props.theme !== 'dark' ? 'dark-content' : 'light-content'} />
        <ToastWrapper>
          <NavigationContainer
            ref={navigationRef}
            theme={props.theme === 'dark' ? DarkTheme : DefaultTheme}>
            <AppNavigation />
            <Toast />
          </NavigationContainer>
        </ToastWrapper>
      </SafeAreaView>
    </SafeAreaProvider >
  )
})

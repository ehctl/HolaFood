import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Notification from './notification/Notification';
import { AppNavigation } from './navigation/AppNavigation';
import Colors from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';
import { createStore } from "redux";
import { AppLanguage, changeApplicationState, changeLanguage, changeTheme, reducer } from './redux/Reducer';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppState } from './redux/Reducer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import { AppState as ApplicationState } from 'react-native';
import { Constant } from './utils/Constant';
import useCachedResources from './hooks/useCachedResources';
import { getLocale } from './utils/Utils';
import Warehouse from './utils/Warehouse';
import React from 'react';
import { NavigationContainer, useNavigationContainerRef, DefaultTheme, DarkTheme } from '@react-navigation/native';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

export default function App() {
  const isLoadingComplete = useCachedResources();
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
    theme: state.theme
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
          if (response.notification.request.content.data?.category == "order")
            navigationRef.current.navigate('Order', { needRefresh: true })
        });


        // setup darkmode
        const value = await AsyncStorage.getItem(Constant.APP_THEME);
        const darkMode = value !== null ? (value === Constant.APP_DARK_THEME ? true : false) : (osColorScheme === Constant.APP_DARK_THEME ? true : false)
        dispatch(changeTheme(darkMode ? Constant.APP_DARK_THEME : Constant.APP_LIGHT_THEME))

        // setup locale
        const locale = (await getLocale()).split('_')[0] as AppLanguage
        dispatch(changeLanguage(locale))

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
        <NavigationContainer
          ref={navigationRef}
          theme={props.theme === 'dark' ? DarkTheme : DefaultTheme}>
          <AppNavigation />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider >
  )
})

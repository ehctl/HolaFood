import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
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

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

const AppRoot = () => {
  const dispatch = useDispatch()
  const osColorScheme = useColorScheme()
  const props = useSelector((state: AppState) => ({
    appState: state.applicationState,
    theme: state.theme
  }))

  useEffect(() => {
    // set up notification
    const setUp = async () => {
      try {
        // setup notification
        Notification.getInstance().registerForPushNotificationsAsync().then(token => Notification.getInstance().setExpoToken(token));

        // setup darkmode
        const value = await AsyncStorage.getItem(Constant.APP_THEME);
        const darkMode = value !== null ? (value === 'dark' ? true : false) : (osColorScheme === 'dark' ? true : false)
        dispatch(changeTheme(darkMode ? 'dark' : 'light'))

        // setup locale
        const locale = (await getLocale()).split('_')[0] as AppLanguage
        dispatch(changeLanguage(locale))

        // tracking app state : [inactive(ios only), background, active]
        const subscription = ApplicationState.addEventListener("change", nextAppState => {
          props.appState = nextAppState;
          dispatch(changeApplicationState(props.appState))
        });

        return () => {
          subscription.remove();
        };
      } catch (err) {
        console.log(`Error: ${err}`)
      }
    }

    setUp()
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: Colors[props.theme].background, flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          backgroundColor={Colors[props.theme].background}
          barStyle={props.theme !== 'dark' ? 'dark-content' : 'light-content'} />
        <AppNavigation />
      </SafeAreaView>
    </SafeAreaProvider >
  )
}

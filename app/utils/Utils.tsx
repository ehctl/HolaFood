import AsyncStorage from "@react-native-async-storage/async-storage"
import { Animated, NativeModules, Platform, Pressable } from "react-native"
import { AppLanguage } from "../redux/Reducer"
import { Constant } from "./Constant"
import Warehouse from "./Warehouse"
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';



export const getStyle = () => Warehouse.getInstance().getStyle()

export const loadI18N = (lanaguage: AppLanguage, text: string) => {
  try {
    const translatedText = Warehouse.getInstance().getLanguage()[lanaguage][text]
    return translatedText ? translatedText : text
  } catch (e) {
    return text
  }
}

export const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export const isIosDevice = () => Platform.OS === 'ios'

export async function getLocale(): Promise<AppLanguage> {
  // if its ios device then using the os locale preference
  // android can have a custom locale, but first time using app both os using their locale
  var deviceLanguage =
    !isIosDevice() ? await AsyncStorage.getItem(Constant.APP_LOCALE) : null

  if (deviceLanguage == null) {
    deviceLanguage = Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier

    !isIosDevice() ? await AsyncStorage.setItem(Constant.APP_LOCALE, deviceLanguage) : null
  }

  return deviceLanguage as AppLanguage
}

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e: KeyboardEvent) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};


export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const getEnumKeyByEnumValue = (myEnum, enumValue) => {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}
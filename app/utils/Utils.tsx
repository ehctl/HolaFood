import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert, Animated, Linking, NativeModules, Platform, Pressable } from "react-native"
import { AppLanguage, UserInfo, UserType } from "../redux/Reducer"
import { Constant } from "./Constant"
import Warehouse from "./Warehouse"
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';
import { FontAwesome } from "@expo/vector-icons"
import { ShipCost } from "../components/FoodDetail/FoodDetailScreen"
import { startActivityAsync } from "expo-intent-launcher"



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
export const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome)

export const getEnumKeyByEnumValue = (myEnum, enumValue) => {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}

const format = (number, n, x, s, c) => {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = number.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

export const formatMoney = (price: number) => {
  return format(price, 0, 3, '.', '')
}

export const deleteInfoBeforeLogout = async () => {
  await AsyncStorage.setItem(Constant.APP_API_TOKEN, '')
  await AsyncStorage.setItem(Constant.APP_USER_INFO, '')
  // await AsyncStorage.setItem(Constant.APP_NOTIFICATION_TOKEN, '')
}

export const saveUserInfoLocalStorage = async (userInfo: UserInfo) => {
  await AsyncStorage.setItem(Constant.APP_USER_INFO, JSON.stringify(userInfo))
}

export const saveApiTokenInfoLocalStorage = async (token: string) => {
  console.log('API TOKEN', token)
  await AsyncStorage.setItem(Constant.APP_API_TOKEN, token)
}

export const reformatDateTime = (time: string) => {
  return time.slice(0, 19).replace(/-/g, "-").replace("T", " ")
}

export const formatDateTimeFromData = (time: string) => {
  const timeArr = time.split(' ')[0].split('-')
  return `${timeArr[2]}-${timeArr[1]}-${timeArr[0]}`
}

// YYYY-MM-DD HH:MM:SS
export const formatCreatedDateType = (time: Date) => {
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:${('0' + time.getSeconds()).slice(-2)}`
}

// HH:MM DD-MM-YYYY
export const formatCreatedDateType1 = (time: Date) => {
  return `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)} ${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`
}

// YYYY-MM-DD HH:MM
export const formatCreatedDateType2 = (time: Date) => {
  return `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} ${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`
}

export const formatAccountRole = (role: string) => {
  switch (role) {
    case 'ROLE_CUSTOMER':
      return 'Customer'
    case 'ROLE_SHIPPER':
      return 'Shipper'
    default:
      return role
  }
}

export const calculateShipFee = (distance: number, costPolicy: ShipCost[]) => {
  if (costPolicy.length < 3) {
    console.log(' costPolicy rong~~~')
    return 0
  }

  const distanceKM = distance / 1000

  if (0 < distanceKM && distanceKM <= 3)
    return costPolicy[0].price
  else if (3 < distanceKM && distanceKM <= 5)
    return costPolicy[1].price
  else
    return costPolicy[1].price + Math.ceil(distanceKM - 5) * costPolicy[2].price
}

export const getUserRole = (role: string): UserType => {
  if (role == 'ROLE_CUSTOMER')
    return 'customer'
  else if (role == 'ROLE_SHIPPER')
    return 'shipper'
  else {
    console.log('Unsupported user role')
  }
}

export const getUserRoleById = (role: number): string => {
  switch (role) {
    case 1:
      return 'Admin'
    case 2:
      return 'Customer'
    case 3:
      return 'Shop'
    case 4:
      return 'Shipper'
  }
}

export const openMapUtil = async (daddress: string, failureCallback?: () => void) => {
  if (isIosDevice())
    Linking.openURL('http://maps.google.com/maps/search/?api=1&query=' + daddress);
  else {
    try {
      const returnResult = await startActivityAsync("android.intent.action.VIEW", {
        packageName: "com.google.android.apps.maps",
        data: "geo:0,0?q=" + daddress
      })
      if (returnResult.resultCode != 0 && returnResult.resultCode != -1)
        throw "Error"
    } catch (e) {
      failureCallback()
    }
  }
}

export const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
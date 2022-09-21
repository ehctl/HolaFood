import AsyncStorage from "@react-native-async-storage/async-storage"
import { NativeModules, Platform } from "react-native"
import { AppLanguage } from "../redux/Reducer"
import { Constant } from "./Constant"
import Warehouse from "./Warehouse"

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

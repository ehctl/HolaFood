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
    var deviceLanguage =
        await AsyncStorage.getItem(Constant.APP_LOCALE)

    if (deviceLanguage == null) {
        deviceLanguage = Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier

        await AsyncStorage.setItem(Constant.APP_LOCALE, deviceLanguage)
    }

    return deviceLanguage as AppLanguage
}

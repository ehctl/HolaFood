import { AppLanguage } from "../redux/Reducer"
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

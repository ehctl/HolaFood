
import { shallowEqual, useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import { AppLanguage, AppState, AppTheme } from '../redux/Reducer';
import { loadI18N } from '../utils/Utils';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const themeState = useSelector((state: AppState) => ({
    theme: state.theme
  }), shallowEqual)
  const colorFromProps = props[themeState.theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[themeState.theme][colorName];
  }
}

export const useLanguage = (text: string | undefined): string => {
  const props = useSelector((state: AppState) => ({
    language: state.language
  }), shallowEqual)

  if (!text)
    return ''

  return loadI18N(props.language, text)
}

export const useTheme = (): AppTheme => {
  const theme = useSelector((state: AppState) => state.theme, shallowEqual)
  return theme
}

export const useLocale = (): AppLanguage => {
  const language = useSelector((state: AppState) => state.language)
  return language
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};







import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import { AppState, AppTheme } from '../redux/Reducer';
import { loadI18N } from '../Utils/Utils';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const themeState = useSelector((state: AppState) => ({
    theme: state.theme
  }))

  const colorFromProps = props[themeState.theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[themeState.theme][colorName];
  }
}

export const useLanguage = (text: string | undefined): string => {
  if (!text)
    return ''

  const props = useSelector((state: AppState) => ({
    language: state.language
  }))
  return loadI18N(props.language, text)
}

export const useTheme = (): AppTheme => {
  const themeProps = useSelector((state: AppState) => ({
    theme: state.theme
  }))

  return themeProps.theme
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};






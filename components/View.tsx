import { useThemeColor, ThemeProps } from "./Themed";
import { View as DefaultView } from 'react-native';
import { SafeAreaView as DefaultSafeAreaView } from "react-native";
import React from "react";

export const View = React.memo((props: ViewProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <DefaultView {...otherProps} style={[{ backgroundColor }, style]} />;
})

export const TransparentView = React.memo((props: ViewProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;

    return <DefaultView {...otherProps} style={[style, { backgroundColor: 'transparent' }]} />;
})

export const SafeAreaView = React.memo((props: ViewProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <DefaultSafeAreaView {...otherProps} style={[{ backgroundColor }, style]} />;
})

export type ViewProps = ThemeProps & DefaultView['props'];

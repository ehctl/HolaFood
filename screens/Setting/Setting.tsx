import { createDrawerNavigator } from '@react-navigation/drawer'
import { View } from '../../components/View'
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Linking, Switch } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { AppState, changeTheme } from '../../redux/Reducer';
import { useDispatch } from 'react-redux';
import { Constant } from '../../utils/Constant';
import { changeLanguage } from '../../redux/Reducer';
import { useEffect, useLayoutEffect, useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Level2Header } from '../../components/Headers/Level2Header';
import { getStyle } from '../../utils/Utils';
import React from 'react';

export const Setting = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch()
    const props = useSelector((state: AppState) => ({
        theme: state.theme,
        language: state.language
    }))

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (_: NativeStackHeaderProps) => <Level2Header title='Setting' />
        })
    })

    const darkModeToggleSwitch = async (switchValue: boolean) => {
        setDarkMode(previousState => !previousState)
        const theme = switchValue ? 'dark' : 'light'
        dispatch(changeTheme(theme))
        await AsyncStorage.setItem(Constant.APP_THEME, theme)
    };

    const [isDarkMode, setDarkMode] = useState(props.theme === 'dark');
    return (
        <View style={getStyle().flex_c_s}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }, getStyle().defaultButton]}>
                <Text style={{ marginHorizontal: 20 }} text='Dark Mode' />
                <Switch
                    trackColor={{ false: "green", true: "orange" }}
                    thumbColor={isDarkMode ? "white" : "black"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={darkModeToggleSwitch}
                    value={isDarkMode} />
            </View>
            <Button text={`Change App Language`}
                onPress={
                    // () => navigation.navigate('Language')
                    () => Linking.openSettings()
                }
            />
            <Button text={`Log out`}
                onPress={() => navigation.replace('Authentication')}
            />
        </View>
    )

})
import { TransparentView, View } from '../../../base/View'
import { Button } from '../../../base/Button';
import { I18NText, Text } from '../../../base/Text';
import { Linking, Pressable, Switch } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { AppState, changeTheme } from '../../../redux/Reducer';
import { useDispatch } from 'react-redux';
import { Constant } from '../../../utils/Constant';
import { useState } from "react";
import React from 'react';
import { FontAwesome, FontAwesome2 } from '../../../base/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../../base/Toast';

export const SettingSection = React.memo(() => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const props = useSelector((state: AppState) => ({
        theme: state.theme,
        language: state.language
    }))

    const darkModeToggleSwitch = async (switchValue: boolean) => {
        setDarkMode(previousState => !previousState)
        const theme = switchValue ? 'dark' : 'light'
        dispatch(changeTheme(theme))
        await AsyncStorage.setItem(Constant.APP_THEME, theme)
    };

    const [isDarkMode, setDarkMode] = useState(props.theme === 'dark');
    const showToast = useToast()

    return (
        <TransparentView style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 15 }}>

            <I18NText text='Setting' style={{ textAlign: 'left', fontSize: 22, fontWeight: '500', marginVertical: 10 }} />
            <View style={{ height: 1, backgroundColor: 'grey' }} />

            <TransparentView style={{ marginLeft: 15 }}>
                <Pressable
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}
                    onPress={() => {
                        // navigation.navigate('Language' as never)
                        showToast(Constant.API_ERROR_OCCURRED)
                    }} >
                    <TransparentView style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <FontAwesome name='odnoklassniki-square' color='#2262c9' size={25} style={{ width: 30 }} />
                        <I18NText text={`Change App Language`} style={{ marginHorizontal: 10, fontWeight: '500' }} />
                    </TransparentView>
                    <FontAwesome name='angle-right' size={26} color='grey'/>
                </Pressable>

                <View style={{ height: 1, backgroundColor: 'grey', marginTop: 15 }} />

                <TransparentView
                    style={[{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        , paddingVertical: 10
                    }]}>

                    <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <FontAwesome2 name='format-color-fill' size={23} color='#a30f9e' style={{ width: 30 }} />
                        <I18NText style={{ marginHorizontal: 10, fontWeight: '500' }} text='Dark Mode' />
                    </TransparentView>

                    <Switch
                        trackColor={{ false: "green", true: "orange" }}
                        thumbColor={isDarkMode ? "white" : "black"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={darkModeToggleSwitch}
                        value={isDarkMode} />
                </TransparentView>

                <View style={{ height: 1, backgroundColor: 'grey' }} />
            </TransparentView>
        </TransparentView>
    )

})

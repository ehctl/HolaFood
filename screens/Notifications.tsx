import { View } from "../components/View";
import { getStyle } from "../utils/Utils";
import { Button } from "../components/Button";
import { useEffect, useLayoutEffect } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Level1Header } from '../components/Headers/Level1Header';
import { useLanguage } from '../components/Themed';
import React from "react";

export const NotificationsScreen = React.memo(({ navigation }: any) => {
    const title = useLanguage('Notification')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (_: NativeStackHeaderProps) => <Level1Header title='Notification' />,
            title: title
        })
    })


    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    return (
        <View style={getStyle().flex_c_c}>
            <Button onPress={() => navigation.goBack()} text="Go back home" />
        </View>
    );
})

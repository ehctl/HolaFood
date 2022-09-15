import { View } from "../components/View";
import { getStyle } from "../Utils/Utils";
import { Button } from "../components/Button";
import { useEffect, useLayoutEffect } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Level1Header } from '../components/Headers/Level1Header';

export const NotificationsScreen = ({ navigation }: any) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (_: NativeStackHeaderProps) => <Level1Header title='Notifications' />
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
}

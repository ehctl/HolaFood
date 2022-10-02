import { View } from "../components/View";
import { getStyle } from "../utils/Utils";
import { useEffect } from "react";
import { Level1Header, Level1HeaderStat } from '../components/Headers/Level1Header';
import React from "react";
import { AnimatedHeaderScreen } from "./AnimatedHeaderScreen";
import { Text } from "../components/Text";
import { ListRenderItemInfo } from "react-native";

export const NotificationsScreen = React.memo(({ navigation }: any) => {

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    const renderItem = ({item}: ListRenderItemInfo<NotificationItem>) => {
        return (
            <View>
                <Text text={item.text}/>
            </View>
        )
    }

    return (
        <View style={getStyle().flex_c_c}>
            <AnimatedHeaderScreen
                headerProps={{
                    header: <Level1Header title="Notification"/>,
                    headerHeight: Level1HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    renderItem: renderItem,
                    data: getListItem(),
                    keyExtractor: (_, index) => `${index}`,
                }}
                hideReload={true}
            />
        </View>
    );
})

const getListItem = (): NotificationItem[] => {
    return [
        {
            text: 'BING CHILING'
        },
        {
            text: 'YOYOYOOYYOYOYOYOYOYOYOYOYOY'
        }
    ]
}

type NotificationItem = {
    text: string
}
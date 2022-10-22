import { View } from "../../base/View";
import { getStyle } from "../../utils/Utils";
import { useEffect } from "react";
import React from "react";
import { AnimatedHeader } from "../../base/AnimatedHeader";
import { Text } from "../../base/Text";
import { ListRenderItemInfo } from "react-native";
import { Level1Header, Level1HeaderStats } from "../../base/Headers/Level1Header";
import { getListItem, NotificationItem, NotificationItemData } from "./NotificationItem";

export const NotificationsScreen = React.memo(({ navigation }: any) => {

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    const renderItem = ({ item }: ListRenderItemInfo<NotificationItemData>) => {
        return (
            <NotificationItem {...item} />
        )
    }

    return (
        <View style={getStyle().flex_c_s}>
            <AnimatedHeader
                headerProps={{
                    header: <Level1Header
                        text="Notification"
                        textColor="#2dbd26"
                        leftIcons={['search']}
                        leftIconsColor={['#4666a6']}
                        leftIconsTarget={['Search']} />,
                    headerHeight: Level1HeaderStats.HEADER_MAX_HEIGHT
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


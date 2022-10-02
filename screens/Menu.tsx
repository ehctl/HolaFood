import { View } from "../components/View"
import { FontAwesomeIconType } from "../constants/FontAwesomeIconType"
import { Button } from "../components/Button";
import { ListRenderItemInfo, StyleSheet } from 'react-native'
import { getStyle } from "../utils/Utils";
import { useEffect } from "react";
import { Level1Header, Level1HeaderStat } from '../components/Headers/Level1Header';
import { useLanguage } from '../components/Themed';
import React from "react";
import { AnimatedHeaderScreen } from "./AnimatedHeaderScreen";

export const MenuScreen = React.memo(({ navigation }: any) => {
    const title = useLanguage('Menu')

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    const renderItems = ({ item }: ListRenderItemInfo<MenuItem>) => {
        switch (item.type) {
            case MenuItemType.BUTTTON: {
                return (
                    <Button
                        text={item.title} iconName={item.icon} iconColor='azure'
                        onPress={() => navigation.navigate(item.target)} style={style.flat_list_item} />
                )
            }

            case MenuItemType.LINK: {
                return (
                    <Button
                        text={item.title} iconName={item.icon} iconColor='azure' onPress={() => navigation.navigate('WebView', {
                            uri: item.link
                        })} style={style.flat_list_item} />
                )
            }
            default: {
                console.log('Unsupported type')
            }
        }
    }

    return (
        <View style={getStyle().flex_c_s}>
             <AnimatedHeaderScreen
                headerProps={{
                    header: < Level1Header title="Menu"/>,
                    headerHeight: Level1HeaderStat.HEADER_MAX_HEIGHT
                }}
                flatListProps={{
                    renderItem: renderItems,
                    data: getListItem(),
                    keyExtractor: (_, index) => `${index}`,
                }}
                hideReload={true}
            />
        </View>
    )
})

const style = StyleSheet.create({
    flat_list_item: {
        marginHorizontal: 30
    }
})

const getListItem = (): MenuItem[] => {
    return [
        {
            type: MenuItemType.BUTTTON,
            title: 'Setting',
            icon: 'gear',
            target: 'Setting'
        },
        {
            type: MenuItemType.LINK,
            title: 'About us',
            icon: 'book',
            link: 'https://google.com'
        }
    ]
}

enum MenuItemType {
    LINK,
    BUTTTON,
}

type MenuItem = {
    type: MenuItemType,
    title: string,
    target?: string,
    link?: string,
    icon: FontAwesomeIconType
}

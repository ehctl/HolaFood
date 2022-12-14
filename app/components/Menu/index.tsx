import { TransparentView, View } from "../../base/View"
import { FontAwesomeIconType } from "../../constants/FontAwesomeIconType"
import { Button } from "../../base/Button";
import { Linking, ListRenderItemInfo, Pressable } from 'react-native'
import { getStyle } from "../../utils/Utils";
import { useEffect } from "react";
import { useLanguage } from '../../base/Themed';
import React from "react";
import { AnimatedHeader } from "../../base/AnimatedHeader";
import { FoodItemShimmer } from "../Home/FoodItemShimmer";
import { Level1Header, Level1HeaderStats } from "../../base/Headers/Level1Header";
import { style } from './style/index.css'
import { FontAwesome } from "../../base/FontAwesome";
import { I18NText, Text } from "../../base/Text";
import { SettingSection } from "./SettingSection";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/Reducer";
import Notification from "../../notification/Notification";

export const MenuScreen = React.memo(({ navigation }: any) => {
    const appStateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    return (
        <View style={getStyle().flex_c_s}>
            <AnimatedHeader
                headerProps={{
                    header: <Level1Header
                        text="Menu"
                        textColor="#e8be41"
                        leftIcons={appStateProps.userType == 'customer' ? ['search'] : []}
                        leftIconsColor={appStateProps.userType == 'customer' ? ['#4666a6'] : []}
                        leftIconsTarget={appStateProps.userType == 'customer' ? ['Search'] : []} />,
                    headerHeight: Level1HeaderStats.HEADER_MAX_HEIGHT
                }}
                useScrollView={true}
                hideReload={true} >

                <MenuItem
                    text='Account' iconName='user' iconColor='#5a996b'
                    onPress={() => navigation.navigate('Account')} />

                <MenuItem
                    text='FAQs' iconName='question-circle' iconColor='#5a996b'
                    onPress={() => navigation.navigate('FAQScreen')} />

                <MenuItem
                    text={appStateProps.userType == 'customer' ? 'Order History' : 'Shipping History'} iconName='history' iconColor='#5a996b'
                    onPress={() => navigation.navigate('OrderHistory')} />

                <MenuItem
                    text='About Us' iconName='info-circle' iconColor='#5a996b'
                    onPress={() => navigation.navigate('WebView', { uri: "http://swp490g52-env.eba-sk7m9gfw.ap-southeast-1.elasticbeanstalk.com/customer/aboutUs" })} />
                    
                <LinearGradient colors={['#89c1c4', 'grey']} start={[0, 0]} end={[1, 0]} style={{height: 80}}/>

                <SettingSection />
            </AnimatedHeader>
        </View>
    )
})

export const MenuItem = (props: MenuItemPropsType) => {
    return (
        <Pressable
            style={{ marginHorizontal: 15 }}
            onPress={props.onPress}>
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <FontAwesome name={props.iconName} color={props.iconColor} size={18} style={{ marginRight: 15 }} />
                    <I18NText text={props.text} style={{ fontSize: 18, fontWeight: '500' }} />
                </TransparentView>
                <FontAwesome name="angle-right" size={28} color='grey'/>
            </TransparentView>
            <View style={{ backgroundColor: 'grey', height: 1, marginVertical: 15 }} />
        </Pressable>
    )
}

export type MenuItemPropsType = {
    text: string,
    iconName: FontAwesomeIconType,
    iconColor: string,
    onPress?: () => void
}
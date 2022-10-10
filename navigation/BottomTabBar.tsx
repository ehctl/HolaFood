import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SettingScreen } from '../screens/Setting/Setting';
import { NotificationsScreen as Notifications } from '../screens/Notifications';
import { UtilScreen as Util, UtilScreen } from '../screens/Util';
import { Animated, Pressable, TouchableOpacity } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { View } from '../components/View';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppState, setSelectedBottomTabIndex } from '../redux/Reducer';
import Colors from '../constants/Colors';
import { FontAwesomeIconType } from '../constants/FontAwesomeIconType';
import { MenuScreen as Menu } from '../screens/Menu';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguage } from '../components/Themed';
import React, { useEffect, useRef } from 'react';
import { HomeDraft } from '../screens/Home/HomeDraft';
import { OrderScreen as Order } from '../screens/Order/Order';
import { useDispatch } from 'react-redux';


const BottomTab = createMaterialTopTabNavigator<BottomStackParamList>()

export const BottomTabNavigator = React.memo(() => {
    const stateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))

    return (
        <BottomTab.Navigator tabBarPosition='bottom' screenOptions={{ lazy: true }} tabBar={props =>
            <MyTabBar
                props={props}
                iconList={
                    stateProps.userType == 'user' ?
                        ['home', 'shopping-cart', 'bell', 'ellipsis-h'] :
                        ['shopping-cart', 'ellipsis-h']
                } />
        }>
            {
                stateProps.userType == 'user' ?
                    <BottomTab.Group>
                        <BottomTab.Screen name="Home" component={HomeDraft} options={{ title: useLanguage('Home') }} />
                        <BottomTab.Screen name="Order" component={Order} options={{ title: useLanguage('Orders') }} />
                        <BottomTab.Screen name="Notification" component={Notifications} options={{ title: useLanguage('Notification') }} />
                        <BottomTab.Screen name="Menu" component={Menu} options={{ title: useLanguage('Menu'), }} />
                    </BottomTab.Group>
                    :
                    <BottomTab.Group>
                        <BottomTab.Screen name="Order" component={Order} options={{ title: useLanguage('Orders') }} />
                        <BottomTab.Screen name="Menu" component={Menu} options={{ title: useLanguage('Menu'), }} />
                    </BottomTab.Group>
            }
        </BottomTab.Navigator>
    )
})

const MyTabBar = React.memo((params: BottomBarParams) => {
    const dispatch = useDispatch()
    const props = useSelector((state: AppState) => ({
        theme: state.theme,
        newOrderNotification: state.newOrderNotification,
        selectedBottomTabIndex: state.selectedBottomTabIndex
    }))

    useEffect(() => {
        params.props.position.addListener(({ value }) => {
            if ((value == 0 || value % Math.floor(value) == 0) && value != props.selectedBottomTabIndex)
                dispatch(setSelectedBottomTabIndex(value))
        })

        return () => {
            params.props.position.removeAllListeners()
        }
    }, [params.props.position])

    return (
        <View style={{ flexDirection: 'row' }} >
            <View style={style.divider} />
            {params.props.state.routes.map((route, index) => {
                // params.props.position.addListener((v) => console.log(v))
                const { options } = params.props.descriptors[route.key];
                const title =
                    options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = params.props.state.index === index;
                const onPress = () => {
                    const event = params.props.navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        params.props.navigation
                        params.props.navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    params.props.navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const inputRange = params.props.state.routes.map((_, i) => i);
                const opacity = params.props.position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0.3)),
                });

                const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome)

                return (
                    <Pressable
                        key={`${index}`}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={style.tab_container} >

                        <Animated.View style={[style.divider, { opacity }]} />
                        <View style={style.tab_element_container}>
                            <View style={{ flexDirection: 'row', position: 'relative' }}>
                                <AnimatedIcon name={params.iconList[index]} size={20} color={'#2a90c7'} style={{ opacity }} />
                                {
                                    (route.name == 'Order' && props.newOrderNotification) ?
                                    <FontAwesome name='exclamation-circle' size={15} color={'#269437'} style={{ position: 'absolute', right: -10, top: -5 }} />
                                    : null
                                }
                            </View>
                            <Animated.Text style={[style.tab_element_text, { opacity, color: Colors[props.theme].text }]}>
                                {title}
                            </Animated.Text>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
})

type BottomBarParams = { props: MaterialTopTabBarProps, iconList: FontAwesomeIconType[] }


const style = StyleSheet.create({
    tab_container: {
        flex: 1,
        backgroundColor: 'white',
    },
    divider: {
        height: 2,
        backgroundColor: '#2a90c7'
    },
    tab_element_container: {
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tab_element_text: {
        textAlign: 'center',
        fontWeight: '500'
    }
})

export type BottomStackParamList = {
    Home: undefined;

    Order: { needRefresh?: boolean };

    Notification: undefined;

    Menu: undefined;
};


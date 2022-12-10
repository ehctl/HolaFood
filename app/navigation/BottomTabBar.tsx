import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SettingSection } from '../components/Menu/SettingSection';
import { NotificationsScreen as Notifications } from '../components/Notifications';
import { Animated, Pressable, TouchableOpacity } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { View } from '../base/View';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppState, setSelectedBottomTabIndex } from '../redux/Reducer';
import Colors from '../constants/Colors';
import { FontAwesomeIconType } from '../constants/FontAwesomeIconType';
import { MenuScreen as Menu } from '../components/Menu';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguage } from '../base/Themed';
import React, { useEffect, useRef, useState } from 'react';
import { HomeScreen } from '../components/Home';
import { useDispatch } from 'react-redux';
import { OrderTab } from './OrderTopBar';


const BottomTab = createMaterialTopTabNavigator<BottomStackParamList>()

export const BottomTabNavigator = React.memo(() => {
    const stateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))

    return (
        <BottomTab.Navigator tabBarPosition='bottom' screenOptions={{ lazy: true }} 
        tabBar={props =>
            <BottomTabBar
                props={props}
                iconList={
                    stateProps.userType == 'customer' ?
                        ['home', 'shopping-cart', 'bell', 'ellipsis-h'] :
                        ['shopping-cart', 'ellipsis-h']
                } />
        }
        >
            {
                stateProps.userType == 'customer' ?
                    <BottomTab.Group>
                        <BottomTab.Screen name="Home" component={HomeScreen} options={{ lazy: false}} />
                        <BottomTab.Screen name="Order" component={OrderTab} options={{ lazy: false }} />
                        <BottomTab.Screen name="Notification" component={Notifications} options={{ lazy: false}} />
                        <BottomTab.Screen name="Menu" component={Menu} options={{}} />
                    </BottomTab.Group>
                    :
                    <BottomTab.Group>
                        <BottomTab.Screen name="Order" component={OrderTab} options={{ lazy: false }} />
                        <BottomTab.Screen name="Menu" component={Menu} options={{}} />
                    </BottomTab.Group>
            }
        </BottomTab.Navigator>
    )
})


const BottomTabBar = React.memo((params: BottomBarParams) => {
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
        <View style={{ flexDirection: 'row', backgroundColor: 'green' }} >
            <View style={style.divider} />
            {params.props.state.routes.map((route, index) => {
                const { options } = params.props.descriptors[route.key];
                const title = useLanguage(
                    options.title !== undefined
                        ? options.title
                        : route.name)

                const isFocused = params.props.state.index === index;
                const onPress = () => {
                    if (!isFocused) {
                        params.props.navigation.navigate(route.name);
                    }
                };

                const inputRange = params.props.state.routes.map((_, i) => i);
                const opacity = params.props.position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0.3)),
                });


                return (
                    <Pressable
                        key={`${index}`}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={[style.tab_container]} >

                        <Animated.View style={[style.divider, { opacity }]} />
                        <View style={style.tab_element_container}>
                            <View style={{ flexDirection: 'row', position: 'relative' }}>
                                <Animated.View style={{ opacity }} >
                                    <FontAwesome name={params.iconList[index]} size={28} color={'#2a90c7'} />
                                </Animated.View>
                                {
                                    (route.name == 'Notification' && props.newOrderNotification) ?
                                        <FontAwesome name='exclamation-circle' size={15} color={'#2a90c7'} style={{ position: 'absolute', right: -8, top: -3 }} />
                                        : null
                                }
                            </View>
                            <Animated.Text style={[style.tab_element_text, { opacity, color: Colors[props.theme].text, fontSize: 10, fontWeight: '500', marginBottom: 5 }]}>
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
        height: 45,
        flex: 1,
        backgroundColor: 'white',
    },
    divider: {
        height: 2,
        backgroundColor: '#2a90c7'
    },
    tab_element_container: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tab_element_text: {
        textAlign: 'center',
        fontWeight: '300'
    }
})

export type BottomStackParamList = {
    Home: undefined;

    Order: { needRefresh?: boolean };

    Notification: undefined;

    Menu: undefined;
};


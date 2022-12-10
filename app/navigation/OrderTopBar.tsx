import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Animated, Pressable } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { View } from '../base/View';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Reducer';
import Colors from '../constants/Colors';
import React from 'react';
import { OrderScreen as Order } from '../components/Order';
import { getStyle } from '../utils/Utils';
import { Level1Header, Level1HeaderStats } from '../base/Headers/Level1Header';
import { Cart } from '../components/Order/Cart';
import { useLanguage } from '../base/Themed';
import { OrderQueueScreen } from '../components/Order/OrderQueueScreen';


const OrderTabNavigator = createMaterialTopTabNavigator<OrderStackParamList>()

export const OrderTab = React.memo(() => {
    const stateProps = useSelector((state: AppState) => ({
        userType: state.userType
    }))

    return (
        <View style={getStyle().AnimatedHeader_container}>
            <View style={getStyle().AnimatedHeader_header}>
                <Level1Header
                    text="Order"
                    textColor="#28b1c9"
                    leftIcons={stateProps.userType == 'customer' ? ['search'] : []}
                    leftIconsColor={stateProps.userType == 'customer' ? ['#4666a6'] : []}
                    leftIconsTarget={stateProps.userType == 'customer' ? ['Search'] : []} />
            </View>

            <OrderTabNavigator.Navigator
                style={{}}
                tabBarPosition='top'
                tabBar={props =>
                    <OrderTabBar
                        marginTop={Level1HeaderStats.HEADER_MAX_HEIGHT}
                        props={props} />
                }>
                {
                    stateProps.userType == 'customer' ?
                        <OrderTabNavigator.Group>
                            <OrderTabNavigator.Screen name="Cart" component={Cart} options={{ lazy: false }} />
                            <OrderTabNavigator.Screen name="Orders" component={Order} options={{ lazy: false }} />
                        </OrderTabNavigator.Group>
                        :
                        <OrderTabNavigator.Group>
                            <OrderTabNavigator.Screen name="Order Queue" component={OrderQueueScreen} options={{ lazy: false }} />
                            <OrderTabNavigator.Screen name="Orders" component={Order} options={{ lazy: false }} />
                        </OrderTabNavigator.Group>

                }

            </OrderTabNavigator.Navigator>
        </View>

    )
})

const OrderTabBar = React.memo((params: OrderTopBarParams) => {
    const props = useSelector((state: AppState) => ({
        theme: state.theme,
    }))

    return (
        <View style={{ flexDirection: 'row' }} >
            <View style={style.divider} />
            {params.props.state.routes.map((route, index) => {
                const { options } = params.props.descriptors[route.key];
                const title = useLanguage(
                    options.title !== undefined
                        ? options.title
                        : route.name
                )

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
                        style={[style.tab_container, { marginTop: params.marginTop ?? 0 }]} >

                        <Animated.View style={[style.divider, { opacity }]} />
                        <View style={style.tab_element_container}>
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

export type OrderStackParamList = {
    Cart: undefined;

    Orders: undefined;

    'Order Queue': {
        isShipperOrderQueue: boolean
    };
};

type OrderTopBarParams = { props: MaterialTopTabBarProps, marginTop?: number }

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
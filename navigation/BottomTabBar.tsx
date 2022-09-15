import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Setting } from '../screens/Setting';
import { NotificationsScreen as Notifications } from '../screens/Notifications';
import { HomeScreen as Home } from '../screens/Home';
import { Animated, Pressable, TouchableOpacity } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { View } from '../components/View';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Reducer';
import Colors from '../constants/Colors';
import { FontAwesomeIconType } from '../constants/FontAwesomeIconType';
import { MenuScreen as Menu } from '../screens/Menu';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguage } from '../components/Themed';


const BottomTab = createMaterialTopTabNavigator()
const Stack = createNativeStackNavigator()

export const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator tabBarPosition='bottom' screenOptions={{lazy: true}} tabBar={props =>
            <MyTabBar
                props={props}
                iconList={['home', 'bell', 'ellipsis-h']} />
        }>

            <BottomTab.Screen name="HomeStack" component={HomeStack} options={{ title: useLanguage('Home') }} />
            <BottomTab.Screen name="NotificationStack" component={NotificationStack} options={{ title: useLanguage('Notification') }} />
            <BottomTab.Screen name="MenuStack" component={MenuStack} options={{ title: useLanguage('Menu'),  }} />
        </BottomTab.Navigator>
    )
}

const MenuStack = () => {
    return (
        <Stack.Navigator initialRouteName='Menu' screenOptions={{ fullScreenGestureEnabled: true }}>
            <Stack.Screen name='Menu' component={Menu} />
        </Stack.Navigator>
    )
}

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{}}>
            <Stack.Screen name='Home' component={Home} />
        </Stack.Navigator>
    )
}

const NotificationStack = () => {
    return (
        <Stack.Navigator initialRouteName='Notification' screenOptions={{}}>
            <Stack.Screen name='Notification' component={Notifications} />
        </Stack.Navigator>
    )
}

const MyTabBar = (params: BottomBarParams) => {
    const props = useSelector((state: AppState) => ({
        theme: state.theme
    }))

    return (
        <View style={{ flexDirection: 'row' }} >
            <View style={style.divider} />
            {params.props.state.routes.map((route, index) => {
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
                            <AnimatedIcon name={params.iconList[index]} size={20} color={'#2a90c7'} style={{ opacity }} />
                            <Animated.Text style={[style.tab_element_text, { opacity, color: Colors[props.theme].text }]}>
                                {title}
                            </Animated.Text>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}

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


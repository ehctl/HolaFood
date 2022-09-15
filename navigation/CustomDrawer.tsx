import { createDrawerNavigator } from '@react-navigation/drawer'
import { View } from '../components/View'
import { Button } from '../components/Button';
import { SafeAreaView } from "react-native";
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Reducer';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { getStyle } from '../utils/Utils';
import { BottomTabNavigator } from './BottomTabBar';

const Drawer = createDrawerNavigator()

export const RootDrawer = () => {
    const navigation = useNavigation()
    const props = useSelector((state: AppState) => ({
        theme: state.theme
    }))

    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} />} >
            <Drawer.Screen name="TabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    )
}

const DrawerContent = ({ navigation }: any) => {

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
            <View style={{ flex: 1, justifyContent: 'space-between', padding: 10 }}>
                <View>
                    <Button
                        text='Home'
                        onPress={() => navigation.navigate('Home')} />
                    <Button
                        text='Notification'
                        onPress={() => navigation.navigate('Notification')} />
                </View>

                <View>
                    <Button
                        text='Log out'
                        onPress={() => navigation.replace('Login')} />
                </View>
            </View>
        </SafeAreaView>
    )
}





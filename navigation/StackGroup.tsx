import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { Mock } from '../screens/Mock';
import { Setting } from '../screens/Setting';
import { WebView } from '../components/WebView';
import { SearchScreen as Search } from '../screens/Search';
import { BottomTabNavigator } from './BottomTabBar';


const Stack = createNativeStackNavigator<GroupStackParamList>();

export const Root = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name='RootTab'
                component={BottomTabNavigator} options={{ headerShown: false, animation: 'fade' }}   />

            <Stack.Screen name='Setting' component={Setting} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name='Mock' component={Mock} options={{ animation: 'slide_from_right', headerShown: false }} />
            <Stack.Screen name='WebView' component={WebView} options={{ animation: 'slide_from_bottom', }} />
            <Stack.Screen name='Search' component={Search} options={{ animation: 'slide_from_right', headerShown: false}} />
        </Stack.Navigator>
    )
}

export type GroupStackParamList = {
    RootTab: undefined;

    Setting: { slug: string };

    Mock: { data: Array<string> };

    WebView: { uri: string };

    Search: undefined;
};


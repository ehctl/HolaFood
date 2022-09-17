import { useCallback, useState } from "react"
import { Animated, Image, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl } from "react-native"
import { FontAwesome } from "../components/FontAwesome"
import { Text } from "../components/Text"
import { View } from "../components/View"
import { getStyle, isIosDevice, wait } from "../utils/Utils"
import { Dimensions } from 'react-native';
import { HomePageHeader, HomePageHeaderStat } from "../components/Headers/HomePageHeader"

export const DummbScreen = ({ navigation }: any) => {
    const windowWidth = Dimensions.get('window').width;
    const [refreshing, setRefreshing] = useState(false);
    const [isOnTop, setIsOnTop] = useState(true)

    const scrollOffsetY = new Animated.Value(0)
    const prevScrollOffsetY = new Animated.Value(HomePageHeaderStat.HEADER_MAX_HEIGHT)
    const prevHeaderTransformY = new Animated.Value(0)
    const scrollOffsetYSub = Animated.subtract(scrollOffsetY, prevScrollOffsetY)
    const transformY = Animated.add(prevHeaderTransformY, scrollOffsetYSub).interpolate({
        inputRange: [-HomePageHeaderStat.HEADER_MAX_HEIGHT, HomePageHeaderStat.HEADER_MAX_HEIGHT],
        outputRange: [0, -HomePageHeaderStat.HEADER_MAX_HEIGHT],
        extrapolate: 'clamp'
    })

    const handleSnap = ({ nativeEvent }) => {
        const offsetY = nativeEvent.contentOffset.y;
        prevHeaderTransformY.setValue(-2 * Number(JSON.stringify(transformY)) - HomePageHeaderStat.HEADER_MAX_HEIGHT)
        prevScrollOffsetY.setValue(offsetY)
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const renderItem = ({ item }: { item: DUMMY_TYPE }) => {
        return (
            <View style={{
                flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, marginBottom: 8,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
            }}>
                <Image
                    source={{
                        uri: 'https://img.freepik.com/premium-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000'
                    }}
                    style={{ aspectRatio: 1, height: 100 }} />

                <View style={{ height: '100%', width: windowWidth - 165, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline', marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="shield" size={14} style={{ marginRight: 5 }} color='#97a842' />
                        </View>
                        <Text text="Openning" style={{ color: '#59abcf' }} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="chevron-up" size={14} style={{ marginRight: 5 }} color='#97a842' />
                        </View>
                        <Text text={item.title} numberOfLines={2} ellipsizeMode='tail' style={{ textAlign: 'left', fontWeight: '500', fontSize: 16 }} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="home" size={14} style={{ marginRight: 5 }} color='#422475' />
                        </View>
                        <Text text={item.shopName} numberOfLines={2} style={{ textAlign: 'left', opacity: 0.7 }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 20, alignItems: 'center' }}>
                            <FontAwesome name="location-arrow" size={14} style={{ marginRight: 5 }} color='#319ca8' />
                        </View>
                        <Text text={item.address} style={{ fontSize: 12, textAlign: 'left', fontWeight: '500', opacity: 0.7 }} />
                    </View>


                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                        <View style={{ paddingTop: 15, paddingBottom: 5 }}>
                            <FontAwesome name="android" size={20} color={`${item.isVerified ? 'red' : 'grey'}`} />
                        </View>

                        <View style={{ paddingTop: 15, paddingBottom: 5, marginLeft: 20 }}>
                            <FontAwesome name="id-badge" size={20} color={`${item.isPinned ? 'green' : 'grey'}`} />
                        </View>
                    </View>
                </View>
                <View style={{ height: '100%', width: 20, justifyContent: 'center', paddingLeft: 5 }}>
                    <FontAwesome name="angle-right" size={30} />
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, position: 'relative', backgroundColor: 'white', }}>
            <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HomePageHeaderStat.HEADER_MAX_HEIGHT, zIndex: 1, transform: [{ translateY: isOnTop ? 0 : transformY }] }}>
                <HomePageHeader />
            </Animated.View>

            {
                isIosDevice() ?
                    <ActivityIndicator animating={true} size='small' style={{ position: 'absolute', top: HomePageHeaderStat.HEADER_MAX_HEIGHT, right: 0, left: 0 }} />
                    : null
            }

            <Animated.FlatList
                contentContainerStyle={{ paddingTop: HomePageHeaderStat.HEADER_MAX_HEIGHT + (refreshing && isIosDevice() ? REFRESH_CONTROL_INDICATOR_SIZE : 0) }}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                data={DUMMY_DATA}
                scrollEventThrottle={16}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={handleSnap}
                onScrollEndDrag={handleSnap}
                refreshControl={
                    !isIosDevice() ?
                        <RefreshControl
                            progressViewOffset={REFRESH_CONTROL_INDICATOR_SIZE + HomePageHeaderStat.HEADER_MAX_HEIGHT}
                            refreshing={refreshing}
                            onRefresh={onRefresh} />
                        : null
                }
                onScroll={
                    Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: { y: scrollOffsetY },
                            },
                        }],
                        {
                            useNativeDriver: false,
                            listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                setIsOnTop(e.nativeEvent.contentOffset.y <= 0)
                                if (e.nativeEvent.contentOffset.y <= -IOS_PTR_DISTANCE && isIosDevice()) {
                                    setRefreshing(true)
                                    onRefresh()
                                }
                            }
                        },
                    )} />
        </View>
    )
}

const IOS_PTR_DISTANCE = 100
const REFRESH_CONTROL_INDICATOR_SIZE = 30

const DUMMY_DATA: DUMMY_TYPE[] = [
    {
        id: '1',
        title: 'Gà rang muối',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: true,
    },
    {
        id: '2',
        title: 'Gà rang muối 1',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: false,
    },
    {
        id: '3',
        title: 'Gà rang muối 2',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: false,
    },
    {
        id: '4',
        title: 'Gà rang muối 3',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: true,
        isVerified: true,
    },
    {
        id: '5',
        title: 'Gà rang muối 4',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '6',
        title: 'Gà rang muối 5',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '7',
        title: 'Gà rang muối 6',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
    {
        id: '8',
        title: 'Gà rang muối 7',
        address: 'Hòa Lạc, Thạch Thất',
        shopName: 'Gà Ngon Quán',
        isPinned: false,
        isVerified: true,
    },
]

type DUMMY_TYPE = {
    id: string,
    title: string,
    address: string,
    shopName: string,
    isPinned: boolean,
    isVerified: boolean
}
import { TransparentView, View } from "../../base/View";
import { getStyle, wait } from "../../utils/Utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { AnimatedHeader } from "../../base/AnimatedHeader";
import { Text } from "../../base/Text";
import { Animated, KeyboardAvoidingView, ListRenderItemInfo, Modal, Platform, SafeAreaView, SafeAreaViewBase } from "react-native";
import { Level1Header, Level1HeaderStats } from "../../base/Headers/Level1Header";
import { getListItem, DefaultNotificationItem, NotificationItemData, NotificationType, OrderStatusNotificationItem, mapNotificationDataFromResponse } from "./NotificationItem";
import { PopupModal } from "../../base/PopupModal";
import { hide } from "expo-splash-screen";
import { useSelector } from "react-redux";
import { addNotifications, AppState } from "../../redux/Reducer";
import { useDispatch } from "react-redux";
import { NotificationItemShimmer } from "./NotificationItemShimmer";
import { getNotification } from "../../core/apis/Requests";
import { useToast } from "../../base/Toast";
import { Constant } from "../../utils/Constant";
import { AppState as ApplicationState } from 'react-native'

export const NotificationsScreen = React.memo(({ navigation }: any) => {
    const dispatch = useDispatch()
    const appStateProps = useSelector((state: AppState) => ({
        notifications: state.notifications,
        selectedBottomTabIndex: state.selectedBottomTabIndex,
    }))
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [reachedEndList, setReachEndList] = useState(false)


    const showToast = useToast()

    const fetchData = useCallback((pageIndex: number) => {
        setLoading(true)
        const prevNotiList = appStateProps.notifications
        if (pageIndex == 0)
            dispatch(addNotifications([]))

        getNotification(
            pageIndex,
            (response) => {
                const data = response.data.map((i) => mapNotificationDataFromResponse(i))
                const notiList = data.length > 0 ? data : (pageIndex == 0 ? getListItem() : [])
                dispatch(addNotifications(pageIndex == 0 ? notiList : [...prevNotiList, ...notiList]))
                setReachEndList(data.length < 20)
                setLoading(false)
            },
            (e) => {
                console.log(e)
                showToast(Constant.API_ERROR_OCCURRED)
                setLoading(false)
            }
        )
    }, [appStateProps.notifications])

    const appStateListener = useRef(null);

    useEffect(() => {
        appStateListener.current = ApplicationState.addEventListener("change", nextAppState => {
            if (nextAppState == 'active' && appStateProps.selectedBottomTabIndex == 2 && !loading) {
                console.log('sdafksjfslk')
                fetchData(0)
            }
        });

        return () => {
            appStateListener.current.remove()
        }
    }, [loading])


    useEffect(() => {
        setReachEndList(false)
        setPageIndex(0)
        fetchData(0)
    }, [])

    const renderItem = ({ item }: ListRenderItemInfo<NotificationItemData>) => {
        switch (item.type) {
            case NotificationType.DEFAULT:
                return (
                    <DefaultNotificationItem {...item} />
                )
            case NotificationType.ORDER_STATUS_CHANGE:
                return (
                    <OrderStatusNotificationItem {...item} />
                )
        }
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
                    data: appStateProps.notifications,
                    ListFooterComponent: <NotificationItemShimmer visible={loading} />,
                    keyExtractor: (_, index) => `${index}`,
                    onEndReachedThreshold: 0.5,
                    onEndReached: () => {
                        if (!reachedEndList && !loading && appStateProps.notifications.length > 0) {
                            fetchData(pageIndex + 1)
                            setPageIndex(pageIndex + 1)
                        }
                    }
                }}
                onRefresh={() => {setPageIndex(0); fetchData(0)}}
            />
        </View>
    );
})


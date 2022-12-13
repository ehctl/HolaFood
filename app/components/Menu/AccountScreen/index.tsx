import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Pressable } from "react-native"
import { I18NText } from "../../../base/Text"
import { FontAwesome2 } from "../../../base/FontAwesome"
import { useNavigation } from '@react-navigation/native';
import { Info } from "./Info"
import { Address } from "./Address"
import { useDispatch, useSelector } from "react-redux"
import { AppState, clearUserInfo } from "../../../redux/Reducer"
import { useCallback, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Constant } from "../../../utils/Constant"
import { deleteNotificationToken, logout } from "../../../core/apis/Requests"
import { ActivityIndicator } from 'react-native';
import { deleteInfoBeforeLogout } from "../../../utils/Utils"
import { useToast } from "../../../base/Toast"


export const AccountScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation<any>()
    const stateProps = useSelector((state: AppState) => ({
        userType: state.userType,
        userInfo: state.userInfo
    }))

    const [loading, setLoading] = useState(false)

    const showToast = useToast()

    const onLogout = useCallback(async () => {
        setLoading(true)
        const notiToken = (await AsyncStorage.getItem(Constant.APP_NOTIFICATION_TOKEN)) ?? ''

        deleteNotificationToken(
            notiToken,
            (response) => {
                logout(
                    async (response) => {
                        navigation.replace('Authentication')
                        await deleteInfoBeforeLogout()
                        dispatch(clearUserInfo())
                    },
                    (e) => {
                        showToast(Constant.API_ERROR_OCCURRED)
                        setLoading(false)
                    }
                )
            }, 
            (e) => {
                showToast(Constant.API_ERROR_OCCURRED)
            }
        )
    }, [])

    return (
        <AnimatedHeader
            headerProps={{
                header: <Level2Header title="Account" />,
                headerHeight: Level2HeaderStat.HEADER_MAX_HEIGHT
            }}
            useScrollView={true}
            hideReload={true}>
            <TransparentView>
                <Info />
                {
                    stateProps.userType == "customer" ?
                        <Address /> : null
                }

                <View style={{ backgroundColor: '#d4d9d4', height: 15, marginTop: 10, width: '100%' }} />

                <TransparentView style={{ marginHorizontal: 10 }}>
                    <Pressable
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        onPress={() => onLogout()}>
                        <TransparentView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <FontAwesome2 name="logout" size={20} />
                            <I18NText
                                text="Log Out"
                                style={{ fontSize: 18, fontWeight: '500', textAlign: 'left', paddingVertical: 15, paddingHorizontal: 10 }} />
                        </TransparentView>
                        <ActivityIndicator animating={loading} size='small' color='black' />
                    </Pressable>
                </TransparentView>

                <View style={{ backgroundColor: '#d4d9d4', height: 1, width: '100%', marginBottom: 50 }} />
            </TransparentView>
        </AnimatedHeader>
    )
}




import { AnimatedHeader } from "../../../base/AnimatedHeader"
import { Level2Header, Level2HeaderStat } from "../../../base/Headers/Level2Header"
import { TransparentView, View } from "../../../base/View"
import { Pressable } from "react-native"
import { I18NText } from "../../../base/Text"
import { FontAwesome2 } from "../../../base/FontAwesome"
import { useNavigation } from '@react-navigation/native';
import { Info } from "./Info"
import { Address } from "./Address"

export const AccountScreen = () => {
    const navigation = useNavigation<any>()

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

                <Address />

                <View style={{ backgroundColor: '#d4d9d4', height: 15, width: '100%' }} />

                <TransparentView>
                    <Pressable
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => {
                            navigation.replace('Authentication')
                        }}>
                        <FontAwesome2 name="logout" size={20} style={{ marginLeft: 10 }} />
                        <I18NText
                            text="Log Out"
                            style={{ fontSize: 18, fontWeight: '500', width: '100%', textAlign: 'left', paddingVertical: 15, paddingHorizontal: 10 }} />
                    </Pressable>
                </TransparentView>

                <View style={{ backgroundColor: '#d4d9d4', height: 1, width: '100%' }} />
            </TransparentView>
        </AnimatedHeader>
    )
}




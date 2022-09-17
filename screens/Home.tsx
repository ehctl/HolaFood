import { DummyCommand } from '../command/Dummy';
import { CommandExecuter } from '../command/Command';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, changeApplicationState } from '../redux/Reducer';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { getStyle, wait } from '../utils/Utils';
import { View } from '../components/View';
import { Button } from '../components/Button';
import Notification from '../notification/Notification';
import { Modal, RefreshControl, ScrollView } from 'react-native';
import { Text } from '../components/Text';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { WebView } from 'react-native-webview'
import { DrawerActions } from '@react-navigation/native';
import { Level1Header } from '../components/Headers/Level1Header';
import Colors from '../constants/Colors';
import { HomePageHeader } from '../components/Headers/HomePageHeader';
import { SearchScreen } from './Search';

const dummyCommand = new DummyCommand()

export const HomeScreen = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const props = useSelector((state: AppState) => ({
        applicationState: state.applicationState,
        theme: state.theme
    }))
    const [modalVisible, setModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (_: NativeStackHeaderProps) => <HomePageHeader />
        })
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            // button press xD
        });

        return unsubscribe;
    })

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={[getStyle().flex_c_c, getStyle().defaultView]}>
            <ScrollView style={{ width: '100%', backgroundColor: Colors[props.theme].background }} contentContainerStyle={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} title='Refreshing' />
                }
            >
                <View>
                    <Button
                        onPress={() =>
                            CommandExecuter(dummyCommand, {
                                first: '1',
                                second: '2'
                            })
                        }
                        text='Call Api' />
                    <Button
                        onPress={() => {
                            Notification.getInstance().schedulePushNotification({
                                content: {
                                    title: "Test notification's title",
                                    body: "Test notification's body",
                                },
                                trigger: {
                                    seconds: 1
                                }
                            })
                        }}
                        text='Trigger notification' />
                    <Button
                        onPress={() => {
                            setModalVisible(true)
                        }}
                        text='Show pop up' />
                    <Button
                        onPress={() => {
                            dispatch(changeApplicationState('active'))
                        }}
                        text={`Trigger action ${props.applicationState}`} />
                    <Button
                        onPress={() => {
                            navigation.navigate('Mock')
                        }}
                        text={'Open mock screen'} />
                    <Button
                        onPress={() => {
                            navigation.navigate('WebView', {
                                uri: 'https://youtube.com'
                            })
                        }}
                        text={'Open Webview'} />

                    <Button
                        onPress={() => {
                            navigation.navigate('Search')
                        }}
                        text={'Open Search Screen'} />

                    <Button
                        onPress={() => {
                            navigation.navigate('Dummb')
                        }}
                        text={'Open Dummb Screen'} />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }} >
                        <View style={styles.modal}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText} text='Hello World!' />
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)} >
                                    <Text style={styles.textStyle} text='Hide Modal' />
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>


            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0
    },
    centeredView: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: 22,
    },
    modalView: {
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: "white",
        borderRadius: 20,
        width: '100%',
        alignSelf: "flex-end",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

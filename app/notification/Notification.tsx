import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationRequestInput, NotificationChannelInput } from 'expo-notifications';
import Warehouse from '../utils/Warehouse';
import { AnyAction, Dispatch } from 'redux';
import { addOrders, setNewOrderNotification, updateNotifcations, updateOrderStatus } from '../redux/Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constant } from '../utils/Constant';
import { addNotificationToken } from '../core/apis/Requests';


export default class Notification {
  private static _instance?: Notification;
  private expoToken?: string;
  private dimissNotificationList: string[] = [];

  constructor() { }

  static getInstance = (): Notification => {
    if (!this._instance)
      this._instance = new Notification()
    return this._instance
  }

  public async setExpoToken(token: string) {
    try {

      if (token) {
        this.expoToken = token
        const notiToken = (await AsyncStorage.getItem(Constant.APP_NOTIFICATION_TOKEN)) ?? ''
        const userInfo = JSON.parse((await AsyncStorage.getItem(Constant.APP_USER_INFO)) ?? '{}')

        if (token.length > 0 && notiToken != token && userInfo.id && userInfo.role == 'ROLE_CUSTOMER') {
          await AsyncStorage.setItem(Constant.APP_NOTIFICATION_TOKEN, token)
          addNotificationToken(
            token,
            (response) => { 
              console.log('Add notification token success')
            },    
            (e) => {
              console.log(e)
            }
          )
          console.log('New Expo Push Token: ', this.expoToken)
        } else {
          console.log('Expo Push Token: ', this.expoToken)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  public getExpoToken = (): string | undefined => this.expoToken

  public addToBeDissmissNotificationID = (id: string) => this.dimissNotificationList.push(id)

  public canNotificationDismiss = (id: string): boolean => {
    const index = this.dimissNotificationList.indexOf(id)
    if (index != -1) {
      this.dimissNotificationList.splice(index, 1)
      return true
    }

    return false
  }

  public isDataNotification = (notification: Notifications.Notification) => {
    return notification.request.content.data.type != undefined
  }

  public newNotification = (dispatch: Dispatch<AnyAction>, notification: Notifications.Notification) => {
    try {
      if (this.isDataNotification(notification)) {
        const data = notification.request.content.data as DataNotificationType
        switch (data.type) {
          case 'OrderStatusChange':
            console.log(data)
            console.log('Notification: Status Change')
            dispatch(updateOrderStatus({
              orderId: data.orderId,
              status: data.status,
            }))
            dispatch(updateNotifcations({
              orderId: data.orderId,
              status: data.status,
              time: data.time
            }))
            break;
          default:
            console.log('Unsupported type')
        }
      }
    } catch (e) {
      console.log('Error:', e)
    }
  }

  public dissmissNotification = async (identifier: string) => {
    if (this.canNotificationDismiss(identifier)) {
      await Notifications.dismissNotificationAsync(identifier);
    }
  }

  public async schedulePushNotification(request: NotificationRequestInput): Promise<string> {
    try {
      var notiResponse = await Notifications.scheduleNotificationAsync(request);
    } catch (err) {
      console.log(err)
    } finally {
      return ''
    }
  }

  public async registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      await Notification._instance?.addNewAndroidNotificationChannel('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  public async addNewAndroidNotificationChannel(channelId: string, channel: NotificationChannelInput) {
    await Notifications.setNotificationChannelAsync(channelId, channel);
  }
}

export type DataNotificationType = {
  type: string,
  status: number,
  orderId: number,
  time: string
}


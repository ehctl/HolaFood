import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationRequestInput, NotificationChannelInput } from 'expo-notifications';


export default class Notification {
  private static _instance?: Notification;
  private expoToken?: string;

  constructor() { }

  static getInstance = (): Notification => {
    if (!this._instance)
      this._instance = new Notification()
    return this._instance
  }

  public setExpoToken(token?: string) {
    this.expoToken = token?.slice(18, token.length - 1)
    console.log('New Expo Push Token: ', this.expoToken)
  }

  public getExpoToken = (): string | undefined => this.expoToken

  public async schedulePushNotification(request: NotificationRequestInput): Promise<string> {
    try{
      var notiResponse =  await Notifications.scheduleNotificationAsync(request);
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
      this.setExpoToken(token)
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


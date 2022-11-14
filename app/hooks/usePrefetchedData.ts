import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constant } from '../utils/Constant';
import { getUserInfo, login } from '../core/apis/Requests';
import { UserInfo } from '../redux/Reducer';
import { saveUserInfoLocalStorage, wait } from '../utils/Utils';
import { Asset } from 'expo-asset';


export default function usePrefetchedData() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Preload images
        await cacheImages([
          require('../../assets/images/food_background.jpg'),
        ]);  

        const token = await AsyncStorage.getItem(Constant.APP_API_TOKEN)
        await wait(5000)
        if (token != null && token.length != 0) {
          const response = await getUserInfo()
          const userInfo = mapResponseToUserInfo(response.user)
          await saveUserInfoLocalStorage(userInfo)
        } else {
          throw 'Not Found'
        }
      } catch (e) {
        console.log(e);
        await AsyncStorage.setItem(Constant.APP_USER_INFO, '')
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return { isLoadingComplete }
}

export const mapResponseToUserInfo = (response): UserInfo => {
  return {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    email: response.email,
    phone: response.phone ?? '',
    role: response.roles[0].name
  }
}

// function cacheImages(images) {
//   return images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     } else {
//     }
//   });
// }

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
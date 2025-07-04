import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import * as Linking from 'expo-linking'; // 임시 주석 처리 - ExpoLinking 에러 방지
import * as Updates from 'expo-updates';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/constants/colors';

export default function App() {
  useEffect(() => {
    // 딥링크 처리 - 임시 주석 처리 (ExpoLinking 네이티브 모듈 에러 방지)
    /*
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
    };

    // 초기 URL 확인
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // URL 변경 리스너
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
    */
  }, []);

  useEffect(() => {
    // expo-updates 설정
    const setupUpdates = async () => {
      if (__DEV__) {
        // 개발 환경에서는 업데이트 체크 안함
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          // 업데이트가 완료되면 앱 재시작
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    setupUpdates();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
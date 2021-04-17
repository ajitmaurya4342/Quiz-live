import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import { createStackNavigator } from '@react-navigation/stack';
import allReducers from './reducers/index.js';
import NetInfo from '@react-native-community/netinfo';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import HomeScreen from './component/Screen/HomeScreen';
import LevelScreen from './component/Screen/LevelScreen';
import QuestionScreen from './component/Screen/QuestionScreen';
import ScoreScreen from './component/Screen/ScoreScreen';
import TicToeScreen from './component/Screen/TicToeScreen';
import LoadingScreen from './component/Screen/LoadingScreen';
import SplashScreen from './component/Screen/SplashScreen';
import LoginScreen from './component/Screen/LoginScreen';
import LeaderBoard from './component/Screen/LeaderBoard';
import GameRules from './component/Screen/GameRules';
import EditLoginScreen from './component/Screen/EditLoginScreen';
import HomescreenService from './component/apiServices/HomescreenService';

const store = createStore(allReducers);
import { StyleSheet, Text } from 'react-native';
const Stack = createStackNavigator();
import { useNetInfo } from '@react-native-community/netinfo';
import { getData, storeData } from './component/Screen/AsyncStorage.js';
import PushNotification from 'react-native-push-notification';

const App = (props) => {
  function checkTokenExist(token) {
    getData('User').then((dataNew) => {

      console.log(dataNew, "fsfdsfsdddddddddddd");
      if (dataNew.User) {

        if (dataNew.User.token == token.token) {
          console.log('Token  Match');
        } else {
          let obj = dataNew.User;
          obj['token'] = token.token;

          console.log('Token Not Match', dataNew.User.user_id);
          NetInfo.fetch().then((state) => {
            if (state.isConnected) {
              HomescreenService.updateToken({
                user_id: dataNew.User.user_id,
                token: token.token,
              })
                .then((response) => {
                  const { data } = response;

                  if (data) {
                    storeData('User', obj).then((response) => { });
                  } else {
                  }
                })
                .catch((error) => {
                  console.log('On Catch Add_Submission_Tagging_User', error);
                })
                .finally(() => { });
            }
          });
        }

      }

    });
  }

  const netInfo = useNetInfo();
  // const [loading, NewLoading] = useState(1);

  useEffect(() => {
    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids); // ['channel_id_1']
    });
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        checkTokenExist(token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        // alert("fsf");
        // console.log('NOTIFICATION:', notification);
        // process the notification here
        // required on iOS only
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: '308814786207',
      // iOS only
      //              permissions: {
      //                alert: true,
      //                badge: true,
      //                sound: true
      //              },
      popInitialNotification: true,
      //              requestPermissions: true
    });
    changeLoading();
  }, [netInfo]);

  function changeLoading() {
    props['NetInfo'] = netInfo.isConnected;
  }

  const screenOptionStyle = { headerShown: false };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={screenOptionStyle}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LevelScreen" component={LevelScreen} />
          <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ScoreScreen" component={ScoreScreen} />
          <Stack.Screen name="TicToeScreen" component={TicToeScreen} />
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LeaderBoard" component={LeaderBoard} />
          <Stack.Screen name="GameRules" component={GameRules} />

          <Stack.Screen name="EditLoginScreen" component={EditLoginScreen} />
        </Stack.Navigator>
        <FlashMessage position="bottom" />
      </NavigationContainer>
    </Provider>
  );
};
export default App;

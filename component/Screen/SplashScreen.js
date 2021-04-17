import React, { useEffect, useState } from 'react';
// Import required components
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
const { height, width } = Dimensions.get('window');
import stLogo from '../assets/quizIq.png';
import { getData, storeData } from './AsyncStorage.js';
const stLogo1 = Image.resolveAssetSource(stLogo).uri;
import DeviceInfo from 'react-native-device-info';
import HomescreenService from '../apiServices/HomescreenService';
import { showMessage, hideMessage } from 'react-native-flash-message';

const SplashScreen = ({ navigation }) => {
  var uniqueId = DeviceInfo.getUniqueId();
  const [deviceId, setDeviceId] = useState(uniqueId);

  const width = new Animated.Value(50);
  const height = new Animated.Value(100);
  const SITE_BANNER_VERTICAL_IMAGE = stLogo1;
  const SAMPLE_APP_LOGO =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/react_logo.png';
  const [loader, setLoader] = useState(true);
  var timeInter = '';

  useEffect(() => {
    Animated.timing(
      width, // The animated value to drive
      {
        toValue: 150, // Animate to opacity: 1 (opaque)
        duration: 2000, // Make it take a while
        useNativeDriver: false,
      },
    ).start(); // Starts the animation
    Animated.timing(
      height, // The animated value to drive
      {
        toValue: 300, // Animate to opacity: 1 (opaque)
        duration: 2000, // Make it take a while
        useNativeDriver: false,
      },
    ).start();

    // NetInfo.fetch().then(state => {
    //   console.log("Connection type", state.type);
    //   console.log("Is connected?", state.isConnected);
    setTimeout((x) => {
      checkLogin();
    }, 2000);

    // });
    // Starts the animation

    // console.log(getData("User"))

    // getData("User").then(res => {
    //   console.log(res)

    return () => {
      clearInterval(timeInter);
    };
    r;
  }, []);
  function checkInternet() {
    timeInter = setInterval((x) => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          showMessage({
            message: 'Internet Connected',
            type: 'success',
            autoHide: true,
            icon: 'success',
            position: 'top',
            floating: true,
            duration: 3000,
          });

          clearInterval(timeInter);
          checkLogin();
        }
      });
    }, 2000);
  }
  function checkLogin() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        HomescreenService.LoginUser({ user_name: deviceId })
          .then((response) => {
            const { data } = response;
            if (data.status) {
              console.log(data, "USERRRRR");
              storeData('User', data.Record[0]).then((storRes) => {
                storeData('Setting', data.setting[0]).then((res) => {
                  setTimeoutNew = setTimeout(() => {
                    navigation.replace('HomeScreen');
                  }, 2000);
                });
              });
            } else {
              storeData('Setting', data.setting[0]).then((res) => {
                setTimeoutNew = setTimeout(() => {
                  navigation.replace('LoginScreen');
                }, 3000);
              });
            }
          })
          .catch((error) => {
            console.log('On Catch Add_Submission_Tagging_User', error);
          })
          .finally(() => { });
      } else {
        setTimeout(() => {
          setLoader(false);
          checkInternet();
          showMessage({
            message: 'Please Check Your Internet Connection',
            type: 'warning',
            autoHide: false,
            icon: 'warning',
            position: 'top',
            floating: true,
          });
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: SITE_BANNER_VERTICAL_IMAGE }}
        style={{
          width: width,
          height: height,
          position: 'absolute',
          marginTop: 200,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appNameStyle: {
    marginTop: height * 0.2,
    fontSize: 25,
    fontFamily: 'PottaOne-Regular',
  },
  container: {
    flex: 1,
    height: height,
    // justifyContent: "space-around",
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    backgroundColor: 'rgba(11, 56, 82, 0.3)',
  },
  logo: {
    width: 100,
    height: 100,
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default SplashScreen;

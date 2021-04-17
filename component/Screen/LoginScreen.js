import React, { Component, useRef, useEffect, useState } from "react";
import { Dimensions, KeyboardAvoidingView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import DeviceInfo from 'react-native-device-info';
import { useNetInfo } from '@react-native-community/netinfo';
import { showMessage, hideMessage } from 'react-native-flash-message';
import HomescreenService from '../apiServices/HomescreenService';
import { getData, storeData } from './AsyncStorage.js'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";

const { height, width } = Dimensions.get("window");
var uniqueId = DeviceInfo.getUniqueId();
const LoginScreen = (props) => {
  const [deviceId, setDeviceId] =
    useState(uniqueId);
  const [selectedProfile, setSelectedProfile] = useState(-1);
  const [userName, setUserName] = useState(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  const data = [
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar1.png",
    },
    {
      id: 2,
      title: "X & 0",
      color: "#87CEEB",
      image: "https://bootdey.com/img/Content/avatar/avatar2.png",
    },
    {
      id: 3,
      title: "Logo Quiz",
      color: "#87CEEB",
      image: "https://bootdey.com/img/Content/avatar/avatar3.png",
    },
    {
      id: 4,
      title: "Image Quiz",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar4.png",
    },
    {
      id: 5,
      title: "Full Form Quiz",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar5.png",
    },
    {
      id: 6,
      title: "More",
      color: "#87CEEB",
      image: "https://bootdey.com/img/Content/avatar/avatar6.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar8.png",
    },
    {
      id: 5,
      title: "Full Form Quiz",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar5.png",
    },
    {
      id: 6,
      title: "More",
      color: "#87CEEB",
      image: "https://bootdey.com/img/Content/avatar/avatar6.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://bootdey.com/img/Content/avatar/avatar8.png",
    },
  ];
  const netInfo = useNetInfo();
  function goToQuestionScreen() {
    console.log('ugjh', netInfo.isConnected ? "dsdd" : "333");


    if (netInfo.isConnected) {

      let obj = {
        user_name: userName,
        uuid: deviceId,
        user_image: selectedProfile >= 0 ? data[selectedProfile].image : null

      }
      HomescreenService.addUser(obj)
        .then((response) => {
          console.log(response)
          const { data } = response;

          if (data.status) {
            showMessage({
              message: data.msg,
              type: 'success',
              icon: "success"
            });
            storeData("User", data.Record).then(storRes => {
              props.navigation.replace("HomeScreen");
            });
          } else {
            showMessage({
              message: data.msg,
              type: 'warning',
              icon: "warning"
            });

          }
        })
        .catch((error) => {
          showMessage({
            message: "Something Went Wrong",
            type: 'warning',
            icon: "warning"
          });
          console.log('On Catch Add_Submission_Tagging_User', error);
        })
        .finally(() => { });



    } else {
      showMessage({
        message: "Please check your internet connection",
        type: 'warning',
        icon: "warning"
      });
    }


  }
  // const imagebg = { uri: "https://img.freepik.com/free-photo/yellow-rectangular-wooden-box-drawn-face-outline-with-chalk-blackboard_23-2147874007.jpg" };

  return (
    // Try setting `flexDirection` to `column`. </ScrollView>

    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#43C6AC", "#F8FFAE"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={0}
        style={styles.linearGradienttop}
      //blurRadius={1}
      >
        <KeyboardAvoidingView>
          <View
            style={{
              height: height * 0.1,
              width: width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.levelStyle}>Profile</Text>
          </View>

          <View
            style={{
              height: height * 0.52,
              width: width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.row}>
              {data.map((x, index) => {
                return (
                  <Animated.View // Special animatable View
                    style={{
                      ...props.style,
                      ...styles.colF,

                      backgroundColor: index == selectedProfile ? "green" : "red",
                      opacity: fadeAnim, // Bind opacity to animated value
                    }}
                    key={index + "my"}
                  >
                    <TouchableOpacity onPress={() => setSelectedProfile(index)}>
                      {index >= 1000 ? null : (
                        <LinearGradient
                          colors={["#4c669f", "#3b5998", "#192f6a"]}
                          style={styles.levelBox}
                          key={index + "lin"}
                        >
                          <View
                            style={{
                              height: height * 0.13,

                              borderWidth: index == selectedProfile ? 5 : 2,
                              borderColor: index == selectedProfile ? "green" : "red",

                              width: "100%",
                              flex: 1,
                              flexDirection: "column",
                            }}
                            key={index + "lin3"}
                          >
                            <View
                              style={{
                                width: "100%",
                                height: height * 0.13,
                                backgroundColor: "#fff",
                                position: "relative",
                              }}
                            >
                              <Image
                                source={{ uri: x.image }}
                                style={{ height: "100%", width: "100%" }}
                              ></Image>
                            </View>
                          </View>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>

          <View
            style={{
              height: height * 0.1,
              width: width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://png.icons8.com/user/ultraviolet/50/3498db",
                }}
              />
              <TextInput
                style={styles.inputs}
                placeholder="User Name"
                onChangeText={userName => setUserName(userName)}
                underlineColorAndroid="transparent"
              />
            </View>

          </View>
          <TouchableOpacity
            onPress={() => goToQuestionScreen()}
            style={{
              height: height * 0.2,
              width: width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: height * 0.08,
                width: width * 0.5,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderRadius: 15,
              }}
            >
              <Text style={styles.levelStyle1}>Create</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  levelStyle: {
    fontFamily: "PottaOne-Regular",
    fontSize: 30,
  },
  levelStyle1: {
    fontFamily: "PottaOne-Regular",
    fontSize: 20,
  },
  linearGradienttop: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderBottomWidth: 1,
    width: width * 0.75,
    height: height * 0.07,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tinyLogo: {
    width: width * 0.7,
    height: height * 0.065,
    borderRadius: 10,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },

  container: {
    backgroundColor: "#fff",
    // paddingTop: 10,
    flex: 1,
    height: height,
  },
  starBox: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: "100%",
    height: height * 0.045,
    backgroundColor: "#F8FFAE",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {},
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 20,

    flexWrap: "wrap",
  },
  colF: {
    height: height * 0.14,
    width: "22%",
    marginBottom: "3%",
    //borderColor: "#93A0CB",
    // borderRadius: 10,
    //   borderWidth: 3,
    // borderStyle: "solid",
    //elevation: 5,
  },

  levelBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
    height: height * 0.13,
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: "#000",
  },
  listContainer: {},

  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});

export default LoginScreen;

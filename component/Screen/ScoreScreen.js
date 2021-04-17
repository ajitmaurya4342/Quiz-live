import React, { Component, useRef, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from "@react-native-community/netinfo";
import { showMessage, hideMessage } from 'react-native-flash-message';
import { storeData } from './AsyncStorage.js'

import HomescreenService from '../apiServices/HomescreenService';


import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,

  Alert,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  ImageBackground, Image
} from "react-native";

const { height, width } = Dimensions.get("window");



const ScoreScreen = (props) => {
  function goToNextLevel() {

    let new_level = props.route.params.nextLevel.split("-");

    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        HomescreenService.getQuestionByLevel({ level_id: new_level[1] })
          .then((response) => {

            const { data } = response;
            if (data.status) {
              storeData("QuestionArray", data.questionArray).then(response => {
                props.navigation.replace('LoadingScreen', {
                  game_id: props.route.params.game_id, user_id: props.route.params.user_id,
                  level_id: new_level[1], level: new_level[0], changeProfile2: props.route.params.changeProfile2
                })
              });


            }
          })
          .catch((error) => {
            console.log('On Catch Add_Submission_Tagging_User', error);
          })
          .finally(() => { });


      } else {

        showMessage({
          message: "Please Check Your Internet Connection",
          type: "warning",
          autoHide: true,
          icon: "warning",
          position: "top",
          floating: true
        })
      }

    })
  }

  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim])

  const [checkPass, setCheckPass] = useState(props.route.params.passedStatus);

  const imagebg = { uri: "https://img.freepik.com/free-photo/yellow-rectangular-wooden-box-drawn-face-outline-with-chalk-blackboard_23-2147874007.jpg" };
  return (
    // Try setting `flexDirection` to `column`. </ScrollView>

    <ScrollView >
      <LinearGradient
        colors={['#43C6AC', '#F8FFAE']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={0}


      >
        <View style={{
          height: height, flexDirection: "row", justifyContent: "space-around",
          alignItems: "center"
        }}>

          <View style={styles.shadow, {
            backgroundColor: "#fff", height: height * 0.8, width: width * 0.83,
            flexDirection: "column", justifyContent: "space-between", alignItems: "center", elevation: 10, borderRadius: 20,
          }}>

            <View style={{
              backgroundColor: "#43C6AC", height: height * 0.1, width: width * 0.65, marginTop: "-10%",
              flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderRadius: 10
            }}>
              <Text style={{ color: "#fff", fontSize: 25, fontFamily: "PottaOne-Regular", textAlign: "center" }}>{props.route.params.msgStatus}</Text>
            </View>

            <View style={{ height: height * 0.6, width: width * 0.7 }}>
              <View style={{ backgroundColor: "", height: height * 0.23, width: width * 0.7, flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                {checkPass ? <Icon name="check-square-o" size={height * 0.16} color="#C7EC9D" /> : <Icon name="times" size={height * 0.16} color="#F21A08" />}
                <Text style={{ color: "#000", fontSize: height * 0.05, fontFamily: "PottaOne-Regular", }}> {checkPass ? "Excellent" : "You Lost"} </Text>

              </View>
              <View style={{
                backgroundColor: "white", height: height * 0.25, width: width * 0.7,
                flexDirection: "column", justifyContent: "space-around", alignItems: "center", borderColor: "#ECE99D",
                borderWidth: 15, marginTop: 10, borderRadius: 30
              }}>
                <Text style={{ color: "#000", fontFamily: "PottaOne-Regular", fontSize: height * 0.05 }}>{checkPass ? "Your Score" : "Try Again !"} </Text>

                {checkPass ? <Text style={{ color: "#000", fontFamily: "PottaOne-Regular", fontSize: height * 0.05, letterSpacing: 5 }}> {props.route.params.score}/{props.route.params.out_of} </Text> : null}

              </View>
              <View style={{
                height: height * 0.20, width: width * 0.7, flexDirection: "row",
                justifyContent: "space-around", alignItems: "center"
              }}>
                <TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={() => {
                  props.navigation.replace('LoadingScreen', { game_id: props.route.params.game_id, user_id: props.route.params.user_id, level_id: props.route.params.level_id, level: props.route.params.level, changeProfile2: props.route.params.changeProfile2 })
                }} >
                  <Icon name="repeat" size={height * 0.06} />
                </TouchableOpacity>
                {checkPass ? <TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={() => {
                  goToNextLevel()
                }}>
                  <Icon name="arrow-right" size={height * 0.06} />
                </TouchableOpacity> : null}
                <TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={() => {
                  props.route.params.changeProfile2();
                  props.navigation.goBack();
                }} >
                  <Icon name="home" size={height * 0.06} />
                </TouchableOpacity>
              </View>

            </View>


            <View style={{ backgroundColor: "transparent", height: height * 0.1, width: width * 0.7, bottom: "-10%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
              {checkPass && props.route.params.starCheck.map((y, index1) => {
                return (
                  <Icon name={y} size={height * 0.11} color="#E48702" key={index1 + "dd"} />
                )
              })

              }


            </View>

          </View>


        </View>
      </LinearGradient>

    </ScrollView >
  );
};
const styles = StyleSheet.create({
  btnAction: {
    height: 70,
    width: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: "#fff",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  }

});

export default ScoreScreen;

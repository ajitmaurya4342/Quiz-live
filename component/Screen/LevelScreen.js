import React, { Component, useRef, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Icon from "react-native-vector-icons/FontAwesome";
import NetInfo from "@react-native-community/netinfo";
import HomescreenService from '../apiServices/HomescreenService';
import { storeData, getData } from './AsyncStorage.js'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  ImageBackground, Image
} from "react-native";

const { height, width } = Dimensions.get("window");
var timeInter = "";

const LevelScreen = (props) => {
  const [showModal, setShowModal] = useState(false);
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
    getGameLevel()
  }, [fadeAnim]);

  function checkInternet() {

    timeInter = setInterval(x => {
      NetInfo.fetch().then(state => {

        if (state.isConnected) {

          showMessage({
            message: "Internet Connected",
            type: "success",
            autoHide: true,
            icon: "success",
            position: "top",
            floating: true,
            duration: 3000

          })

          clearInterval(timeInter)
          getGameLevel()

        }

      })

    }, 2000)

  }
  function getGameLevel() {

    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        HomescreenService.getGameLevelScreen({ game_id: props.route.params.game_id, user_id: props.route.params.user_id })
          .then((response) => {


            const { data } = response;

            if (data.status) {
              setCurrentLevel(data.current_user_level - 1)
              setData(data.Record)



            }
          })
          .catch((error) => {
            console.log('On Catch Add_Submission_Tagging_User', error);
          })
          .finally(() => { });


      } else {
        setTimeout(() => {
          checkInternet()
          showMessage({
            message: "Please Check Your Internet Connection",
            type: "warning",
            autoHide: false,
            icon: "warning",
            position: "top",
            floating: true
          });


        }, 100)
      }

    })


  }
  const [data, setData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  function goToQuestionScreen(x, index) {

    getData("Setting").then(setRes => {
      getData("User").then(userRes => {
        let SettingDetail = setRes.Setting;
        let UserDetail = userRes.User;
        if ((parseInt(UserDetail.user_points) >= parseInt(SettingDetail.level_fail_dedution_point) && index == currentLevel) || index < currentLevel) {
          NetInfo.fetch().then(state => {
            if (state.isConnected) {

              HomescreenService.getQuestionByLevel({ level_id: x.level_id })
                .then((response) => {

                  const { data } = response;
                  if (data.status) {
                    storeData("QuestionArray", data.questionArray).then(response => {
                      props.navigation.replace('LoadingScreen', {
                        game_id: props.route.params.game_id, user_id: props.route.params.user_id,
                        level_id: x.level_id, level: x.level, changeProfile2: props.route.params.changeProfile2
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

        } else {


          //          showMessage({
          //            message: `You Need Atleast ${SettingDetail.level_fail_dedution_point} coins to play Level ${currentLevel + 1}`,
          //            type: "warning",
          //            autoHide: true,
          //            icon: "warning",
          //            position: "top",
          //            floating: true,
          //            duration: 2000
          //          })
          //          setTimeout(x => {
          setShowModal(true)
          //          }, 2000);

        }

      })
    })

  }

  function razorPay(item) {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        var options = {
          description: `Get ${item.point} Coins`,
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: 'rzp_test_9DGWhlQ7ZzbZcw', // Your api key
          amount: parseInt(item.amount) * 100,
          name: 'Quiz IQ',
          theme: { color: '#43C6AC' }
        }

        RazorpayCheckout.open(options).then((data) => {

          let payload = {
            user_id: props.route.params.user_id,
            payment_detail: JSON.stringify(data),
            payment_id: data.razorpay_payment_id,
            amount: item.amount,
            point: item.point
          };


          HomescreenService.transaction_detail(payload)
            .then((response) => {
              console.log(response.data)
              if (response.data.status) {
                setShowModal(false);

                storeData("User", response.data.UserArray[0]).then(strUser => {

                  props.route.params.changeProfile2();

                  showMessage({
                    message: `Your Payment Completed Successfully`,
                    type: "success",
                    autoHide: true,
                    icon: "warning",
                    position: "top",
                    floating: true,
                    duration: 2000
                  });

                })

              } else {
                showMessage({
                  message: `Your payment Failed`,
                  type: "warning",
                  autoHide: true,
                  icon: "warning",
                  position: "top",
                  floating: true,
                  duration: 2000
                })
              }

            }).catch(err => {
            })
        }).catch((error) => {
          console.log(error, "error");
          // handle failure

        });
      } else {


        showMessage({
          message: `You Need Atleast ${SettingDetail.level_fail_dedution_point} coins to play Level ${currentLevel + 1}`,
          type: "warning",
          autoHide: true,
          icon: "warning",
          position: "top",
          floating: true,
          duration: 2000
        })
        setTimeout(x => {
          setShowModal(true)
        }, 2000);

      }
    })

  }
  const settingData = [
    { id: 1, iconName: 'cubes', description: '500 coins', amount: "10", amountIcon: "inr", point: 500 },
    { id: 2, iconName: 'cubes', description: '1000 Coins', amount: "20", amountIcon: "inr", point: 1000 },
    { id: 3, iconName: 'cubes', description: '2000 Coins', amount: "30", amountIcon: "inr", point: 2000 },
    { id: 4, iconName: 'cubes', description: '3000 Coins', amount: "40", amountIcon: "inr", point: 3000 },

    // {id:2, iconName:"speaker-notes", description: "Instruction",Info:},
  ];

  const imagebg = { uri: "https://img.freepik.com/free-photo/yellow-rectangular-wooden-box-drawn-face-outline-with-chalk-blackboard_23-2147874007.jpg" };

  return (
    // Try setting `flexDirection` to `column`. </ScrollView>

    <SafeAreaView style={styles.container}>
      <ScrollView >

        <LinearGradient
          colors={['#43C6AC', '#F8FFAE']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          useAngle
          angle={0}
          style={styles.linearGradienttop}
        //blurRadius={1}

        >
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            {/*All views of Modal*/}
            {/*Animation can be slide, slide, none*/}
            <View style={styles.modal}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'PottaOne-Regular',
                  fontSize: 25,
                  marginTop: 20,
                }}>
                Buy Coins
              </Text>
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'PottaOne-Regular',
                  fontSize: height * 0.023,
                  marginTop: 10,
                }}>
                You have insufficient coins to play !
                            </Text>
              <FlatList
                style={styles.notificationList}
                data={props.route.params.paymentArray}
                keyExtractor={(item) => {
                  return item.id.toString();
                }}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.notificationBox} key={index + '44'} >
                      <Icon
                        name={item.iconName}
                        size={height * 0.06}
                        color="#e9ad03"
                      />
                      <Text style={styles.settingName}>{item.description}</Text>
                      <TouchableHighlight style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#000", width: width * 0.2, justifyContent: "center", borderRadius: 20 }} onPress={() => {
                        razorPay(item);

                      }}>
                        <>
                          <Icon
                            name={item.amountIcon}
                            size={height * 0.03}
                            color="#fff"
                          />

                          <Text style={styles.settingNameAmount}>{item.amount}</Text>
                        </>
                      </TouchableHighlight>
                      {/* <TouchableHighlight onPress={() => {
                        var options = {
                          description: 'Credits towards consultation',
                          image: 'https://i.imgur.com/3g7nmJC.png',
                          currency: 'INR',
                          key: '', // Your api key
                          amount: '5000',
                          name: 'foo',
                          prefill: {
                            email: 'void@razorpay.com',
                            contact: '9191919191',
                            name: 'Razorpay Software'
                          },
                          theme: { color: '#F37254' }
                        }

                        RazorpayCheckout.open(options).then((data) => {
                          // handle success
                          alert(`Success: ${data.razorpay_payment_id}`);
                        }).catch((error) => {
                          // handle failure
                          alert(`Error: ${error.code} | ${error.description}`);
                        });

                      }}>

                      </TouchableHighlight> */}

                    </View>
                  );
                }}
              />


              <TouchableOpacity
                style={styles.settingBack}
                onPress={() => {
                  setShowModal(!showModal);
                }}>
                <MaterialIcon
                  name="keyboard-backspace"
                  size={height * 0.1}
                  color="green"
                />
                <Text style={styles.bottomText}>Back</Text>
              </TouchableOpacity>

              {/* <Button
              title="Click To Close Modal"
             
            /> */}
            </View>
          </Modal>

          <View style={{
            width: "100%", height: height * 0.1, flexDirection: "row", justifyContent: "space-around",
            alignItems: "center"
          }}>

            <Text style={styles.levelStyle} >Select Level</Text>



          </View>

          <View style={styles.row}>
            {data.length > 0 && data.map((x, index) => {
              return (

                <Animated.View                 // Special animatable View
                  style={{
                    ...props.style,
                    ...styles.colF,
                    opacity: fadeAnim,         // Bind opacity to animated value
                  }}
                  key={index + "my"}
                >
                  <TouchableOpacity onPress={() => {
                    if (index <= currentLevel && x.level_is_active == '1') {
                      goToQuestionScreen(x, index)
                    }
                  }}>

                    {index > currentLevel || x.level_is_active == '0' ? (
                      <LinearGradient
                        colors={["#4c669f", "#3b5998", "#192f6a"]}
                        style={styles.levelBox}
                      >
                        <View
                          style={{
                            opacity: 0.5,
                            height: height * 0.14,
                            backgroundColor: "#000",
                            width: "100%",
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          {x.level_is_active == '1' ? (<Icon name="lock" size={50} color="#dddddd" />) : (<Text style={{ color: "#fff", fontSize: 20, textAlign: "center", fontWeight: "bold" }}>Coming Soon </Text>)}
                        </View>
                      </LinearGradient>
                    ) : (

                      <LinearGradient
                        colors={["#4c669f", "#3b5998", "#192f6a"]}
                        style={styles.levelBox}
                        key={index + "lin"}
                      >
                        <View
                          style={{
                            height: height * 0.13,
                            backgroundColor: "#fff",
                            width: "100%",
                            flex: 1,
                            flexDirection: "column",
                          }}
                          key={index + "lin3"}
                        >

                          <View
                            style={{

                              width: "100%",
                              height: height * 0.085,
                              backgroundColor: "#fff",
                            }}
                          >
                            <Text
                              style={{
                                color: "#000",
                                fontSize: height * 0.06,
                                fontFamily: 'PottaOne-Regular',
                                textAlign: "center",
                              }}
                            >
                              {index + 1}
                            </Text>
                          </View>

                          <View style={styles.starBox}>
                            {x.star_array.map((y, index1) => {
                              return (
                                <Icon name={y} size={height * 0.03} color="green" key={index1 + "ic"} />

                              )
                            })
                            }

                          </View>
                        </View>
                      </LinearGradient>

                    )
                    }
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  levelStyle: {
    fontFamily: 'PottaOne-Regular',
    fontSize: 30,
  },
  linearGradienttop: {


    flex: 1,
    // paddingLeft: 15,
    //  paddingRight: 15,
    // borderTopRightRadius: 35,
    // borderTopLeftRadius: 35,
    //  marginRight: 20,
    // marginLeft: 20,
    shadowColor: '#00000021',
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    //borderWidth: 10,
    // borderTopColor: '#1b1b1b',

    // elevation: 20,
  },
  tinyLogo: {
    width: width * 0.7,
    height: height * 0.065,
    borderRadius: 10,

  },
  container: {

    backgroundColor: "#fff",
    // paddingTop: 10,
    flex: 1

  },
  starBox: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: "100%",
    height: height * 0.045,
    backgroundColor: "#F8FFAE",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {


  },
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",

    flexWrap: "wrap",
  },
  colF: {
    height: height * 0.14,
    width: "27.333333%",
    backgroundColor: "green",
    marginBottom: "3%",
    //borderColor: "#93A0CB",
    // borderRadius: 10,
    //   borderWidth: 3,
    // borderStyle: "solid",
    //elevation: 5,
  },
  notificationList: {
    marginTop: height * 0.05,
  },
  modal: {
    flex: 1,
    height: height * 0.9,
    alignItems: 'center',
    backgroundColor: '#43C6AC',
    opacity: 0.95,
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
  notificationBox: {
    width: width,
    borderRadius: 5,
    padding: width * 0.02,
    marginTop: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: 'green',
    // justifyContent:'space-around',
  },
  settingBack: {
    marginBottom: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'PottaOne-Regular',
  },
  settingName: {
    fontSize: height * 0.025,
    fontFamily: 'PottaOne-Regular',
    color: '#000',
    padding: 4,
    //flex: 1,
    alignSelf: 'center',
  },
  settingNameAmount: {
    fontSize: height * 0.025,
    fontFamily: 'PottaOne-Regular',
    color: '#fff',
    padding: 4,
    //flex: 1,
    alignSelf: 'center',
  },
});

export default LevelScreen;

import React, { Component, useRef, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import HomescreenService from '../apiServices/HomescreenService';
import { getData, storeData } from './AsyncStorage.js'
import { showMessage, hideMessage } from 'react-native-flash-message';
import NetInfo from "@react-native-community/netinfo";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";

const { height, width } = Dimensions.get("window");

const LeaderBoardScreen = (props) => {


  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: true,
    }).start();
    getDataNew();
  }, [fadeAnim]);

  const data = [
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 2,
      title: "X & 0",
      color: "#87CEEB",
      image: "https://img.icons8.com/office/70/000000/home-page.png",
    },
    {
      id: 3,
      title: "Logo Quiz",
      color: "#87CEEB",
      image: "https://img.icons8.com/color/70/000000/two-hearts.png",
    },
    {
      id: 4,
      title: "Image Quiz",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/family.png",
    },
    {
      id: 5,
      title: "Full Form Quiz",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/groups.png",
    },
    {
      id: 6,
      title: "More",
      color: "#87CEEB",
      image: "https://img.icons8.com/color/70/000000/classroom.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 2,
      title: "X & 0",
      color: "#87CEEB",
      image: "https://img.icons8.com/office/70/000000/home-page.png",
    },
    {
      id: 3,
      title: "Logo Quiz",
      color: "#87CEEB",
      image: "https://img.icons8.com/color/70/000000/two-hearts.png",
    },
    {
      id: 4,
      title: "Image Quiz",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/family.png",
    },
    {
      id: 5,
      title: "Full Form Quiz",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/groups.png",
    },
    {
      id: 6,
      title: "More",
      color: "#87CEEB",
      image: "https://img.icons8.com/color/70/000000/classroom.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
    {
      id: 1,
      title: "Math333",
      color: "#FFF",
      image: "https://img.icons8.com/color/70/000000/name.png",
    },
  ];
  const [RankList, setRankList] = useState([]);
  const [UserRank, setUserRank] = useState([]);
  const [UserPoint, setUserPoint] = useState([]);


  function getDataNew() {
    setRankList(props.route.params.listUser)
    setUserPoint(props.route.params.UserPoint)
    setUserRank(props.route.params.UserRank)
  }


  function changeLeaderBoard(item, index) {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getData("User").then(res => {
          let UserDetail = res.User;
          HomescreenService.getLeaderBoard({ user_id: UserDetail.user_id, game_id: item.game_id })
            .then((response) => {
              const { data } = response;

              if (data) {
                setSelectedCat(index)
                console.log(data)
                setUserRank(data.UserRank);
                setUserPoint(data.UserPoint);
                setRankList(data.Record.data);

              } else {
              }
            })
            .catch((error) => {
              console.log('On Catch Add_Submission_Tagging_User', error);
            })
            .finally(() => { });

        })

      } else {
        setTimeout(() => {
          showMessage({
            message: "Please Check Your Internet Connection",
            type: "warning",
            autoHide: true,
            icon: "warning",
            position: "top",
            floating: true
          })

        }, 100)


      }

    })


  }

  const imagebg = {
    uri:
      "https://img.freepik.com/free-photo/yellow-rectangular-wooden-box-drawn-face-outline-with-chalk-blackboard_23-2147874007.jpg",
  };
  const GameAray = ["All", "Logo ", "Image", "Math"];
  const [selectedCat, setSelectedCat] = useState(0);

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
        <View
          style={{
            height: height * 0.23,
            width: width,

            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="trophy" color="#BCA748" size={height * 0.15} />
          <Text style={styles.levelStyle}> LeaderBoard </Text>
        </View>
        <View
          style={{
            height: height * 0.1,
            width: width,
            backgroundColor: "#fff",

            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props.route.params.gameData.map((x, index) => {
            return (
              <TouchableOpacity
                style={{
                  width: "25%",
                  backgroundColor: index == selectedCat ? "#fff" : "lightgrey",
                  height: height * 0.1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index + "33"}
                onPress={() => changeLeaderBoard(x, index)}
              >
                <Text style={styles.levelStyle1}>{x.game_name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            height: height * 0.1,
            width: width,
            backgroundColor: "#fff",
            flexDirection: "row",
          }}

        >
          <View
            style={{
              height: height * 0.1,
              width: "32%",
              backgroundColor: "#fff",
              borderBottomColor: "#000",
              borderBottomWidth: 2,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "PottaOne-Regular",
                fontSize: height * 0.021,
              }}
            >
              {UserRank ? "#" + UserRank : "-"}
            </Text>

            <View
              style={{
                backgroundColor: "#000",
                height: height * 0.07,
                width: width * 0.12,
                borderRadius: 20,
              }}
            >
              <Image
                source={{
                  uri:
                    props.route.params.UserDetail.user_image,
                }}
                style={{ height: height * 0.07, width: width * 0.12 }}
              />
            </View>
          </View>
          <View
            style={{
              height: height * 0.1,
              width: "50%",
              backgroundColor: "#fff",
              borderBottomColor: "#000",
              justifyContent: "center",
              alignItems: "center",
              borderBottomWidth: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "PottaOne-Regular",
                fontSize: height * 0.021,
              }}
            >
              You
                            </Text>
          </View>
          <View
            style={{
              height: height * 0.1,
              width: "18%",
              backgroundColor: "#fff",
              borderBottomColor: "#000",
              borderBottomWidth: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "PottaOne-Regular",
                fontSize: height * 0.021,
                color: "#BCA748",
              }}
            >
              {UserPoint}
            </Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.row}>
            {RankList.length > 0 && RankList.map((x, index) => {
              return (
                <View
                  style={{
                    height: height * 0.1,
                    width: width,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                  }}
                  key={index + "334"}
                >
                  <View
                    style={{
                      height: height * 0.1,
                      width: "32%",
                      backgroundColor: "#fff",
                      borderBottomColor: "#000",
                      borderBottomWidth: 2,
                      justifyContent: "space-around",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PottaOne-Regular",
                        fontSize: height * 0.021,
                      }}
                    >
                      #{x.Rank}
                    </Text>

                    <View
                      style={{
                        backgroundColor: "#000",
                        height: height * 0.07,
                        width: width * 0.12,
                        borderRadius: 20,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            x.user_image,
                        }}
                        style={{ height: height * 0.07, width: width * 0.12 }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: height * 0.1,
                      width: "50%",
                      backgroundColor: "#fff",
                      borderBottomColor: "#000",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottomWidth: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PottaOne-Regular",
                        fontSize: height * 0.021,
                      }}
                    >
                      {x.user_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: height * 0.1,
                      width: "18%",
                      backgroundColor: "#fff",
                      borderBottomColor: "#000",
                      borderBottomWidth: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PottaOne-Regular",
                        fontSize: height * 0.021,
                        color: "#BCA748",
                      }}
                    >
                      {x.score}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  levelStyle: {
    fontFamily: "PottaOne-Regular",
    fontSize: height * 0.04,
  },
  levelStyle1: {
    fontFamily: "PottaOne-Regular",
    fontSize: height * 0.024,
  },
  linearGradienttop: {
    flex: 1,
    // paddingLeft: 15,
    //  paddingRight: 15,
    // borderTopRightRadius: 35,
    // borderTopLeftRadius: 35,
    //  marginRight: 20,
    // marginLeft: 20,
    shadowColor: "#00000021",
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
    flex: 1,
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
    flexDirection: "column",
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

export default LeaderBoardScreen;

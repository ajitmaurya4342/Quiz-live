import React, { Component, useRef, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { computerPoint, playerPoint, drawPoint } from "../../actions/index.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
var RNFS = require("react-native-fs");
var path = RNFS.DocumentDirectoryPath + "/game.txt";

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
  ImageBackground,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
import { soundNeed } from './SoundPage.js'



const TicToeScreen = (props) => {

  // const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Animated.timing(fadeAnim, {
    //   toValue: 1,
    //   duration: 1400,
    //   useNativeDriver: true,
    // }).start();

    // create a path you want to write to

    RNFS.readFile(path, "utf8")
      .then((success) => {
        console.log("fdfds")
        setSinglePoints(JSON.parse(success));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  let winningArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //diagonal
    [2, 4, 6], //diagonal
  ];

  let arrayNew = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [turn, setTurn] = useState("x");
  const [gameKey, setGameKey] = useState(arrayNew);
  const [playerPlay, setPlayerPress] = useState([]);
  const [computerPlay, setComputerPress] = useState([]);
  const [singlePlayer, setSinglePlayer] = useState(true); //Is Single Player Game
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [waitPlayer, setPlayerWait] = useState(false); // Is My Turn  //Reset Dynami// Is My Turn  //Reset Dynamic
  const [isPlayerFirstTurn, setIsPlayerFirstTurn] = useState(false); // Is my first turn //Reset Dynamic
  const [gameResult, setGameResult] = useState(false); //Final Result
  const [whoWon, setWhoWon] = useState(0); //1 for player //2 for computer //3 for draw
  const [NewComputerWinningZone, setNewComputerWinningZone] = useState([]);
  const [NewPlayerWinningZone, setNewPlayerWinningZone] = useState([]);
  const [GameType, setGameType] = useState(["Easy", "Medium", "Difficult"]);
  const [GameTypeValue, setGameTypeValue] = useState("Easy");
  const [winningArrayNew, setWinningArray] = useState([]);
  let initialPoint = {
    playerPoint: 0,
    computerPoint: 0,
    drawPoint: 0,
  };
  const [singleStats, setSinglePoints] = useState(initialPoint);
  const [multiplayerPoint, setMultiplayerPoint] = useState(initialPoint);

  const imagebg = {
    uri:
      "https://img.freepik.com/free-photo/yellow-rectangular-wooden-box-drawn-face-outline-with-chalk-blackboard_23-2147874007.jpg",
  };
  let initialArrayValue = [
    { value: "", name: "0" },
    { value: "", name: "1" },
    { value: "", name: "2" },
    { value: "", name: "3" },
    { value: "", name: "4" },
    { value: "", name: "5" },
    { value: "", name: "6" },
    { value: "", name: "7" },
    { value: "", name: "8" },
  ];
  const [gameX0, setGameX0] = useState(initialArrayValue);

  function resetForm() {
    setGameResult(false);
    setTurn("x");
    setGameX0(initialArrayValue);
    setGameKey(arrayNew);
    setPlayerPress([]);
    setComputerPress([]);
    setNewComputerWinningZone([]);
    setNewPlayerWinningZone([]);
    setWhoWon(0);
    setWinningArray([]);
  }

  useEffect(() => {
    if (
      singlePlayer &&
      isPlayerTurn == false &&
      gameResult == false &&
      gameKey.length > 0
    ) {
      setPlayerWait(true);
      let countRandom = 0;
      let indexTurn = 0;
      if (NewComputerWinningZone.length > 0 && GameTypeValue == "Difficult") {
        NewComputerWinningZone.map((x) => {
          x.map((z) => {
            let findIndexRemaning = gameKey.indexOf(z);
            if (findIndexRemaning >= 0) {
              indexTurn = findIndexRemaning;
              countRandom++;
            }
          });
        });
      }

      if (
        NewPlayerWinningZone.length > 0 &&
        countRandom == 0 &&
        (GameTypeValue == "Medium" || GameTypeValue == "Difficult")
      ) {
        NewPlayerWinningZone.map((x) => {
          x.map((z) => {
            let findIndexRemaning = gameKey.indexOf(z);
            if (findIndexRemaning >= 0) {
              indexTurn = findIndexRemaning;
              countRandom++;
            }
          });
        });
      }

      if (gameKey.length > 0) {
        if (countRandom == 0) {
          indexTurn = Math.floor(Math.random() * gameKey.length) + 1 - 1;
        }
        let remainingBox = gameKey[indexTurn];
        let checkIndex = gameX0.findIndex((x) => {
          return x.name == remainingBox.toString();
        });
        setTimeout((x) => {
          changeTurn(gameX0[checkIndex], checkIndex);
          setTimeout((x) => {
            setPlayerWait(false);
          }, 100);
        }, 500);
      }
    }
  }, [isPlayerTurn]);

  function checkWinningFunction(
    NewPlayerArray,
    NewComputerArray,
    remainingBox,
    playerTurnCheck
  ) {
    let NewPlayerWinningZone2 = [];
    let NewComputerWinningZone2 = [];
    let finalCount = 0;

    if (NewComputerArray.length > 1 || NewPlayerArray.length > 1) {
      winningArray.map((x) => {
        let NewPlayerCount = 0;
        let NewComputerCount = 0;
        x.map((z) => {
          let findNewPlayerIndex = NewPlayerArray.indexOf(z);
          if (findNewPlayerIndex >= 0) {
            NewPlayerCount++;
          }

          let findNewComIndex = NewComputerArray.indexOf(z);
          if (findNewComIndex >= 0) {
            NewComputerCount++;
          }

          if (NewPlayerCount == 3) {
            console.log(x);
            setWinningArray(x);

            if (props.gamePoint.sound) {
              soundNeed('correct.mp3')
            }

            if (singlePlayer) {
              props.playerPoint();

              RNFS.writeFile(
                path,
                JSON.stringify({
                  ...singleStats,
                  playerPoint: singleStats["playerPoint"] + 1,
                }),
                "utf8"
              )
                .then((success) => {
                  console.log("FILE WRITTEN!");
                  setSinglePoints({
                    ...singleStats,
                    playerPoint: singleStats["playerPoint"] + 1,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
            } else {
              let playerPointNew = { ...multiplayerPoint };
              console.log(playerPointNew);

              if (turn == "o") {
                playerPointNew["playerPoint"] = playerPointNew["playerPoint"] + 1;
                setMultiplayerPoint(playerPointNew);

              } else {
                playerPointNew["computerPoint"] = playerPointNew["computerPoint"] + 1;
                setMultiplayerPoint(playerPointNew);

              }


            }

            setWhoWon(1);
            setGameResult(true);
            finalCount++;

            setTimeout((x) => {
              resetForm();
              setIsPlayerTurn(true);
              setIsPlayerFirstTurn(true);
            }, 2000);
          } else if (NewPlayerCount == 2) {
            NewPlayerWinningZone2.push(x);
          }
          if (NewComputerCount == 3) {

            setWinningArray(x);
            if (singlePlayer) {
              props.computerPoint();
              RNFS.writeFile(
                path,
                JSON.stringify({
                  ...singleStats,
                  computerPoint: singleStats["computerPoint"] + 1,
                }),
                "utf8"
              )
                .then((success) => {
                  console.log("FILE WRITTEN!");
                  setSinglePoints({
                    ...singleStats,
                    computerPoint: singleStats["computerPoint"] + 1,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                });
            } else {
              let playerPointNew = { ...multiplayerPoint };
              console.log(playerPointNew);


              if (turn == "o") {
                playerPointNew["playerPoint"] = playerPointNew["playerPoint"] + 1;
                setMultiplayerPoint(playerPointNew);

              } else {
                playerPointNew["computerPoint"] = playerPointNew["computerPoint"] + 1;
                setMultiplayerPoint(playerPointNew);

              }
            }

            if (props.gamePoint.sound && singlePlayer) {
              soundNeed('wrong.mp3')
            } else {
              soundNeed('correct.mp3')
            }
            setGameResult(true);
            setWhoWon(2);
            finalCount++;

            setTimeout((x) => {
              resetForm();
              setIsPlayerTurn(false);
              setIsPlayerFirstTurn(false);
            }, 2000);
          } else if (NewComputerCount == 2) {
            NewComputerWinningZone2.push(x);
          }
        });
      });

      if (remainingBox.length == 0 && finalCount == 0) {
        if (props.gamePoint.sound) {
          soundNeed('wrong.mp3')
        }
        if (singlePlayer) {
          props.drawPoint();

          RNFS.writeFile(
            path,
            JSON.stringify({
              ...singleStats,
              drawPoint: singleStats["drawPoint"] + 1,
            }),
            "utf8"
          )
            .then((success) => {
              console.log("FILE WRITTEN!");
              setSinglePoints({
                ...singleStats,
                drawPoint: singleStats["drawPoint"] + 1,
              });
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else {
          let playerPointNew = { ...multiplayerPoint };
          console.log(playerPointNew);
          playerPointNew["drawPoint"] = playerPointNew["drawPoint"] + 1;
          setMultiplayerPoint(playerPointNew);
        }
        setGameResult(true);
        setWhoWon(3);
        finalCount++;

        setTimeout((x) => {
          resetForm();
          if (isPlayerFirstTurn) {
            setPlayerWait(false);
            setIsPlayerTurn(false);
            setIsPlayerFirstTurn(false);
          } else {
            setIsPlayerTurn(true);
            setIsPlayerFirstTurn(true);
          }
        }, 2000);
      } else {
        setIsPlayerTurn(playerTurnCheck);
        if (props.gamePoint.sound && finalCount == 0) {
          if (turn == 'x') {
            soundNeed('xSound.mp3')
          } else {
            soundNeed('oSound.mp3')

          }
        }
      }
      setNewComputerWinningZone(NewComputerWinningZone2);

      setNewPlayerWinningZone(NewPlayerWinningZone2);
    } else {
      if (props.gamePoint.sound && finalCount == 0) {
        if (turn == 'x') {
          soundNeed('xSound.mp3')
        } else {
          soundNeed('oSound.mp3')

        }
      }
      setIsPlayerTurn(playerTurnCheck);
    }


  }

  function changeTurn(item, index) {
    console.log(props.gamePoint.sound);

    if (item.value == "") {

      let remainingBox = [...gameKey];
      let findRemainingIndex = remainingBox.indexOf(index);
      remainingBox.splice(findRemainingIndex, 1);
      setGameKey(remainingBox);
      let newArray = [...gameX0];
      newArray[index]["value"] = turn;
      setGameX0(newArray);

      if (turn == "x") {
        setTurn("o");
      } else {
        setTurn("x");
      }
      let NewPlayerArray = [...playerPlay];
      let NewComputerArray = [...computerPlay];
      if (isPlayerTurn) {
        NewPlayerArray.push(index);
        setPlayerPress(NewPlayerArray);
      } else {
        NewComputerArray.push(index);
        setComputerPress(NewComputerArray);
      }

      let playerTurnCheck = !isPlayerTurn;
      if (remainingBox.length == 0) {
      }

      checkWinningFunction(
        NewPlayerArray,
        NewComputerArray,
        remainingBox,
        playerTurnCheck
      );
    } else {
      console.log("Already Exist");
    }
  }
  return (
    // Try setting `flexDirection` to `column`. </ScrollView>
    <View>
      <LinearGradient
        colors={['#43C6AC', '#F8FFAE']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={0}
        style={styles.linearGradienttop}
      //blurRadius={1}

      >
        <View
          style={{
            backgroundColor: 'transparent',
            height: height,
            position: "relative",

          }}
        >
          {gameResult ? (
            <View
              style={{
                backgroundColor: "#000",
                height: height,
                width: width,
                position: "absolute",
                zIndex: 999,
                opacity: 0.6,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  color: "#fff",
                  backgroundColor: "#000",
                  width: "90%",
                  height: height * 0.07,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: height * 0.032,
                    textAlign: "center",
                    fontFamily: 'PottaOne-Regular',
                  }}
                >
                  {singlePlayer
                    ? whoWon == 1
                      ? `You won this game `
                      : whoWon == 2 && singlePlayer
                        ? `Computer won this game `
                        : `Game is draw `
                    : whoWon == 1 || whoWon == 2
                      ? `${turn == "x" ? "O" : "X"} player wins `
                      : `Game is Draw `}

                  <Icon
                    name={
                      whoWon == 1 || (whoWon == 2 && !singlePlayer)
                        ? "smile-o"
                        : whoWon == 2 && singlePlayer
                          ? "frown-o"
                          : "meh-o"
                    }
                    size={height * 0.04}
                    color="#ffdc5d"
                  ></Icon>
                </Text>
              </View>
            </View>
          ) : null}


          <View
            style={{
              height: height * 0.97,
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "transparent",

            }}
          >
            {singlePlayer ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  height: height * 0.09,
                  width: width * 0.95,
                  borderColor: "#69693A",
                  borderWidth: 2,
                  borderRadius: 20,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {GameType.map((x, index) => {
                  return (
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        setGameTypeValue(x);
                        resetForm();
                      }}
                      key={index + "dsd"}
                    >
                      <Icon
                        name={x == GameTypeValue ? "check-square-o" : "square-o"}
                        size={height * 0.04}
                        color={x == GameTypeValue ? "green" : "#000"}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontFamily: 'PottaOne-Regular',
                          fontSize: height * 0.025,
                          color: x == GameTypeValue ? "green" : "#000",
                        }}
                      >
                        {x}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
                <View
                  style={{
                    backgroundColor: "#fff",
                    height: height * 0.09,
                    width: width * 0.95,
                    borderColor: "#69693A",
                    borderWidth: 2,
                    borderRadius: 20,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: height * 0.03, fontWeight: "bold" }}>
                    Turn "{turn}" Player
            </Text>
                </View>
              )}

            <View
              style={
                (styles.shadow,
                {
                  backgroundColor: "#EDE0C3",
                  height: height * 0.39,
                  width: width * 0.8,
                  flexDirection: "row",
                  alignItems: "center",
                  elevation: 10,
                  borderRadius: 10,
                  borderColor: "#E5B000",
                  flexWrap: "wrap",
                  position: "relative",
                  alignItems: "center",
                })
              }
            >
              {/*
          <View
                    style={{
                      position: "absolute",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      width: "100%",
                      height: height * 0.45,
                      alignItems: "center",
                      transform: [{ rotate: "45deg" }],
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "120%",
                        backgroundColor: "#fff",


                      }}
                    ></View>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      width: "100%",
                      height: height * 0.45,
                      alignItems: "center",
                      transform: [{ rotate: "-45deg" }],

                    }}
                  >

                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "120%",
                        backgroundColor: "#fff",

                      }}
                    ></View>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      width: "100%",
                      height: height * 0.45,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "83%",
                        backgroundColor: "#fff",
                         zIndex:999,

                      }}
                    ></View>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "83%",
                        backgroundColor: "#fff",
                          zIndex:999,

                      }}
                    ></View>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "83%",
                        backgroundColor: "#fff",
                          zIndex:999,

                      }}
                    ></View>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      width: "100%",
                      height: height * 0.45,
                      alignItems: "center",
                      transform: [{ rotate: "90deg" }],

                    }}
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "90%",
                        backgroundColor: "#fff",

                      }}
                    ></View>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "90%",
                        backgroundColor: "#fff",

                      }}
                    ></View>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        height: height * 0.01,
                        width: "90%",
                        backgroundColor: "#fff",

                      }}
                    ></View>
                  </View>

        */}
              {gameX0.map((x, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        winningArrayNew.indexOf(index) >= 0
                          ? "green"
                          : "transparent",
                      height: height * 0.13,
                      width: "33.33%",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      borderColor: "#69693A",
                      borderWidth: 3,

                    }}
                    key={index + "dd"}
                    onPress={() => {
                      if (
                        (isPlayerTurn && singlePlayer && waitPlayer == false) ||
                        !singlePlayer
                      ) {
                        console.log("dsfsdf");
                        changeTurn(x, index);
                      }
                    }}
                  >
                    {x.value == "x" ? (
                      <Icon
                        name="close"
                        size={height * 0.1}
                        color={
                          winningArrayNew.indexOf(index) >= 0 ? "#fff" : "#000"
                        }
                        style={{ zIndex: 99 }}
                      />
                    ) : x.value == "o" ? (
                      <Icon
                        name="circle-thin"
                        size={height * 0.1}
                        color={
                          winningArrayNew.indexOf(index) >= 0 ? "#fff" : "#000"
                        }
                        style={{ zIndex: 99 }}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View
              style={{

                backgroundColor: "#fff",
                height: height * 0.09,
                width: width * 0.95,
                borderColor: "#69693A",
                borderWidth: 2,
                borderRadius: 20,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {GameType.map((x, index) => {
                return (
                  <TouchableOpacity
                    style={{ flexDirection: "column", width: "33.3%" }}
                    onPress={() => {
                      setGameTypeValue(x);
                      resetForm();
                    }}
                    key={index + "44"}
                  >
                    <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: 'PottaOne-Regular',
                        fontSize: height * 0.025,
                        textAlign: "center",
                      }}
                    >
                      {index == 0
                        ? singlePlayer
                          ? "Your "
                          : "X Player"
                        : index == 1
                          ? singlePlayer
                            ? "Computer "
                            : "0 Player"
                          : "Draw"}
                    </Text>

                    <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: 'PottaOne-Regular',
                        fontSize: height * 0.025,
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {index == 0
                        ? singlePlayer
                          ? singleStats.playerPoint
                          : multiplayerPoint.playerPoint
                        : index == 1
                          ? singlePlayer
                            ? singleStats.computerPoint
                            : multiplayerPoint.computerPoint
                          : singlePlayer
                            ? singleStats.drawPoint
                            : multiplayerPoint.drawPoint}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                height: height * 0.09,
                width: width * 0.5,
                borderColor: "#69693A",
                borderWidth: 2,
                borderRadius: 20,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
              onPress={() => {
                setPlayerWait(false);
                setIsPlayerTurn(true);
                setSinglePlayer(!singlePlayer);
                setMultiplayerPoint(initialPoint);
                setMultiplayerPoint(initialPoint);

                resetForm();
              }}
            >
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: 'PottaOne-Regular',
                  fontSize: height * 0.025,
                  textAlign: "center",
                }}
              >
                {singlePlayer ? "2 Player Game" : "Single Player"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  btnAction: {
    height: 70,
    width: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  },
});
function mapStateToProps(state) {
  return {
    gamePoint: state.gamePoint,
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      playerPoint: playerPoint,
      computerPoint: computerPoint,
      drawPoint: drawPoint,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(TicToeScreen);

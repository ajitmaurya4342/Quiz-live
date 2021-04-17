import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiIcon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { getData } from './AsyncStorage.js';
import { soundNeed } from './SoundPage.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { storeData } from './AsyncStorage.js';
import { WebView } from 'react-native-webview';

import HomescreenService from '../apiServices/HomescreenService';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  SafeAreaView,
  BackHandler,
} from 'react-native';
const { height, width } = Dimensions.get('window');
const QuestionScreen = (props) => {
  const [counter, setCounter] = useState(20);
  const [showEmozi, setShowEmoji] = useState(false);
  const [defaultIndx, changeDefaultIndex] = useState(0);
  const [rightAns, changeRightAns] = useState(0);
  const [wrongAns, changeWrongAns] = useState(0);
  const state = {
    modalVisible: false,
    userSelected: [],
    data: [
      {
        id: 1,
        options: 'Answer 1,Answer 2,Answer 3,Answer 4',
        correct_options: 1,
        question_type: 2,
        question: 'https://bootdey.com/img/Content/avatar/avatar6.png',
      },
      {
        id: 2,
        options: 'Answer 5,Answer 6,Answer 7,Answer 8',
        correct_options: 3,
        question_type: 1,
        question: 'What is your name',
      },
      {
        id: 3,
        options: 'Answer 9,Answer 10,Answer 11,Answer 12',
        correct_options: 2,
        question_type: 1,
        question: 'What is your surname',
      },
      {
        id: 4,
        options: 'Answer 13,Answer 14,Answer 15,Answer 16',
        correct_options: 1,
        question_type: 2,
        findImage: 'https://bootdey.com/img/Content/avatar/avatar6.png',
        question: '',
      },
    ],
  };
  var timeInter = '';

  const [questionData, questionSet] = useState([]);

  useEffect(() => {
    getQuestion();
    //    console.log("fdsfsdf")
  }, []);

  var interval2 = null;

  useEffect(() => {
    interval2 = setInterval(() => {
      quizTimer();
    }, 1000);

    return () => clearInterval(interval2);
  }, [counter]);

  function getQuestion() {
    getData('QuestionArray').then((res) => {
      questionSet(res.QuestionArray);
    });
  }

  function addUserScore(rightAns1) {
    clearInterval(interval2);

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        let payload = {
          level_id: props.route.params.level_id,
          user_id: props.route.params.user_id,
          level_out_of: questionData.length,
          level_score: rightAns1,
        };
        HomescreenService.addUserScore(payload)
          .then((response) => {
            console.log(response);

            const { data } = response;
            console.log(data);

            if (data.status) {
              storeData('User', data.userArray[0]).then((res) => {
                props.navigation.replace('ScoreScreen', {
                  game_id: props.route.params.game_id,
                  user_id: props.route.params.user_id,
                  level_id: props.route.params.level_id,
                  msgStatus: data.msg,
                  passedStatus: data.passedStatus,
                  score: rightAns1,
                  out_of: questionData.length,
                  level: props.route.params.level,
                  nextLevel: data.nextLevel,
                  starCheck: data.starCheck,
                  changeProfile2: props.route.params.changeProfile2,
                });
              });
              //                console.log(data);
            }
          })
          .catch((error) => {
            console.log('On Catch Add_Submission_Tagging_User', error);
          })
          .finally(() => { });
      } else {
        setTimeout(() => {
          checkInternet();
          showMessage({
            message: 'Please Check Your Internet Connection',
            type: 'warning',
            autoHide: false,
            icon: 'warning',
            position: 'top',
            floating: true,
          });
        }, 100);
      }
    });
  }

  function quizTimer() {
    //console.log("fdsfsdf", counter)

    if (counter == 0) {
      //
      if (defaultIndx < questionData.length - 1) {
        changeDefaultIndex(defaultIndx + 1);
        if (props.gamePoint.sound) {
          soundNeed('wrong.mp3');
        }
        setCounter(20);
      } else {
        addUserScore(rightAns);
        //
      }
    } else {
      setCounter(counter - 1);
    }
  }

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
          addUserScore(rightAns);
        }
      });
    }, 2000);
  }

  function onChangeSelectedAnswer(correct_options, index, item) {
    console.log(correct_options, item);
    //   alert(correct_options)
    let rightAns1 = rightAns;
    if (correct_options == index) {
      // return true;
      rightAns1 = rightAns + 1;
      changeRightAns(rightAns + 1);
      if (props.gamePoint.sound) {
        soundNeed('correct.mp3');
      }
    } else {
      changeWrongAns(wrongAns + 1);
      if (props.gamePoint.sound) {
        soundNeed('wrong.mp3');
      }
      // return false
    }

    if (defaultIndx < questionData.length - 1) {
      changeDefaultIndex(defaultIndx + 1);
      setCounter(20);
    } else {
      addUserScore(rightAns1);
      //      props.navigation.replace('ScoreScreen')
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43C6AC', '#F8FFAE']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={0}
        style={styles.linearGradient}
      //blurRadius={1}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Question: {defaultIndx + 1} / {questionData.length}
          </Text>

          {/* <EmojiIcon style={[styles.emojiStyle]} name={showEmozi == true ? "emoji-happy" : "emoji-sad"} size={60} color="green" /> */}
          {/* <Text style={{ color: showEmozi == true ? "green" : "red", fontSize: 18 }}>{showEmozi == true ? "Correct Answer" : "Wrong Answer"}</Text> */}
        </View>

        <View style={styles.subComponent}>
          <View style={styles.subHeader}>
            <Text style={styles.countStyle}>
              {' '}
              <Icon name="thumb-up" size={30} color="green"></Icon> {rightAns}
            </Text>
            <View style={styles.timerStyle}>
              <Text style={styles.timerText}>{counter}</Text>
            </View>
            <Text style={styles.countStyle}>
              {wrongAns} <Icon name="thumb-down" size={30} color="red"></Icon>{' '}
            </Text>
          </View>
        </View>
        {/* // <Image
                //   style={[styles.image]}
                //   source={{uri: questionData[defaultIndx].question}}
                // /> */}
        {questionData.length > 0 && (
          <SafeAreaView style={{ flex: 1, marginTop: 15 }}>

            {questionData[defaultIndx].question_type == 2 ? (
              <View style={styles.imageStyle}>
                <Image
                  style={{ height: 160, left: 0, right: 0 }}
                  resizeMode="contain"
                  source={{
                    uri: questionData[defaultIndx].question_new,
                  }}
                />
              </View>
            ) : (
              <View style={styles.questionStyle}>

                {!questionData[defaultIndx].question.includes("$$") ? (<Text style={styles.textQuestionStyle}>
                  {questionData[defaultIndx].question}

                </Text>) : (
                  questionData[defaultIndx].question.split("$$").map((zz, index2) => {
                    return (

                      <View key={index2 + "dsa112"} >
                        <Text style={{
                          fontSize: index2 % 2 == 1 ? 22 : 30, lineHeight: index2 % 2 == 1 ? 21 : 40,
                          fontFamily: 'Cochin',
                          textAlign: "center",
                          //flex: 1,
                          color: '#fff',
                          fontWeight: 'bold',
                        }} key={index2 + "dsa2"}>
                          {zz}
                        </Text>

                      </View>

                    )
                  })
                )}
              </View>
            )}


            {questionData[defaultIndx].options.split(',').map((item, index) => {
              const item_includes = item.includes("$$");
              const item_new_array = item_includes ? item.split("$$") : []
              return (
                <TouchableHighlight
                  key={index + 'my'}
                  style={styles.card}
                  activeOpacity={0.6}
                  underlayColor={
                    questionData[defaultIndx].correct_options == index
                      ? 'green'
                      : 'red'
                  }
                  onPress={() =>
                    onChangeSelectedAnswer(
                      questionData[defaultIndx].correct_options,
                      index,
                      item,
                    )
                  }>
                  <View style={styles.cardContent}>
                    {/* <Icon name={item.iconName} size={39} color="#fff" /> */}
                    {item_new_array.length == 0 ? (<Text style={styles.name}>{item.split("--").join(",")}</Text>) : (
                      item_new_array.map((zz, index2) => {
                        return (
                          <Text style={{
                            fontSize: index2 % 2 == 1 ? 15 : 20, lineHeight: index2 % 2 == 1 ? 18 : 30,
                            fontFamily: 'Cochin',
                            marginLeft: index2 == 0 ? width * 0.02 : 0,

                            //flex: 1,


                            color: '#000',
                            fontWeight: 'bold',
                          }} key={index2 + "dsa"}>
                            {zz}
                          </Text>
                        )
                      })
                    )}
                  </View>
                </TouchableHighlight>
              );
            })}
          </SafeAreaView>
        )}
      </LinearGradient>
    </View >
  );
};

const styles = StyleSheet.create({
  linearGradient: {
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

    elevation: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    shadowColor: '#493200',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    // marginLeft: 20,
    //marginRight: 20,
    marginTop: height * 0.02,
    //  height: height * 0.26,
    backgroundColor: '#43C6AC',
    padding: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderTopRightRadius: 180,
    borderBottomRightRadius: 180,
    height: height * 0.08,
    width: width,
  },
  headerTitle: {
    fontSize: height * 0.025,
    fontFamily: 'PottaOne-Regular',
    alignSelf: 'center',
    color: '#000',
    //fontWeight: 'bold'
  },
  subHeader: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    justifyContent: 'space-between',
  },
  subComponent: {
    marginTop: height * 0.02,
  },
  timerStyle: {
    //  position: 'absolute',

    // width: 70,
    // height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: height * 0.045,
    fontFamily: 'PottaOne-Regular',
  },
  countStyle: {
    fontSize: height * 0.03,
    fontFamily: 'PottaOne-Regular',
  },
  imageStyle: {
    // marginTop: 50,
    height: height * 0.3,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: '#fff',
    marginBottom: height * 0.02,
  },

  questionStyle: {
    // marginTop: 50,
    height: height * 0.3,
    width: width,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: '#000',

    marginBottom: height * 0.02,

  },
  textQuestionStyle: {
    fontSize: 30,
    color: 'white',
    margin: height * 0.01,
  },
  image: {
    height: height * 0.3,
    width: width * 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  contentList: {
    margin: height * 0.03,
  },

  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 5,
    height: height * 0.08,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
    marginTop: height * 0.02,
    backgroundColor: '#DCD0CD',
    padding: width * 0.02,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 2,
    // borderColor: "gold",
  },
  cardContent: {
    //  marginLeft: 25,
    //marginTop: 10,
    flexDirection: 'row',
  },
  name: {
    padding: width * 0.02,
    fontFamily: 'Cochin',
    fontSize: 20,
    //flex: 1,
    alignSelf: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  emojiStyle: {
    margin: 10,
  },
});

function mapStateToProps(state) {
  return {
    gamePoint: state.gamePoint,
  };
}

export default connect(mapStateToProps)(QuestionScreen);

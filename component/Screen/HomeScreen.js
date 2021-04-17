import React, { Component, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import HomescreenService from '../apiServices/HomescreenService';
import { getData, storeData } from './AsyncStorage.js';
import { showMessage, hideMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import { ChangeSound } from '../../actions/index.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LogBox } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
// import {
//   AdMobBanner,
//   AdMobInterstitial,
//   PublisherBanner,
//   AdMobRewarded,
// } from 'react-native-admob'

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
  BackHandler,
  Modal,
  Button,
  Switch,
  SafeAreaView,
  Share,
} from 'react-native';
import stLogo from '../assets/quizLogo.png';
import math from '../assets/mathLogo.png';
import xo from '../assets/xoLogo.png';
import quizS from '../assets/quizS.png';
const xo1 = Image.resolveAssetSource(xo).uri;
const math1 = Image.resolveAssetSource(math).uri;
const stLogo1 = Image.resolveAssetSource(stLogo).uri;
const quizS1 = Image.resolveAssetSource(quizS).uri;
const { height, width } = Dimensions.get('window');



const HomeScreen = (props) => {



  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    props.ChangeSound();
  };
  const [isEnabled, setIsEnabled] = useState(true);
  const [shareUrl, updateShareUrl] = useState();
  const [userPoints, updateUserPoints] = useState(0);
  const [gameRules, updateGameRules] = useState([]);

  //    useEffect(()=>{
  //
  //
  //    },[isEnabled])

  const [showModal, setShowModal] = useState(false);
  const [showModalBuyNow, setShowModalBuyNow] = useState(false);
  const [userImg, updateUserImg] = useState();
  const [gameData, setGameData] = useState([]);
  const [leaderboard, setLeaderBoard] = useState([]);
  const [paymentArray, setPaymentArray] = useState([]);

  const settingData = [
    { id: 1, iconName: 'surround-sound', description: 'Sound' },
    { id: 2, iconName: 'rule', description: 'Game Rules' },
    { id: 3, iconName: 'cubes', description: 'Buy More Coins' },

    // {id:2, iconName:"speaker-notes", description: "Instruction",Info:},
  ];
  // const [getUserDetail, setUserDetail] = useState(getData("User").User);

  const state = {
    modalVisible: false,
    userSelected: [],

    data: [
      { id: 1, name: 'Image Quiz', image: quizS1 },
      { id: 2, name: 'Logo Quiz', image: quizS1 },
      { id: 3, name: 'Math Quiz', image: math1 },
      //{ id: 4, name: "Champion Quiz", image: stLogo1 },
      { id: 5, name: 'Tic tac toe', image: xo1 },
    ],
  };

  var timeInter = '';
  function goToLeaderBoard(item) {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData('User').then((res) => {
          let UserDetail = res.User;
          HomescreenService.getLeaderBoard({
            user_id: UserDetail.user_id,
            game_id: '',
          })
            .then((response) => {
              const { data } = response;

              if (data) {

                props.navigation.navigate('LeaderBoard', {
                  gameData: leaderboard,
                  UserDetail: UserDetail,
                  UserPoint: data.UserPoint,
                  UserRank: data.UserRank,
                  listUser: data.Record.data,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log('On Catch Add_Submission_Tagging_User', error);
            })
            .finally(() => { });
        });
      } else {
        setTimeout(() => {
          showMessage({
            message: 'Please Check Your Internet Connection',
            type: 'warning',
            autoHide: true,
            icon: 'warning',
            position: 'top',
            floating: true,
          });
        }, 100);
      }
    });
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
          getAllGames();
        }
      });
    }, 2000);
  }
  function goToEditUser() {
    getData('User').then((res) => {
      props.navigation.navigate('EditLoginScreen', {
        userDetails: res.User,
        changeProfile2: () => changeProfile(),

      });
    });
  }
  function changeProfile() {

    getData("User").then(res => {
      updateUserImg(res.User.user_image)
      updateUserPoints(res.User.user_points)

    })
  }
  function changeRoute(item) {
    console.log('item', item);
    if (item.game_id != 4) {
      getData('User').then((res) => {
        props.navigation.navigate('LevelScreen', {
          game_id: item.game_id,
          user_id: res.User.user_id,
          changeProfile2: () => changeProfile(),

          paymentArray: paymentArray
        });
      });
    } else {
      props.navigation.navigate('TicToeScreen');
    }
  }
  useEffect(() => {
    getAllGames();
  }, []);
  function getAllGames() {
    console.log(props.gamePoint.sound, 'Sound');
    setIsEnabled(props.gamePoint.sound);

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getData('User').then((res) => {
          updateUserImg(res.User.user_image);
          updateUserPoints(res.User.user_points);
        });
        HomescreenService.GetGameList()
          .then((response) => {
            const { data } = response;

            if (data) {
              setGameData(response.data.Record.data);
              updateShareUrl(data.shareUrl);
              updateGameRules(data.instruction);
              setLeaderBoard(data.LeaderBoard);
              setPaymentArray(data.paymentArray);
            } else {
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
        });
      }
    });
  }
  const onShareApp = async () => {
    try {
      const result = await Share.share({
        message: shareUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
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

          getData("User").then(resUser => {

            console.log(resUser)



            let payload = {
              user_id: resUser.User.user_id,
              payment_detail: JSON.stringify(data),
              payment_id: data.razorpay_payment_id,
              amount: item.amount,
              point: item.point
            };


            HomescreenService.transaction_detail(payload)
              .then((response) => {
                console.log(response.data)
                if (response.data.status) {
                  setShowModalBuyNow(false);
                  setShowModal(false);

                  storeData("User", response.data.UserArray[0]).then(strUser => {

                    changeProfile();

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
  return (
    <View style={styles.container}>
      {/* <AdMobBanner jj
        adSize="banner"
        adUnitID="ca-app-pub-8834100365747496/9456621767"
        didFailToReceiveAdWithError={error => console.error(error)}
      /> */}

      <Modal
        animationType={'fade'}
        transparent={true}
        visible={showModalBuyNow}
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

          {paymentArray.length > 0 && <FlatList
            style={styles.notificationList}
            data={paymentArray}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.notificationBoxNew} key={index + '44'} >
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

                </View>
              );
            }}
          />}


          <TouchableOpacity
            style={styles.settingBack}
            onPress={() => {
              setShowModalBuyNow(!showModalBuyNow);
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
            Settings
          </Text>
          <FlatList
            style={styles.notificationList}
            data={settingData}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={styles.notificationBox} key={index + '44'} onPress={() => {
                  console.log(item.id, item);
                  if (item.id == 2) {
                    setShowModal(false)
                    props.navigation.navigate('GameRules', { gameRuleData: gameRules })


                  } else if (item.id == 3) {
                    setShowModalBuyNow(true)

                  }
                }}>
                  {index == 2 ? <Icon
                    name={item.iconName}
                    size={height * 0.04}
                    color="#e9ad03"
                  /> : <MaterialIcon
                    name={item.iconName}
                    size={height * 0.06}
                    color="green"
                  />}

                  <Text style={styles.settingName}>{item.description}</Text>
                  {index === 0 && (

                    <TouchableOpacity onPress={() => {
                      props.ChangeSound();
                      setIsEnabled(!isEnabled)
                    }} >
                      <Icon
                        name={isEnabled ? "check-square-o" : "square-o"}
                        size={height * 0.052}
                        color={isEnabled ? "green" : "#000"}
                      />
                    </TouchableOpacity >

                  )}

                </TouchableOpacity>
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
          <Text style={styles.headerText}>Quiz IQ</Text>
          <TouchableOpacity onPress={() => goToEditUser()}>
            <Image style={styles.profileImage} source={{ uri: userImg }} />
          </TouchableOpacity>
          {/* <Icon name="play-circle" size={height * 0.06} color="green" /> */}
        </View>
        <View style={styles.Coinheader}>
          <Text style={styles.headerText}></Text>
          <View style={{ flexDirection: "row", alignItems: "center", width: width * 0.25, justifyContent: "center" }}>
            <Icon name="cubes" size={height * 0.03} color="#e9ad03"></Icon>
            <Text style={styles.CoinheaderText}>{userPoints}</Text>
          </View>


          {/* <Icon name="play-circle" size={height * 0.06} color="green" /> */}
        </View>

        <SafeAreaView style={{ flex: 1 }}>
          {gameData.length > 0 ? (
            <FlatList
              style={styles.contentList}
              columnWrapperStyle={styles.listContainer}
              data={gameData}
              keyExtractor={(item) => {
                return item.game_id.toString();
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => changeRoute(item)}>
                    <Image
                      style={styles.image}
                      source={{ uri: state.data[index].image }}
                    />
                    <Text style={styles.name}>{item.game_name}</Text>
                    <Icon
                      name="play-circle"
                      size={height * 0.06}
                      color="green"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          ) : null}
          <View >
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.bottomMenuText} onPress={() => onShareApp()}>
                <MaterialIcon
                  name="share"
                  size={height * 0.065}
                  color="green"
                />
                <Text style={styles.bottomText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomMenuText} onPress={() => goToLeaderBoard()}>
                <MaterialIcon
                  name="leaderboard"
                  size={height * 0.065}
                  color="green"
                />
                <Text style={styles.bottomText}>LeaderBoard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomMenuText} onPress={() => {
                setShowModal(!showModal);
              }}>
                <MaterialIcon
                  name="settings"
                  size={height * 0.065}
                  color="green"
                />
                <Text style={styles.bottomText}>Setting</Text>
              </TouchableOpacity>


            </View>
            {/* <View style={styles.bottomMenu}>
              <TouchableOpacity
                style={styles.share}
                onPress={() => onShareApp()}>
                <MaterialIcon
                  name="share"
                  size={height * 0.065}
                  color="green"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.share}
                onPress={() => goToLeaderBoard()}>
                <MaterialIcon
                  name="leaderboard"
                  size={height * 0.065}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.share}
                onPress={() => {
                  setShowModal(!showModal);
                }}>
                <MaterialIcon
                  name="settings"
                  size={height * 0.065}
                  color="green"
                />
              </TouchableOpacity>
            </View> */}
            {/* <View style={styles.bottomMenuText}>
              <TouchableOpacity style={styles.shareText}>
                <Text style={styles.bottomText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareText}>
                <Text style={styles.bottomText}>LeaderBoard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareText}>
                <Text style={styles.bottomText}>Setting</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View >
  );
};

const styles = StyleSheet.create({
  intruction: {
    margin: 5,
    fontSize: height * 0.02,
  },
  settingBack: {
    marginBottom: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    height: 10,
    alignSelf: 'center',
  },
  notificationList: {
    marginTop: height * 0.05,
  },
  notificationBox: {
    width: width,
    borderRadius: 5,
    padding: width * 0.02,
    marginTop: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'green',
    // justifyContent:'space-around',
  },
  notificationBoxNew: {
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
  settingNameAmount: {
    fontSize: height * 0.025,
    fontFamily: 'PottaOne-Regular',
    color: '#fff',
    padding: 4,
    //flex: 1,
    alignSelf: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#43C6AC',
    opacity: 0.95,
  },
  bottom: {
    flexDirection: "row", width: width, justifyContent: "space-around", alignItems: "center", marginBottom: height * 0.02
  },

  bottomMenu: {
    //  justifyContent:'center',
    marginHorizontal: width * 0.1,
    flexDirection: 'row',
    marginTop: height * 0.01,
  },
  share: {
    marginHorizontal: width * 0.1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMenuText: {
    height: height * 0.15, width: width * 0.3, flexDirection: "column", alignItems: "center", justifyContent: "center"
  },
  shareText: {
    //justifyContent:'space-around',

    marginHorizontal: width * 0.065,

    flexDirection: 'row',
    //justifyContent: 'center',
    // alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'PottaOne-Regular',
  },
  header: {
    paddingTop: width * 0.05,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,


    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: "#08AEEA",
    // borderBottomColor: 'white',
    // borderBottomWidth: 2,
  },
  Coinheader: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: "#08AEEA",
    // borderBottomColor: 'white',
    // borderBottomWidth: 2,
  },
  headerText: {
    paddingRight: width * 0.05,

    fontSize: height * 0.04,
    fontFamily: 'PottaOne-Regular',
    color: 'green',
  },
  CoinheaderText: {
    fontSize: height * 0.022,
    paddingRight: width * 0.010,
    fontFamily: 'PottaOne-Regular',
    color: 'green',
  },
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
    //  marginTop: 20,
    backgroundColor: '#493200',
  },

  contentList: {
    marginBottom: 0,
    // flex: 1,
  },
  profileImage: {
    height: height * 0.06,
    width: width * 0.12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#43C6AC',
  },
  image: {
    height: height * 0.11,
    width: width * 0.21,

    //borderRadius: 30,
    //  borderWidth: 2,
    // borderColor: "red"
  },

  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 2,
    shadowRadius: 10,
    //elevation: 22,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderTopRightRadius: 180,
    // borderBottomRightRadius: 180,
  },

  settingName: {
    fontSize: height * 0.025,
    fontFamily: 'PottaOne-Regular',
    color: '#000',
    padding: 4,
    marginRight: 10,
    //flex: 1,
    alignSelf: 'center',
  },
  name: {
    fontSize: height * 0.03,
    fontFamily: 'PottaOne-Regular',

    //flex: 1,
    alignSelf: 'center',
    color: '#000',
    //width: width * 0.26,
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#6666ff',
  },
  followButton: {
    alignSelf: 'center',
    margin: 10,
    height: height * 0.08,
    width: width * 0.29,

    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#000',
    fontSize: 20,

    //fontFamily: "Arial"
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
      ChangeSound: ChangeSound,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(HomeScreen);

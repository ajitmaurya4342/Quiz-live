import React, { Component, useRef, useEffect, useState } from "react";

import RazorpayCheckout from 'react-native-razorpay';
import { Dimensions } from "react-native";

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

const PaymentGateway = (props) => {

  return (
    // Try setting `flexDirection` to `column`. </ScrollView>

    <SafeAreaView style={styles.container}>
     <TouchableHighlight onPress={() => {
       var options = {
         description: 'Credits towards consultation',
         image: 'https://i.imgur.com/3g7nmJC.png',
         currency: 'INR',
         key: 'rzp_test_4w14Ve6dHahdK4', // Your api key
         amount: '5000',
         name: 'foo',
         prefill: {
           email: 'void@razorpay.com',
           contact: '9191919191',
           name: 'Razorpay Software'
         },
         theme: {color: '#F37254'}
       }
       RazorpayCheckout.open(options).then((data) => {
         // handle success
         alert(`Success: ${data.razorpay_payment_id}`);



       }).catch((error) => {
         // handle failure
         alert(`Error: ${error.code} | ${error.description}`);
       });
     }}>
     <>
     <Text>fsdfsdfsdfsdfsdfdsf</Text>
     </>
     </TouchableHighlight>
    </SafeAreaView>
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

export default PaymentGateway;

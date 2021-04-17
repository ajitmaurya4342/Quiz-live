import React, { Component, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import { Dimensions } from "react-native";

import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");

const GameRules = (props) => {

  const [gameRuleData, setGameRuleData] = useState([])

  useEffect(() => {

    setGameRuleData(props.route.params.gameRuleData);

  }, [])


  return (
    <View style={styles.container}>


      <LinearGradient
        colors={['#43C6AC', '#F8FFAE']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        useAngle
        angle={0}
        style={{ height: height }}
      //blurRadius={1}

      >
        <View style={{
          width: "100%", height: height * 0.07, flexDirection: "row", justifyContent: "space-around",
          alignItems: "center"
        }}>

          <Text style={styles.levelStyle} >Game Rules</Text>



        </View>
        {gameRuleData.length > 0 &&
          <FlatList
            style={styles.notificationList}
            enableEmptySections={true}
            data={gameRuleData}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item }) => {
              return (
                <View style={styles.notificationBox} key={item.index + "dsfsdf"}>

                  <Text style={styles.description} key={item.index + "322"} >{item}</Text>
                </View>
              )
            }} />}
      </LinearGradient>
    </View>
  );

}

const styles = StyleSheet.create({
  levelStyle: {
    fontFamily: 'PottaOne-Regular',
    fontSize: 30,
  },
  container: {
    height: height,
    backgroundColor: 'transparent'
  },
  notificationList: {
    padding: 10,
  },
  notificationBox: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 10,
  },
  icon: {
    width: 45,
    height: 45,
  },
  description: {
    fontSize: 20,
    color: "#000",
    marginLeft: 10,

  },
});

export default GameRules
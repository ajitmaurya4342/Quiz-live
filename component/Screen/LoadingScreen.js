import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";


const LoadingScreen = (props) => {
  const [newArray, setNewArray] = useState([1]);
  const [loading, loadingNew] = useState(false)
  const length2 = 8;

  useEffect(() => {
    var count = 0;
    var interval = setInterval(() => {
      if (newArray.length == length2) {
        if (count == 0) {
          console.log("fsddfsdfsdf");
          count++;
          props.navigation.replace('QuestionScreen', { game_id: props.route.params.game_id, user_id: props.route.params.user_id, level_id: props.route.params.level_id, level: props.route.params.level, changeProfile2: props.route.params.changeProfile2 })
        }
      } else {
        createArray();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [newArray, loading]);

  function createArray() {
    let newArray1 = [...newArray];
    loadingNew(true)
    newArray1.push(newArray.length + 1)
    setNewArray(newArray1);

  }


  return (

    <LinearGradient
      colors={['#43C6AC', '#F8FFAE']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      useAngle
      angle={0}
      style={styles.linearGradienttop}
    //blurRadius={1}

    >
      <View style={styles.center}>
        <Text style={{ fontFamily: 'PottaOne-Regular', fontSize: height * 0.04, color: "#000", marginBottom: height * 0.02 }}>Level {props.route.params.level}</Text>
        <Text style={{ fontFamily: 'PottaOne-Regular', fontSize: height * 0.04, color: "#000", marginBottom: height * 0.02 }}>Loading {parseInt(12.5 * newArray.length)}%</Text>
        <View style={{ height: height * 0.043, backgroundColor: "#fff", width: width * 0.8, borderRadius: 20, flexDirection: "row", borderWidth: 1, borderColor: "#000" }}>
          {
            newArray.map((x, index) => {
              //console.log("fsdfs")
              return (
                <View style={{ width: "12.5%", backgroundColor: index % 2 == 0 ? "#43C6AC" : "#43C6AC", height: "100%", borderTopLeftRadius: index == 0 ? 20 : 0, borderBottomLeftRadius: index == 0 ? 20 : 0, borderTopRightRadius: index == (length2 - 1) ? 20 : 0, borderBottomRightRadius: index == (length2 - 1) ? 20 : 0, }} key={index + "loading"}  ></View>

              )
            })

          }
        </View>
      </View>
    </LinearGradient >
  );
};

const styles = StyleSheet.create({
  center: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
export default LoadingScreen;

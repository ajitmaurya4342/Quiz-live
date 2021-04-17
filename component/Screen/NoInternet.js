import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import NoInternet2 from '../assets/NoInternet.jpg';
const NoInternetImage = Image.resolveAssetSource(NoInternet2).uri;
const { height, width } = Dimensions.get('window');

const NoInternet = ({ navigation }) => {
    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
            <Image source={{ uri: NoInternetImage }} style={{ height: height * 0.44, width: width * 0.7 }} />

        </View>

    );
};


export default NoInternet;
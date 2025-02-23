import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

export default function AnimatedSplash({ onAnimationEnd }) {
  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        duration={2000}
        source={require("../assets/splash-icon.png")}
        style={styles.image}
        onAnimationEnd={onAnimationEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CCD96C",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
});

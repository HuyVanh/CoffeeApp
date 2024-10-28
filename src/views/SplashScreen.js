// src/views/SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

const SplashScreen = ({ navigation }) => {
  // Chuyển đến màn hình chính sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Điều hướng đến màn hình CoffeeList
    }, 3000); // 3 giây

    return () => clearTimeout(timer); // Xóa timer khi component bị unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i.pinimg.com/564x/6b/63/08/6b63082d9251d353ea44fc5a4e01b415.jpg",
        }}
      />
      <Text style={styles.title}>Welcome to Coffee App</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6f4e37",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SplashScreen;

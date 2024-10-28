// src/views/LoginScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { AuthContext } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng
import api from '../apiservices/apiService';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext); // Lấy hàm login từ AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      try {
        await login(email, password); // Gọi hàm login từ AuthContext
        Alert.alert("Đăng nhập thành công");
        // Navigation sẽ tự động chuyển đến "Main" thông qua AuthContext
      } catch (error) {
        // Xử lý lỗi
        Alert.alert("Lỗi đăng nhập", error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } else {
      Alert.alert("Đăng nhập thất bại", "Vui lòng điền đủ thông tin");
    }
  };
  

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/6b/63/08/6b63082d9251d353ea44fc5a4e01b415.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập vào Coffee App</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  input: {
    height: 50, // tăng chiều cao để đồng bộ với RegisterScreen.js
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    backgroundColor: "#6f4e37",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default LoginScreen;

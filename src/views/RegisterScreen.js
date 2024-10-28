// src/views/RegisterScreen.js

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
import api from '../apiservices/apiService'; // Import apiService.js

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext); // Nếu muốn tự động đăng nhập sau khi đăng ký
  // Nếu không muốn tự động đăng nhập, bạn có thể bỏ dòng này và chuyển hướng sau khi đăng ký thành công

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (name && email && password) {
      const registerData = {
        name,
        email,
        password,
      };

      try {
        // Gửi yêu cầu đăng ký đến API
        console.log("Sending register data:", registerData);
        const response = await api.post('/auth/register', registerData);
        console.log("Received response:", response.data);

        // Giả sử API trả về token và thông tin người dùng sau khi đăng ký
        const { token, _id, email: userEmail, name: userName, role } = response.data;

        const user = {
          id: _id,
          email: userEmail,
          name: userName,
          role: role,
          token: token,
        };

        if (token && user) {
          // Nếu muốn tự động đăng nhập sau khi đăng ký:
          await login(token, user);
          Alert.alert("Đăng ký thành công", `Chào mừng, ${user.name}`);
          // Navigation sẽ tự động chuyển đến "Main" thông qua AuthContext

          // Nếu không muốn tự động đăng nhập, chuyển hướng đến màn hình Login:
          // Alert.alert("Đăng ký thành công", "Bạn có thể đăng nhập ngay bây giờ.");
          // navigation.navigate("Login");
        } else {
          Alert.alert("Lỗi đăng ký", "Không nhận được dữ liệu từ server");
        }
      } catch (error) {
        console.log("Lỗi đăng ký:", error);
        if (error.response) {
          console.log("Error data:", error.response.data);
          console.log("Error status:", error.response.status);
          console.log("Error headers:", error.response.headers);
        } else {
          console.log("Error message:", error.message);
        }

        // Xử lý lỗi từ API
        if (error.response && error.response.data && error.response.data.message) {
          Alert.alert("Lỗi đăng ký", error.response.data.message);
        } else {
          Alert.alert("Lỗi đăng ký", "Đăng ký thất bại. Vui lòng thử lại.");
        }
      }
    } else {
      Alert.alert("Đăng ký thất bại", "Vui lòng điền đủ thông tin");
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/6b/63/08/6b63082d9251d353ea44fc5a4e01b415.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký vào Coffee App</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#aaa"
        />
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đã có tài khoản? Đăng nhập</Text>
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
    height: 50, // tăng chiều cao để đồng bộ với LoginScreen.js
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

export default RegisterScreen;

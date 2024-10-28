import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../apiservices/apiService";

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp.");
      return;
    }

    try {
      // Gọi API để thay đổi mật khẩu
      await api.put("/auth/changePassword", {
        currentPassword,
        newPassword,
      });

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi.");
      // Xóa các trường sau khi thay đổi thành công
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi Mật Khẩu</Text>

      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Nhập mật khẩu hiện tại"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nhập mật khẩu mới"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Xác nhận mật khẩu mới"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9C00",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#2C2C2C",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF9C00",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;

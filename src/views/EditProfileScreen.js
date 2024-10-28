// src/views/EditProfileScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../apiservices/apiService";

const EditProfileScreen = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const handleSave = async () => {
    try {
      // Gửi yêu cầu cập nhật thông tin người dùng
      const response = await api.put("/auth/updateUser", {
        name,
        email,
      });

      // Cập nhật thông tin trong AuthContext
      updateUser(response.data);

      Alert.alert("Thành công", "Thông tin hồ sơ đã được cập nhật.");
    } catch (error) {
        console.error(
          "Lỗi khi cập nhật hồ sơ:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.data && error.response.data.message) {
          Alert.alert("Lỗi", error.response.data.message);
        } else {
          Alert.alert("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
        }
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh Sửa Hồ Sơ</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên của bạn"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email của bạn"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
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
  form: {
    width: "100%",
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
  saveButton: {
    backgroundColor: "#FF9C00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;

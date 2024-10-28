// src/views/ProfileScreen.js

import React, { useContext ,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.replace("Login");
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", onPress: () => logout() },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleViewOrders = () => {
    navigation.navigate("OrderHistory");
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Ionicons name="mail" size={24} color="#FF9C00" style={styles.infoIcon} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        {/* Bạn có thể thêm nhiều thông tin hơn ở đây */}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
          <Ionicons name="key-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewOrders}>
          <Ionicons name="receipt-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Đơn hàng của tôi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#2C2C2C",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FF9C00",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  actionSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 30,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ProfileScreen;

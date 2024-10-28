import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../apiservices/apiService";
import { useNavigation } from "@react-navigation/native";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => handleOrderDetail(item)}
      >
        <Text style={styles.orderId}>Mã đơn hàng: {item._id}</Text>
        <Text style={styles.orderDate}>
          Ngày đặt: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.orderTotal}>
          Tổng tiền: ${item.totalPrice.toFixed(2)}
        </Text>
        <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
      </TouchableOpacity>
    );
  };

  const handleOrderDetail = (order) => {
    // Điều hướng đến màn hình chi tiết đơn hàng nếu có
    Alert.alert("Thông báo", "Chức năng xem chi tiết đơn hàng chưa được triển khai.");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF9C00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.message}>Bạn chưa có đơn hàng nào.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  message: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  orderItem: {
    backgroundColor: "#2C2C2C",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  orderId: {
    color: "#FF9C00",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderDate: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
  },
  orderTotal: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
  },
  orderStatus: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default OrderHistoryScreen;

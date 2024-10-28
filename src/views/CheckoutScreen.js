// src/views/CheckoutScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../apiservices/apiService";
import { useNavigation, useRoute } from "@react-navigation/native";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, totalPrice } = route.params;
  const { user } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng của bạn đang trống.");
      return;
    }

    try {
      setIsProcessing(true);
      // Tạo đối tượng đơn hàng
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice,
        paymentMethod: "COD", // Thêm phương thức thanh toán
      };

      // Gọi API để tạo đơn hàng
      const response = await api.post("/orders", orderData);
      const createdOrder = response.data;

      Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt.");
      navigation.navigate("OrderConfirmation", { order: createdOrder });
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Thanh Toán</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Hiển thị thông tin đơn hàng */}
        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
        {cartItems.map((item) => {
          return (
            <View key={item.product._id} style={styles.orderItem}>
              <View style={styles.itemContent}>
                <Image
                  source={{ uri: item.product.imageURL }}
                  style={styles.productImage}
                />

                <View style={styles.itemDetails}>
                  <Text style={styles.productName}>
                    {item.product.productName}
                  </Text>
                  <Text style={styles.productQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                  <Text style={styles.productPrice}>
                    Giá: ${item.product.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
        <Text style={styles.totalPrice}>
          Tổng cộng: ${totalPrice.toFixed(2)}
        </Text>

        {/* Phương thức thanh toán */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodText}>
            Thanh toán khi nhận hàng (COD)
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={isProcessing}
      >
        <Text style={styles.placeOrderText}>
          {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FF9C00",
    marginVertical: 10,
  },
  orderItem: {
    backgroundColor: "#2C2C2C",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: "row",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#FF9C00",
  },
  totalPrice: {
    fontSize: 18,
    color: "#FF9C00",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "right",
  },
  paymentMethodContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  paymentMethodText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  placeOrderButton: {
    backgroundColor: "#6f4e37",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CheckoutScreen;

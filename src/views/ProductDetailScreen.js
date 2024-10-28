// src/views/ProductDetailScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import api from "../apiservices/apiService"; // Sửa lại đường dẫn import

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // State để quản lý loading khi thêm vào giỏ hàng

  const productId = product.id || product._id; // Đảm bảo lấy đúng ID

  useFocusEffect(
    React.useCallback(() => {
      if (user?.token) {
        checkFavoriteStatus();
      } else {
        setIsFavorite(false);
      }
    }, [user])
  );

  const checkFavoriteStatus = async () => {
    try {
      if (!user?.token || !productId) {
        return;
      }

      const response = await api.get("/carts"); // Sử dụng endpoint /carts nếu bạn đã định nghĩa
      const cartData = response.data;

      // Giả sử cartData.cartItems là một mảng các sản phẩm trong giỏ hàng
      const existingCartItem = cartData.cartItems.find(
        (item) => item.product._id.toString() === productId.toString()
      );

      if (existingCartItem) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.log(
        "Lỗi khi kiểm tra trạng thái yêu thích",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Lỗi",
        "Không thể kiểm tra trạng thái yêu thích. Vui lòng thử lại sau."
      );
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!user?.token) {
        Alert.alert(
          "Thông báo",
          "Bạn cần đăng nhập để thực hiện thao tác này."
        );
        return;
      }

      if (!productId) {
        Alert.alert("Lỗi", "ID sản phẩm không hợp lệ.");
        return;
      }

      if (isFavorite) {
        // Xóa khỏi yêu thích
        console.log(`Deleting favorite for product ID: ${productId}`);
        await api.delete(`/favorites/remove/${productId}`);
        Alert.alert("Thành công", "Đã xóa sản phẩm khỏi danh sách yêu thích.");
        setIsFavorite(false);
      } else {
        // Thêm vào yêu thích
        console.log(`Adding favorite for product ID: ${productId}`);
        const response = await api.post("/favorites/add", { productId });
        console.log("Add Favorite Response:", response.data);
        Alert.alert("Thành công", "Đã thêm sản phẩm vào danh sách yêu thích.");
        setIsFavorite(true);
      }
    } catch (error) {
      console.log(
        "Lỗi khi cập nhật trạng thái yêu thích",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại sau."
      );
    }
  };

  const getPriceValue = (price) => {
    return price?.$numberDecimal || price?.toString() || "0.00";
  };

  const handleAddToCart = async () => {
    try {
      if (!user?.token) {
        Alert.alert(
          "Thông báo",
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng."
        );
        return;
      }

      if (!productId) {
        Alert.alert("Lỗi", "ID sản phẩm không hợp lệ.");
        return;
      }

      setIsAddingToCart(true); // Bắt đầu loading

      // Gọi API để thêm sản phẩm vào giỏ hàng
      const response = await api.post("/carts/add", { productId, quantity: 1 });
      Alert.alert(
        "Thành công",
        `Đã thêm "${product.productName}" vào giỏ hàng.`
      );
    } catch (error) {
      console.log(
        "Lỗi khi thêm sản phẩm vào giỏ hàng",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Lỗi",
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
      );
    } finally {
      setIsAddingToCart(false); // Kết thúc loading
    }
  };

  return (
    <View style={styles.container}>
      {product.imageURL && (
        <Image source={{ uri: product.imageURL }} style={styles.productImage} />
      )}

      <View style={styles.contentContainer}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View>
              <View style={styles.header}>
                <Text style={styles.productName}>
                  {product.productName || "Tên sản phẩm"}
                </Text>

                <TouchableOpacity onPress={toggleFavorite}>
                  <Icon
                    name={isFavorite ? "heart" : "heart-o"}
                    size={30}
                    color={isFavorite ? "#FF0000" : "#FFFFFF"}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.productDescription}>
                {product.description || "Không có mô tả cho sản phẩm này."}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>
            ${getPriceValue(product.price)}
          </Text>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            disabled={isAddingToCart} // Vô hiệu hóa khi đang thêm vào giỏ hàng
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E" },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
  },
  contentContainer: { flex: 1, justifyContent: "space-between" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", flex: 1 },
  productDescription: { color: "#FFFFFF", fontSize: 16, marginBottom: 20 },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productPrice: { color: "#FF9C00", fontSize: 22 },
  addToCartButton: {
    backgroundColor: "#6f4e37",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default ProductDetailScreen;

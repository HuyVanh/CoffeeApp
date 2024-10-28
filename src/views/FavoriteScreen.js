// src/views/FavoritesScreen.js

import React, { useContext, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import api from "../apiservices/apiService"; // Sửa lại đường dẫn import
import { AuthContext } from "../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import các hook cần thiết

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);
  const userToken = user?.token; // Lấy token từ user
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (userToken) {
        fetchFavorites();
      } else {
        setFavorites([]);
      }
    }, [userToken])
  );

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites"); // Sử dụng endpoint đúng
      setFavorites(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách yêu thích. Vui lòng thử lại sau.");
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/remove/${productId}`); // Sử dụng endpoint đúng
      // Cập nhật danh sách yêu thích sau khi xóa
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.product._id !== productId)
      );
      Alert.alert("Thành công", "Sản phẩm đã được xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm yêu thích. Vui lòng thử lại sau.");
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  const getPriceValue = (price) => {
    return price?.$numberDecimal || price?.toString() || "0.00";
  };

  const renderFavoriteItem = ({ item }) => {
    const product = item.product;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleProductPress(product)}
      >
        {product.imageURL ? (
          <Image source={{ uri: product.imageURL }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Không có hình ảnh</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
            {product.productName || "Tên sản phẩm"}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2} ellipsizeMode="tail">
            {product.description || "Không có mô tả cho sản phẩm này."}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>${getPriceValue(product.price)}</Text>
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => handleRemoveFavorite(product._id)}
            >
              <Ionicons name="heart" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Yêu Thích</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có sản phẩm yêu thích nào.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.product._id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Đảm bảo SafeAreaView hoạt động tốt trên Android
  },
  header: {
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888888",
    fontSize: 16,
  },
  cardContent: {
    padding: 15,
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  productDescription: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productPrice: {
    color: "#FF9C00",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeIcon: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 18,
    textAlign: "center",
  },
});

export default FavoritesScreen;

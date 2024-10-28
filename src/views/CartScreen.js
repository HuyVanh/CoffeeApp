// src/views/CartScreen.js

import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import api from '../apiservices/apiService'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation(); // Lấy navigation
  const { user } = useContext(AuthContext);
  const userToken = user?.token; // Lấy token từ user
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng useFocusEffect để tải dữ liệu mỗi khi màn hình được tập trung
  useFocusEffect(
    useCallback(() => {
      if (userToken) {
        fetchCartItems();
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    }, [userToken])
  );

  // Tính tổng giá khi cartItems thay đổi
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  // Hàm để lấy danh sách sản phẩm trong giỏ hàng
  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/carts'); // Sử dụng endpoint đúng

      if (Array.isArray(response.data.cartItems)) {
        setCartItems(response.data.cartItems);
      } else {
        console.error('cartItems is not an array:', response.data);
        Alert.alert('Lỗi', 'Dữ liệu giỏ hàng không hợp lệ.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm để tính tổng giá
  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = typeof item.product.price === 'number' ? item.product.price : 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  // Hàm để xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (productId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              await api.delete(`/carts/remove/${productId}`); // Sử dụng endpoint đúng
              setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
              Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi giỏ hàng');
            } catch (error) {
              console.error('Lỗi khi xóa sản phẩm:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  // Hàm để tăng số lượng sản phẩm
  const handleIncreaseQuantity = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity + 1;
      await api.put(`/carts/update/${productId}`, { quantity: newQuantity }); // Sử dụng endpoint đúng
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Lỗi khi tăng số lượng:', error);
      Alert.alert('Lỗi', 'Không thể tăng số lượng sản phẩm. Vui lòng thử lại sau.');
    }
  };

  // Hàm để giảm số lượng sản phẩm
  const handleDecreaseQuantity = async (productId, currentQuantity) => {
    if (currentQuantity === 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const newQuantity = currentQuantity - 1;
      await api.put(`/carts/update/${productId}`, { quantity: newQuantity }); // Sử dụng endpoint đúng
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Lỗi khi giảm số lượng:', error);
      Alert.alert('Lỗi', 'Không thể giảm số lượng sản phẩm. Vui lòng thử lại sau.');
    }
  };

  // Hàm render cho từng sản phẩm trong giỏ hàng
  const renderItem = ({ item }) => {
    const price = typeof item.product.price === 'number' ? item.product.price : 0;
    return (
      <View style={styles.cartItem}>
        <TouchableOpacity 
          style={styles.productInfoContainer}
          onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
        >
          <Image 
            source={item.product.imageURL ? { uri: item.product.imageURL } : { uri: 'https://via.placeholder.com/80' }} 
            style={styles.productImage} 
            onError={() => console.error('Error loading image for product:', item.product._id)}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={1}>{item.product.productName}</Text>
            <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecreaseQuantity(item.product._id, item.quantity)}>
                <Icon name="remove-circle-outline" size={24} color="#FF9C00" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleIncreaseQuantity(item.product._id, item.quantity)}>
                <Icon name="add-circle-outline" size={24} color="#FF9C00" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveItem(item.product._id)}>
          <Icon name="trash-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    );
  };

  // Hàm xử lý thanh toán
const handleCheckout = () => {
  if (cartItems.length === 0) {
    Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
    return;
  }
  navigation.navigate('Checkout', { cartItems, totalPrice });
};


  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Giỏ Hàng</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9C00" />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.product._id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Tổng cộng: <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1E1E1E", 
    paddingTop: 50, 
    paddingHorizontal: 10 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#FFFFFF",
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 100, // To avoid being covered by the footer
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#2C2C2C",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 10,
    backgroundColor: '#FFFFFF', // Màu nền khi hình ảnh chưa tải
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#FFFFFF",
    flexShrink: 1,
  },
  productPrice: {
    fontSize: 14,
    color: "#FF9C00",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    backgroundColor: "#2C2C2C",
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  totalPrice: {
    color: "#FF9C00",
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: "#6f4e37",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: "#AAAAAA",
    fontSize: 18,
    marginTop: 10,
  },
});

export default CartScreen;

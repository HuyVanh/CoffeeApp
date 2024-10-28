// src/views/OrderConfirmation.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt hàng thành công!</Text>
      <Text style={styles.orderId}>Mã đơn hàng: {order._id}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Tiếp tục mua sắm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#FF9C00',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderId: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6f4e37',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;

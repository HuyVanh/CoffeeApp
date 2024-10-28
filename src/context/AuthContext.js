// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api, { setAuthToken } from '../apiservices/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      await AsyncStorage.setItem('userToken', userData.token);
      setAuthToken(userData.token); // Cập nhật token
    } catch (error) {
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công.');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại sau.');
    }
  };

  // Hàm cập nhật thông tin người dùng
  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
  };

  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Gọi API để lấy thông tin người dùng
          setAuthToken(token);
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ ...response.data, token });
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

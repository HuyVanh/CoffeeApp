// src/navigation/AppNavigator.js

import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import SplashScreen from "../views/SplashScreen";
import LoginScreen from "../views/LoginScreen";
import RegisterScreen from "../views/RegisterScreen";
import HomeScreen from "../views/HomeScreen";
import CartScreen from "../views/CartScreen";
import FavoriteScreen from "../views/FavoriteScreen";
import ProfileScreen from "../views/ProfileScreen";
import ProductDetailScreen from "../views/ProductDetailScreen";

import { AuthContext } from "../context/AuthContext"; // Đảm bảo đường dẫn đúng
import CheckoutScreen from "../views/CheckoutScreen";
import OrderConfirmation from "../views/OrderConfirmation";
import OrderHistoryScreen from "../views/OrderHistoryScreen";
import ChangePasswordScreen from "../views/ChangePasswordScreen";
import EditProfileScreen from "../views/EditProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Cart") {
          iconName = focused ? "cart" : "cart-outline";
        } else if (route.name === "Favorite") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "#1E1E1E", // Màu nền bạn muốn
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Favorite" component={FavoriteScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext); // Sử dụng AuthContext

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {loading ? (
        // Nếu đang tải trạng thái xác thực, hiển thị SplashScreen
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : user ? (
        // Nếu đã đăng nhập, hiển thị TabNavigator và các màn hình chính
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: "Chi tiết sản phẩm", headerShown: true }}
          />
          {/* Thêm các màn hình liên quan đến thanh toán vào đây */}
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: "Thanh Toán", headerShown: true }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmation}
            options={{ title: "Xác Nhận Đơn Hàng", headerShown: true }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Chỉnh Sửa Hồ Sơ", headerShown: true }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ title: "Đổi Mật Khẩu", headerShown: true }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ title: "Lịch Sử Đơn Hàng", headerShown: true }}
          />
        </>
      ) : (
        // Nếu chưa đăng nhập, hiển thị các màn hình Auth
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* Nếu bạn muốn cho phép truy cập vào các màn hình thanh toán khi chưa đăng nhập, giữ chúng ở đây */}
          {/* Nếu không, bạn nên xóa chúng khỏi phần này */}
          {/* <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PayPalPayment"
            component={PayPalPayment}
            options={{ headerShown: false }}
          /> */}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import api from "../apiservices/apiService";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 

  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);


  const [selectedCategory, setSelectedCategory] = useState(null);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

 
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImageURL, setNewProductImageURL] = useState("");

  useEffect(() => {
    
    const fetchData = async () => {
      try {
       
        const categoryResponse = await api.get("/categories");
        setCategoryList(categoryResponse.data);

      
        const productResponse = await api.get("/products");
        setProductList(productResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const handleCategoryPress = (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  
  const handleAddToCartPress = async (item) => {
    if (!user) {
      Alert.alert(
        "Thông báo",
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng."
      );
      return;
    }
    try {
      
      const response = await api.post("/carts/add", {
        productId: item._id,
        quantity: 1,
      });

      Alert.alert("Thành công", `Đã thêm "${item.productName}" vào giỏ hàng.`);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      const message =
        error.response?.data?.message ||
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  const handleSubmitNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên loại sản phẩm.");
      return;
    }

    try {
      const response = await api.post(`/categories`, {
        categoryName: newCategoryName,
      });

      setCategoryList((prevCategories) => [...prevCategories, response.data]);

      Alert.alert("Thành công", `Đã thêm loại "${newCategoryName}".`);
      setModalVisible(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("Lỗi khi thêm loại sản phẩm:", error);
      const message =
        error.response?.data?.message ||
        "Không thể thêm loại sản phẩm. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };


  const handleSubmitNewProduct = async () => {
    if (!newProductName.trim() || !newProductPrice.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm.");
      return;
    }

    try {
      // Chuyển đổi giá sản phẩm sang số
      const price = parseFloat(newProductPrice);
      if (isNaN(price) || price <= 0) {
        Alert.alert("Lỗi", "Giá sản phẩm không hợp lệ.");
        return;
      }

      // Tạo đối tượng sản phẩm mới
      const newProduct = {
        productName: newProductName,
        price: price,
        imageURL: newProductImageURL,
        category: selectedCategoryId,
      };

      // Gọi API để tạo sản phẩm mới
      const response = await api.post("/products", newProduct);

      // Cập nhật danh sách sản phẩm
      setProductList((prevProducts) => [...prevProducts, response.data]);

      Alert.alert("Thành công", `Đã thêm sản phẩm "${newProductName}".`);
      setAddProductModalVisible(false);

      // Xóa dữ liệu trong form
      setNewProductName("");
      setNewProductPrice("");
      setNewProductImageURL("");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      const message =
        error.response?.data?.message ||
        "Không thể thêm sản phẩm. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };

  // Hàm render cho từng item trong danh sách loại
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory &&
          selectedCategory._id === item._id &&
          styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryText}>{item.categoryName}</Text>
      {user && user.role === "admin" && (
        <TouchableOpacity onPress={() => handleDeleteCategory(item)}>
          <Ionicons
            name="trash-outline"
            size={20}
            color="#FF3B30"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const handleDeleteCategory = (category) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc chắn muốn xóa loại "${category.categoryName}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => confirmDeleteCategory(category),
        },
      ]
    );
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => confirmDeleteProduct(product),
        },
      ]
    );
  };

  const confirmDeleteProduct = async (product) => {
    try {
      await api.delete(`/products/${product._id}`);

      setProductList((prevProducts) =>
        prevProducts.filter((p) => p._id !== product._id)
      );

      Alert.alert("Thành công", `Đã xóa sản phẩm "${product.productName}".`);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      const message =
        error.response?.data?.message ||
        "Không thể xóa sản phẩm. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };

  const confirmDeleteCategory = async (category) => {
    try {
      await api.delete(`/categories/${category._id}`);

      setCategoryList((prevCategories) =>
        prevCategories.filter((cat) => cat._id !== category._id)
      );

      Alert.alert("Thành công", `Đã xóa loại "${category.categoryName}".`);
    } catch (error) {
      console.error("Lỗi khi xóa loại sản phẩm:", error);
      const message =
        error.response?.data?.message ||
        "Không thể xóa loại sản phẩm. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };

  // Hàm render cho nút "Thêm Loại" trong footer của danh sách categories
  const renderAddCategoryButton = () => {
    if (user && user.role === "admin") {
      return (
        <TouchableOpacity
          style={styles.addCategoryFooterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FF9C00" />
          <Text style={styles.addCategoryFooterText}>Thêm Loại</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Hàm render cho từng item trong danh sách sản phẩm
  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <TouchableOpacity
        style={styles.productItem}
        activeOpacity={0.8}
        onPress={() => handleProductPress(item)}
      >
        {/* Hình ảnh và tên sản phẩm giữ nguyên */}
        {item.imageURL ? (
          <Image source={{ uri: item.imageURL }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.productName}
        </Text>
      </TouchableOpacity>

      {/* Bọc productPrice, addButton và deleteButton trong một View hàng ngang */}
      <View style={styles.priceAndButtonContainer}>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.7}
            onPress={() => handleAddToCartPress(item)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          {user && user.role === "admin" && (
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={() => handleDeleteProduct(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Lọc danh sách sản phẩm dựa trên loại đã chọn
  const filteredProducts = selectedCategory
    ? productList.filter(
        (product) =>
          product.category && product.category._id === selectedCategory._id
      )
    : productList;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9C00" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Đã có lỗi xảy ra. Vui lòng thử lại sau.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header của HomeScreen */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Tìm điều tốt nhất cà phê cho bạn</Text>
      </View>

      {/* Danh sách các loại sản phẩm */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categoryList}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có loại nào.</Text>
          }
          ListFooterComponent={renderAddCategoryButton}
        />
      </View>

      {/* Danh sách các sản phẩm */}
      <View style={styles.productListContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Không có sản phẩm nào trong loại này.
            </Text>
          }
        />
      </View>

      {/* Modal để thêm loại mới */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thêm Loại Mới</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Tên loại sản phẩm"
              placeholderTextColor="#888"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitNewCategory}
              >
                <Text style={styles.modalButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal để thêm sản phẩm mới */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addProductModalVisible}
        onRequestClose={() => setAddProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thêm Sản Phẩm Mới</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Tên sản phẩm"
              placeholderTextColor="#888"
              value={newProductName}
              onChangeText={setNewProductName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Giá sản phẩm"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={newProductPrice}
              onChangeText={setNewProductPrice}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="URL hình ảnh"
              placeholderTextColor="#888"
              value={newProductImageURL}
              onChangeText={setNewProductImageURL}
            />
            <Picker
              selectedValue={selectedCategoryId}
              style={styles.modalPicker}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategoryId(itemValue)
              }
            >
              <Picker.Item label="Chọn loại sản phẩm" value="" />
              {categoryList.map((category) => (
                <Picker.Item
                  label={category.categoryName}
                  value={category._id}
                  key={category._id}
                />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddProductModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitNewProduct}
              >
                <Text style={styles.modalButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {user && user.role === "admin" && (
        <View style={styles.addProductFooter}>
          <TouchableOpacity
            style={styles.addProductFooterButton}
            onPress={() => setAddProductModalVisible(true)}
          >
            <Text style={styles.addProductFooterText}>Thêm Sản Phẩm</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
    position: "relative", // Để vị trí của nút Thêm Sản Phẩm
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  addProductButton: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  categoriesContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#2C2C2C",
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCategoryItem: {
    backgroundColor: "#FF9C00",
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 5,
  },
  addCategoryFooterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#2C2C2C",
  },
  addCategoryFooterText: {
    color: "#FF9C00",
    fontSize: 16,
    marginLeft: 5,
  },
  productListContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    backgroundColor: "#2C2C2C",
    margin: 5,
    padding: 10,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative", // Để đặt nút "+" ở góc
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4B4B4B",
  },
  noImageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  priceAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productPrice: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#FF9C00",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 40,
    height: 40,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  // Removed addCategoryButton style from products
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: "#FF9C00",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  submitButton: {
    backgroundColor: "#FF9C00",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addProductButton: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
  },

  modalInput: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10, // Giảm margin để có đủ không gian cho các trường
  },
  addProductFooter: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addProductFooterButton: {
    backgroundColor: "#FF9C00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  addProductFooterText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  productItemContainer: {
    flex: 1,
    margin: 5,
  },

  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    width: 40,
    height: 40,
  },
});

export default HomeScreen;

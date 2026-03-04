// src/util/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Tạo Context
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

// 2. Tạo Provider
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isBumping, setIsBumping] = useState(false);

  // Hàm lấy số lượng thực tế từ Database
  const refreshCartCount = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.id) {
      try {
        const res = await axios.get(`http://localhost:8080/get-cart-summary/${user.id}`);
        if (res.data.errCode === 0) {
          console.log(res.data.data.totalQuantity);
          setCartCount(res.data.data.totalQuantity || 0);
        }
      } catch (err) {
        console.error("Lỗi lấy số lượng giỏ hàng:", err);
      }
    }
  };

  // Tự động chạy khi khởi động ứng dụng
  useEffect(() => {
    refreshCartCount();
  }, []);

  // Hàm xử lý khi thêm vào giỏ hàng thành công
  const addToCartSuccess = (qty) => {
    setCartCount(prev => prev + qty);
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 300);
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, addToCartSuccess, refreshCartCount, isBumping }}>
      {children}
    </CartContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
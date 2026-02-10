import React, { useEffect } from 'react';
import { Routes, Route} from 'react-router-dom'; // Bỏ BrowserRouter ở đây đi
import ProductManager from './pages/ProductManager';
import Dashboard from './pages/Dashboard';

function App() {


  useEffect(() => {
    // 1. Kiểm tra URL xem có "quà" (Token) từ trang User gửi sang không
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get('accessToken');
    const userFromUrl = queryParams.get('userData');

    if (tokenFromUrl && userFromUrl) {
      // 2. Lưu vào kho của Admin
      localStorage.setItem('accessToken', tokenFromUrl);
      localStorage.setItem('currentUser', decodeURIComponent(userFromUrl));

      // 3. Xóa dấu vết trên URL để bảo mật và đẹp đội hình
      window.history.replaceState({}, document.title, "/");
      
      // 4. Quan trọng: Tải lại trang để cập nhật Token mới cho toàn bộ hệ thống
      // (Dùng reload an toàn hơn navigate trong trường hợp này)
      window.location.reload();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductManager />} />
    </Routes>
  );
}

export default App;
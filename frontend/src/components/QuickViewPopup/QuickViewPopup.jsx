import React, { useState } from 'react';
import axios from 'axios';
import './QuickViewPopup.css';

export default function QuickViewPopup({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);

  // Xử lý không cho đóng popup khi click vào phần nội dung bên trong
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handleDec = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleInc = () => {
    setQuantity(quantity + 1);
  };

   const handleAddToFavorite = async (e, productId) =>{
    e.preventDefault();   // Ngăn thẻ <Link> chuyển trang
    e.stopPropagation();  // Ngăn sự kiện nổi bọt lên các thẻ cha
    try {
      // LẤY THÔNG TIN USER TỪ TRÌNH DUYỆT (LOCALSTORAGE)
        const storedUser = localStorage.getItem('currentUser');

        // KIỂM TRA: Nếu chưa đăng nhập thì không cho gọi API
        if (!storedUser) {
           alert("Vui lòng đăng nhập để sử dụng tính năng này!");
           return;
        }
        const userData = JSON.parse(storedUser);
        const userId = userData.id;

      // 2. Gọi API POST lên Backend
        const response = await axios.post('http://localhost:8080/add-to-favorite', {
          user_id: userId,
          product_id: productId
        });

        if (response.data.errCode === 0) {
          alert("Đã thêm vào danh sách yêu thích!");
        } else if (response.data.errCode === 2) {
          alert("Sản phẩm này đã có trong danh sách rồi!");
        }

      } catch (error) {
        console.error("Lỗi thêm yêu thích:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
};


  return (
    // Lớp nền đen mờ bao phủ toàn màn hình, bấm vào nền sẽ gọi hàm onClose
    <div className="qv-overlay" onClick={onClose}>
      
      {/* Khung nội dung màu trắng */}
      <div className="qv-modal" onClick={handleModalClick}>
        
        {/* Nút X đóng popup ở góc trên */}
        <button className="qv-close-btn" onClick={onClose}>✕</button>

        {/* Nửa bên trái: Ảnh */}
        <div className="qv-left">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Nửa bên phải: Thông tin */}
        <div className="qv-right">
          <h2 className="qv-title">{product.name}</h2>
          <p className="qv-price">{formatPrice(product.price)} ₫</p>
          
          <p className="qv-desc">
            { product.description || ""}
          </p>

          {/* Cụm Số lượng và Thêm vào giỏ */}
          <div className="qv-actions">
            <div className="qv-quantity-box">
              <button onClick={handleDec}>−</button>
              <span>{quantity}</span>
              <button onClick={handleInc}>+</button>
            </div>
            <button className="qv-add-cart-btn">THÊM VÀO GIỎ HÀNG</button>
          </div>

          {/* Cụm Wishlist  */}
          <div className="qv-extra-actions">
            <button className="qv-extra-btn" onClick={(e) => handleAddToFavorite(e, product.id)}>♡ Yêu thích</button>
          </div>
        </div>

      </div>
    </div>
  );
}
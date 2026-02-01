import React, { useState } from 'react';
import './Wishlist.css';
import '../../index.css'
import { products } from '../../data/product.js'
const Wishlist = () => {
   const [wishlistItems] = useState(
    products.slice(0, 2).map(item => ({
      ...item,
      status: "Còn hàng" // Thêm trường trạng thái giả lập
    }))
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddToCart = (id) => {
    alert(`Đã thêm sản phẩm ID: ${id} vào giỏ hàng!`);
    // Logic thêm vào giỏ hàng thực tế sẽ viết ở đây
  };

  return (
    <div className="wishlist-page-wrapper">
      
      {/* TIÊU ĐỀ TRANG */}
      <div className="wishlist-header-section">
        <h1 className="wishlist-page-title">SẢN PHẨM YÊU THÍCH</h1>
      </div>

      {/* HEADER BẢNG */}
      <div className="wishlist-table-header">
        <div className="w-col w-product">SẢN PHẨM</div>
        <div className="w-col w-price">GIÁ</div>
        <div className="w-col w-status">TRẠNG THÁI</div>
        <div className="w-col w-action"></div> {/* Cột nút bấm */}
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="wishlist-items-container">
        {wishlistItems.length === 0 ? (
          <p className="wishlist-empty">Chưa có sản phẩm yêu thích nào.</p>
        ) : (
          wishlistItems.map((item) => (
            <div className="wishlist-item-row" key={item.id}>
              
              {/* Cột 1: Ảnh & Tên */}
              <div className="w-col w-product product-detail">
                <div className="wishlist-img-box">
                  <img src={item.images ? item.images[0] : "https://placehold.co/100"} alt={item.name} />
                </div>
                <h4 className="wishlist-item-name">{item.name}</h4>
              </div>

              {/* Cột 2: Giá */}
              <div className="w-col w-price">
                <span className="wishlist-price-text">{formatCurrency(item.price)}</span>
              </div>

              {/* Cột 3: Trạng thái */}
              <div className="w-col w-status">
                <span className="wishlist-status-text">{item.status}</span>
              </div>

              {/* Cột 4: Nút bấm */}
              <div className="w-col w-action">
                <button 
                  className="btn-add-cart-wishlist"
                  onClick={() => handleAddToCart(item.id)}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Wishlist
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../pages/Category/Category.css";

// Nhận prop productName từ App.jsx
const Breadcrumb = ({ productName }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // XỬ LÝ RIÊNG: Nếu là trang chi tiết sản phẩm (URL có dạng /product/...)
  if (currentPath.startsWith('/product/')) {
    return (
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-container">
          <Link to="/" className="breadcrumb-item">Trang chủ</Link>
          <span className="breadcrumb-separator">&gt;</span>
          
          <Link to="/Category" className="breadcrumb-item">Danh mục</Link>
          <span className="breadcrumb-separator">&gt;</span>
          
          {/* Tên sản phẩm được truyền từ App.jsx */}
          <span className="breadcrumb-item active">{productName || 'Chi tiết sản phẩm'}</span>
        </div>
      </div>
    );
  }

  // XỬ LÝ CHUNG: Dành cho các trang tĩnh còn lại
  const pathNames = {
    '/Category': 'Danh mục',
    '/Cart': 'Giỏ hàng',
    '/Contact': 'Liên hệ',
    '/Blog': 'Bài viết',
    '/Account': 'Tài khoản',
    '/MyAccount': 'Tài khoản của tôi',
    '/Wishlist': 'Yêu thích',
    '/AR': 'Thực tế tăng cường',
    '/Search': 'Tìm kiếm'
  };

  const currentName = pathNames[currentPath] || '';

  // Đề phòng trường hợp URL lạ không có trong danh sách
  if (!currentName) return null;

  return (
    <div className="breadcrumb-wrapper">
      <div className="breadcrumb-container">
        <Link to="/" className="breadcrumb-item">Trang chủ</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-item active">{currentName}</span>
      </div>
    </div>
  );
};

export default Breadcrumb;
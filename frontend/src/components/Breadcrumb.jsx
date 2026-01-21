import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../pages/Catalog/Catalog.css";

const Breadcrumb = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Bản đồ map từ đường dẫn URL -> Tên hiển thị
  const pathNames = {
    '/': 'Trang chủ',
    '/Catalog': 'Danh mục',
    '/Cart': 'Giỏ hàng',
    '/ProductDetail': 'Sản phẩm',
    '/Contact': 'Liên hệ',
    '/Blog': 'Blog',
    '/Account': 'Tài khoản',
    '/Like': 'Yêu thích',
    '/AR': 'Thực tế ảo',
  };

  // Lấy tên trang hiện tại, nếu không tìm thấy thì mặc định
  const currentName = pathNames[currentPath] || '';

  // Không hiện breadcrumb nếu đang ở trang chủ
  if (currentPath === '/') return null;

  return (
    <div className="breadcrumb-wrapper">
      <div className="breadcrumb-container">
        {/* Link quay về trang chủ */}
        <Link to="/" className="breadcrumb-item">Trang chủ</Link>
        
        <span className="breadcrumb-separator">&gt;</span>
        
        {/* Tên trang hiện tại */}
        <span className="breadcrumb-item active">{currentName}</span>
      </div>
    </div>
  );
};

export default Breadcrumb;
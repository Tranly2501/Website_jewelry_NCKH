import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './MyAccount.css';
import "../../index.css";

const MyAccount = () => {
  const navigate = useNavigate();
  
  // 2. Tạo state để lưu thông tin user
  const [user, setUser] = useState({
    fullName: "Khách",
    username: "guest",
    avatar: "https://i.pravatar.cc/150?img=default"
  });
  const [activeTab, setActiveTab] = useState('Thống kê'); 
  // Chạy 1 lần khi trang vừa load để lấy dữ liệu từ LocalStorage
  useEffect(() => {
    // Lấy chuỗi JSON từ localStorage
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      // Parse chuỗi JSON thành Object và lưu vào state
      setUser(JSON.parse(storedUser));
    } else {
      // Nếu không tìm thấy user (chưa đăng nhập), đá về trang đăng nhập
      navigate('/account'); 
    }
  }, [navigate]);

  //  Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    // Chuyển hướng về trang đăng nhập
    navigate('/account');
  };

  const menuItems = [
    'Thống kê',
    'Thông tin tài khoản',
    'Đổi mật khẩu',
    'Đơn mua',
    'Đăng xuất'
  ];

  // Logic xử lý khi bấm vào menu
  const handleMenuClick = (item) => {
    if (item === 'Đăng xuất') {
      handleLogout();
    } else {
      setActiveTab(item);
    }
  };

  // Nếu chưa load xong user thì có thể return null hoặc loading (tùy chọn)
  if (!user) return null;

  return (
    <>
      <div className="account-page-wrapper">
        <div className="container">
          {/* Page Title */}
          <h1 className="page-title">Tài khoản của tôi</h1>

          <div className="account-layout">
            {/* --- SIDEBAR TRÁI --- */}
            <div className="account-sidebar">
              
              {/* User Profile Summary */}
              <div className="user-profile-summary">
                <div className="avatar-frame">
                  {/*  Sử dụng dữ liệu từ state user */}
                  <img src={user.avatar || "https://i.pravatar.cc/150?img=5"} alt="User Avatar" />
                </div>
                <div className="user-info">
                  <span className="hello-text">Xin chào,</span>
                  {/* Hiển thị FullName hoặc Username từ localStorage */}
                  <span className="username-text">{user.fullName || user.username}</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <ul className="account-nav">
                {menuItems.map((item) => (
                  <li key={item}>
                    <button 
                      className={`nav-btn ${activeTab === item ? 'active' : ''}`}
                      onClick={() => handleMenuClick(item)} 
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- NỘI DUNG PHẢI --- */}
            <div className="account-content">
              {activeTab === 'Thống kê' && (
                <div className="dashboard-content fade-in">
                  <h3>Thống kê mua hàng </h3>
                  <p>
                    Chào mừng <strong>{user.fullName}</strong> quay trở lại. Tại đây bạn có thể xem các đơn hàng gần đây, quản lý địa chỉ giao hàng và thông tin tài khoản.
                  </p>
                </div>
              )}

              {/* Tab Thông tin tài khoản (Hiển thị dữ liệu thật) */}
              {activeTab === 'Thông tin tài khoản' && (
                <div className="other-content fade-in">
                  <h3>Thông tin cá nhân</h3>
                  <p><strong>Tên đăng nhập:</strong> {user.username}</p>
                  <p><strong>Họ và tên:</strong> {user.fullName}</p>
                  <p><strong>Email:</strong> {user.email || "Chưa cập nhật"}</p>
                  <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
                  <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
                </div>
              )}

              {/* Các tab khác */}
              {activeTab !== 'Thống kê' && activeTab !== 'Thông tin tài khoản' && (
                <div className="other-content fade-in">
                  <h3>{activeTab}</h3>
                  <p>Nội dung cho mục {activeTab} đang được cập nhật...</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>   
  );
};

export default MyAccount;
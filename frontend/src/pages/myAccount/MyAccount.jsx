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
  useEffect(() => {
        // 1. Lấy chuỗi JSON từ LocalStorage
        const storedUser = localStorage.getItem("currentUser");
        const token = localStorage.getItem("accessToken");

        // 2. Kiểm tra nếu CÓ user và CÓ token
        if (storedUser && token) {
            // Chuyển lại thành Object và lưu vào State
            setUser(JSON.parse(storedUser));
        } else {
            // 3. Nếu không có (chưa đăng nhập), đá về trang Login
            alert("Vui lòng đăng nhập trước!");
            navigate("/login"); 
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

  // Dữ liệu mẫu (sau này bạn thay bằng API)
  const stats = {
    totalOrders: 12,
    processing: 2,
    wishlist: 5,
    points: 1250
  };

  const recentOrders = [
    { id: 'DH0123', date: '05/03/2026', total: '1.250.000 ₫', status: 'Đang giao' },
    { id: 'DH0122', date: '28/02/2026', total: '850.000 ₫', status: 'Hoàn thành' },
  ];

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
                <div className="account-dashboard fade-in">
      <h2 className="dashboard-title">Thống kê mua hàng</h2>
      <p className="dashboard-subtitle">
        Chào mừng quay trở lại, Lê Thảo Ly. Tại đây bạn có thể xem các đơn hàng gần đây và thông tin tài khoản.
      </p>

      {/* --- PHẦN 1: CÁC THẺ SỐ LIỆU --- */}
      <div className="stat-cards-container">
        <div className="stat-card">
          <div className="stat-icon box-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon truck-icon">🚚</div>
          <div className="stat-info">
            <h3>{stats.processing}</h3>
            <p>Đơn đang giao</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon heart-icon">🤍</div>
          <div className="stat-info">
            <h3>{stats.wishlist}</h3>
            <p>Sản phẩm yêu thích</p>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: THẺ THÀNH VIÊN --- */}
      <div className="membership-card">
        <div className="membership-info">
          <h4>Hạng thành viên: <span>Silver (Bạc)</span></h4>
          <p>Tích lũy thêm <b>750.000 ₫</b> để lên hạng Vàng.</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* --- PHẦN 3: ĐƠN HÀNG MỚI NHẤT --- */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3>Đơn hàng gần đây</h3>
          <a href="/MyAccount/Orders" className="view-all-link">Xem tất cả</a>
        </div>
        
        <table className="recent-orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index}>
                <td className="order-id">#{order.id}</td>
                <td>{order.date}</td>
                <td className="order-total">{order.total}</td>
                <td>
                  <span className={`status-badge ${order.status === 'Hoàn thành' ? 'success' : 'processing'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
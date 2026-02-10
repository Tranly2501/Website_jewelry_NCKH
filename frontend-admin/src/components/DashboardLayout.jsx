import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartPie, FaBox, FaShoppingCart, FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../styles/DashboardStyle.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Thống kê', icon: <FaChartPie /> },
    { path: '/products', label: 'Sản phẩm', icon: <FaBox /> },
    { path: '/orders', label: 'Đơn hàng', icon: <FaShoppingCart /> },
    { path: '/customers', label: 'Khách hàng', icon: <FaUserFriends /> },
    { path: '/settings', label: 'Setting', icon: <FaCog /> },
  ];

  return (
    <div className="admin-wrapper">
      {/* 1. SIDEBAR CỐ ĐỊNH BÊN TRÁI */}
      <aside className="modern-sidebar">
        {/* Profile Admin ở trên cùng */}
        <div className="sidebar-profile">
          <div className="profile-img">
            <img src="https://placehold.co/100" alt="Admin" />
          </div>
          <div className="profile-info">
            <h3>Admin Jewelry</h3>
            <span>Quản trị viên</span>
          </div>
        </div>

        {/* Menu Nav */}
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Đăng xuất ở dưới cùng */}
        <div className="sidebar-logout">
          <Link to="/logout">
            <span className="icon"><FaSignOutAlt /></span>
            Đăng xuất
          </Link>
        </div>
      </aside>

      {/* 2. NỘI DUNG CHÍNH BÊN PHẢI */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
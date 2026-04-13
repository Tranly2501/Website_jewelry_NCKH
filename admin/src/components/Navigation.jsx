import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdShoppingBag, MdPeople, MdLogout} from 'react-icons/md';
import { IoDiamond } from 'react-icons/io5';
import { RiCouponLine } from 'react-icons/ri';
import '../styles/Navigation.css';

const Navigation = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title font-serif">The Italic Admin</h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item" end>
          <MdDashboard className="nav-icon" />
          <span className="nav-text">Thống kê</span>
        </NavLink>
        <NavLink to="/products" className="nav-item">
          <IoDiamond className="nav-icon" />
          <span className="nav-text">Quản lý sản phẩm</span>
        </NavLink>
        <NavLink to="/orders" className="nav-item">
          <MdShoppingBag className="nav-icon" />
          <span className="nav-text">Quản lý đơn hàng</span>
        </NavLink>
        <NavLink to="/coupons" className="nav-item">
          <RiCouponLine className="nav-icon" />
          <span className="nav-text">Quản lý mã giảm giá</span>
        </NavLink>
        <NavLink to="/customers" className="nav-item">
          <MdPeople className="nav-icon" />
          <span className="nav-text">Quản lý người dùng</span>
        </NavLink>

      </nav>
      
        <div className="sidebar-footer">
        <NavLink to="/settings" className="footer-link">
              <div className="user-avatar">
                <img 
                  alt="Quản trị viên" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4KkkZGbOd4Z5Ya3gsEnGa4LVRJdQOO6cGLzaVwncnzW60oo3EWuVpiqEWA3GyyUxSG5X8h6pBYCFPxANakPL_Sz9U5XIA3kdgVnOi4YXGM4SxGH-jo9bfGcuiuTf6I0HSfKGV0ydXUze5HoZDbz2pHECeuGe-eTkTZhSKElpZvdZpxs7wh2SzvQ26zyXH11qX9L2fJdUj0AoMNg8jPT_4CN7VDzIaocaTimt5j1i0srqw-3zYLkIw5q2hmNS383MglECKFtZ7BNdo"
                />
              </div>
              <div className="user-info">
                <p className="user-role">Quản trị viên</p>
                <p className="user-brand">Italic Cao Cấp</p>
              </div>
        </NavLink>
        <a href="#logout" className="footer-link">
          <MdLogout className="nav-icon" />
          <span>Đăng xuất</span>
        </a>
      </div>
    </aside>
  );
};

export default Navigation;
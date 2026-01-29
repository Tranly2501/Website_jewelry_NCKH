/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { products } from '../../data/product.js'; // Import data sản phẩm mẫu
import { users } from '../../data/user.js';       // Import data user mẫu

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [adminUser, setAdminUser] = useState(null);

  // State quản lý danh sách (để giả lập xóa/sửa)
  const [listProducts, setListProducts] = useState(products);
  const [listUsers, setListUsers] = useState(users);

  // 1. Kiểm tra quyền Admin khi vào trang
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!storedUser || storedUser.role !== 'admin') {
      alert("Bạn không có quyền truy cập trang này!");
      navigate('/LogIn'); // Đá về trang login
    } else {
      setAdminUser(storedUser);
    }
  }, [navigate]);

  // 2. Hàm giả lập Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
        const newList = listProducts.filter(p => p.id !== id);
        setListProducts(newList);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/LogIn');
  };

  if (!adminUser) return null;

  return (
    <div className="admin-container">
      {/* --- SIDEBAR --- */}
      <div className="admin-sidebar">
        <div className="admin-profile">
            <img src={adminUser.avatar} alt="Admin" />
            <h3>Admin Control</h3>
        </div>
        <ul className="admin-menu">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Thống kê</li>
            <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Quản lý Sản phẩm</li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Quản lý User</li>
            <li onClick={handleLogout} className="logout-btn">Đăng xuất</li>
        </ul>
      </div>

      {/* --- CONTENT --- */}
      <div className="admin-content">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
            <div className="admin-panel">
                <h2>Tổng quan hệ thống</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Tổng sản phẩm</h3>
                        <p>{listProducts.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Tổng thành viên</h3>
                        <p>{listUsers.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Doanh thu tháng</h3>
                        <p>125.000.000 ₫</p>
                    </div>
                </div>
            </div>
        )}

<div className='table-responsice'>
 <table className='admin-table'>
                {/* TAB 2: PRODUCTS */}
                {activeTab === 'products' && (
                    <div className="admin-panel">
                        <div className="panel-header">
                            <h2>Danh sách sản phẩm</h2>
                            <button className="btn-add">+ Thêm mới</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá ưu đãi</th>
                                    <th>Giá cũ </th>
                                    <th>Danh mục</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>#{product.id}</td>
                                        <td><img src={product.image} alt="" className="table-img"/></td>
                                        <td>{product.name}</td>
                                        <td>{Number(product.price).toLocaleString()} ₫</td>
                                        <td>{Number(product.oldPrice).toLocaleString()} ₫</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <button className="btn-edit">Sửa</button>
                                            <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        
                {/* TAB 3: USERS */}
                {activeTab === 'users' && (
                    <div className="admin-panel">
                        <h2>Danh sách người dùng</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span >
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
 </table>
</div>

      </div>
    </div>
  );
};

export default Admin;
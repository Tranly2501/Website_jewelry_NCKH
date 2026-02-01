/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios để gọi API
import './admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // Mặc định vào dashboard
  const [adminUser, setAdminUser] = useState(null);

  // --- STATE DỮ LIỆU TỪ DB ---
  const [listProducts, setListProducts] = useState([]); // Khởi tạo mảng rỗng
  const [listUsers, setListUsers] = useState([]);       // Khởi tạo mảng rỗng

  // 1. Kiểm tra quyền Admin & Load dữ liệu
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // A. Check quyền
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Kiểm tra role (Admin hoặc admin)
      if (!storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'Admin')) {
        alert("Bạn không có quyền truy cập trang này!");
        navigate('/Login'); // Về trang login
        return;
      }
      setAdminUser(storedUser);

      // B. Gọi API lấy dữ liệu thật
      try {
        // Lấy Products
        const resProducts = await axios.get('http://localhost:3000/api/products');
        setListProducts(resProducts.data);

        // Lấy Users
        const resUsers = await axios.get('http://localhost:3000/api/users');
        setListUsers(resUsers.data);

      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // 2. Hàm Xóa sản phẩm (Gọi API xóa thật)
  const handleDeleteProduct = async (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa sản phẩm này khỏi Database?")) {
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`);
            
            // Xóa thành công trên Server -> Cập nhật lại giao diện
            const newList = listProducts.filter(p => p.id !== id);
            setListProducts(newList);
            alert("Đã xóa thành công!");
        } catch (error) {
            alert("Lỗi khi xóa sản phẩm!");
        }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken'); // Xóa cả token nếu có
    navigate('/Login'); 
  };

  if (!adminUser) return null;

  return (
    <div className="admin-container">
      {/* --- SIDEBAR --- */}
      <div className="admin-sidebar">
        <div className="admin-profile">
            <img src={adminUser.avatar || "https://via.placeholder.com/150"} alt="Admin" />
            <h3>Hello, {adminUser.username}</h3>
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
                        <p>0 ₫</p> 
                    </div>
                </div>
            </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
            <div className="admin-panel">
                <div className="panel-header">
                    <h2>Danh sách sản phẩm</h2>
                    <button className="btn-add">+ Thêm mới</button>
                </div>
                <div className="table-responsive"> {/* Đã sửa lỗi chính tả ở đây */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Danh mục</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listProducts.map(product => (
                                <tr key={product.id}>
                                    <td>#{product.id}</td>
                                    <td>
                                        <img src={product.image} alt="" className="table-img"/>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        {product.price ? Number(product.price).toLocaleString() : 0} ₫
                                    </td>
                                    <td>{product.category || "Chưa có"}</td>
                                    <td>
                                        <button className="btn-edit">Sửa</button>
                                        <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        
        {/* TAB 3: USERS */}
        {activeTab === 'users' && (
            <div className="admin-panel">
                <h2>Danh sách người dùng</h2>
                <div className="table-responsive"> {/* Đã sửa lỗi chính tả ở đây */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listUsers.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{ 
                                            color: user.role === 'admin' ? 'red' : 'green',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    {/* Lưu ý: Kiểm tra xem API trả về là createdAt hay create_at */}
                                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
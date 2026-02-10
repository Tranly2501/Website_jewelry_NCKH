import React, { useState, useEffect } from 'react';
import DashboardLayout from "../components/DashboardLayout";
import { FaPlus, FaSearch, FaFilter, FaEllipsisH, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import '../styles/ProductManager.css';

const ProductManager = () => {
  // 1. KHỞI TẠO STATE
  const [products, setProducts] = useState([]); // Ban đầu là mảng rỗng
  const [isLoading, setIsLoading] = useState(true); // State để hiển thị loading

  // State quản lý menu hành động
  const [openMenuId, setOpenMenuId] = useState(null);

  // 2. GỌI API LẤY DỮ LIỆU KHI COMPONENT ĐƯỢC MOUNT
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/get-all-products');
        
        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
        }

        const data = await response.json();
        
        // Lưu ý: Kiểm tra cấu trúc data trả về từ API. 
        // Nếu API trả về { data: [...] } thì dùng setProducts(data.data)
        // Ở đây giả sử API trả về trực tiếp mảng [...]
        setProducts(data); 

      } catch (error) {
        console.error("Failed to fetch products:", error);
        alert("Không thể kết nối đến server!");
      } finally {
        setIsLoading(false); // Tắt loading dù thành công hay thất bại
      }
    };

    fetchProducts();
  }, []); 
  // Toggle menu hành động
  const toggleMenu = (id) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  // Hàm xóa sản phẩm (Cần gọi API xóa thật sự)
  const handleDelete = async (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa?")) {
      try {
        // Gọi API xóa (Ví dụ)
        // await fetch(`http://localhost:8080/delete-product/${id}`, { method: 'DELETE' });
        
        // Cập nhật lại giao diện sau khi xóa
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  // Hàm render Badge trạng thái
  const renderStatusBadges = (item) => {
    // LƯU Ý: Nếu API trả về các trường boolean (isAR, isSale...) thay vì mảng tags
    // Bạn cần sửa logic này để phù hợp với API.
    // Dưới đây là giữ nguyên logic cũ theo mảng 'tags'.
    const tags = item.tags; 

    if (!tags || tags.length === 0) return <span className="badge badge-normal">Mặc định</span>;

    return tags.map((tag, index) => {
      let label = "";
      let className = "badge";
      
      switch(tag) {
        case 'ar': label = "Có AR 3D"; className += " badge-ar"; break;
        case 'sale': label = "Đang Sale"; className += " badge-sale"; break;
        case 'hot': label = "Hot"; className += " badge-hot"; break;
        case 'new': label = "Mới"; className += " badge-new"; break;
        default: label = tag; className += " badge-normal";
      }
      return <span key={index} className={className}>{label}</span>;
    });
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        
        {/* HEADER */}
        <div className="page-header">
          <h2 className="page-title">Danh sách sản phẩm</h2>
          <div className="header-actions">
            <button className="btn-primary"><FaPlus /> Thêm sản phẩm</button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="table-card">
          
          {/* FILTER BAR */}
          <div className="filter-bar">
            <div className="search-wrapper">
              <FaSearch className="search-icon"/>
              <input type="text" placeholder="Tìm kiếm sản phẩm..." />
            </div>
            <div className="filter-options">
              <select className="filter-select"><option>Tất cả danh mục</option></select>
              <select className="filter-select"><option>Tất cả trạng thái</option></select>
              <button className="btn-filter"><FaFilter /> Lọc</button>
            </div>
          </div>

          {/* HIỂN THỊ LOADING HOẶC BẢNG DỮ LIỆU */}
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>
                <FaSpinner className="icon-spin" /> Đang tải dữ liệu...
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th width="40"><input type="checkbox" /></th>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th style={{textAlign: 'right'}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* CHECK NẾU KHÔNG CÓ DỮ LIỆU */}
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                            Chưa có sản phẩm nào.
                        </td>
                    </tr>
                ) : (
                    products.map(item => (
                    <tr key={item.id}>
                        <td><input type="checkbox" /></td>
                        
                        {/* Cột Tên & Ảnh */}
                        <td>
                        <div className="product-cell">
                            {/* Xử lý ảnh an toàn hơn: Kiểm tra null/undefined */}
                            <img 
                                src={
                                    (item.images && item.images.length > 0) ? item.images[0] : 
                                    (item.image ? item.image : "https://via.placeholder.com/50")
                                } 
                                alt="" 
                                onError={(e) => {e.target.src = "https://via.placeholder.com/50"}} // Ảnh lỗi thì hiện ảnh giả
                            />
                            <div className="info">
                            <span className="name">#{item.id} - {item.name}</span>
                            </div>
                        </div>
                        </td>

                        {/* Cột Danh mục */}
                        <td>{item.category || "---"}</td>
                        
                        <td style={{fontWeight: 'bold'}}>
                            {item.price ? item.price.toLocaleString() : 0} ₫
                        </td>

                        {/* Cột Trạng thái */}
                        <td>
                        <div className="status-cell">
                            {/* Truyền toàn bộ item vào nếu bạn muốn xử lý logic isAR/isSale... */}
                            {renderStatusBadges(item)}
                        </div>
                        </td>

                        {/* Cột Hành động */}
                        <td style={{textAlign: 'right', position: 'relative'}}>
                        <button 
                            className="btn-action-trigger"
                            onClick={() => toggleMenu(item.id)}
                        >
                            <FaEllipsisH />
                        </button>

                        {openMenuId === item.id && (
                            <div className="action-dropdown">
                            <div className="dropdown-item">
                                <FaEdit /> Sửa sản phẩm
                            </div>
                            <div className="dropdown-item delete" onClick={() => handleDelete(item.id)}>
                                <FaTrash /> Xóa sản phẩm
                            </div>
                            </div>
                        )}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductManager;
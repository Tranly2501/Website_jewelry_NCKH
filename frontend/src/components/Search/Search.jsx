import React, { useState, useEffect } from 'react';
import './search.css';
import { products } from '../../data/product.js';
 // Import data của bạn
const categoryMapping = {
  "ring": "Nhẫn",
  "bracelet": "Vòng tay",
  "sets": "Bộ sưu tập"
};

const Search = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Giới hạn sp hiện thị 
  const limit = 8;

  const getVietnameseCategory = (englishCategory) => {
    if (!englishCategory) return "";
    // Chuyển về chữ hoa hoặc thường để so khớp chính xác với bảng mapping
    return categoryMapping[englishCategory] || categoryMapping[englishCategory.toLowerCase()] || englishCategory;
  };

  // Xử lý khi người dùng nhập liệu
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredProducts([]); // Nếu ô trống thì không hiện gì (như ảnh 2)
    } else {
      // Lọc sản phẩm theo tên
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(results);
    }
  };

  // Xóa ô tìm kiếm
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts([]);
  };

  // Cắt mảng đối với nhưng từ tìm kiếm khớp hơn 8 sp
  const visibleProducts = filteredProducts.slice(0,limit)

  // Ngăn cuộn trang body khi popup mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-popup-overlay">
      {/* Nút đóng */}
      <button className="close-search-btn" onClick={onClose}>
        ✕
      </button>

      <div className="search-content">
        <h2 className="search-heading">Bạn đang tìm kiếm sản phẩm gì?</h2>

        {/* Ô Input */}
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm...."
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          {searchTerm && (
            <span className="clear-btn" onClick={clearSearch}>
              ✕ Xóa hết
            </span>
          )}
        </div>

        {/* Khu vực hiển thị kết quả */}
        <div className="search-results-container">
          {/* Trường hợp 1: Chưa nhập gì hoặc không có kết quả -> Có thể để trống hoặc hiện Gợi ý */}
          {searchTerm && filteredProducts.length === 0 && (
             <p className="no-result">Không có sản phẩm.</p>
          )}

          {/* Trường hợp 2: Có kết quả (Như ảnh 1) */}
          {filteredProducts.length > 0 && (
            <div className="result-list">
              {visibleProducts.map((item) => (
                <div key={item.id} className="result-item">
                  <div className="result-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="result-info">
                    <span className="result-category">{getVietnameseCategory(item.category) }</span>
                    <h4 className="result-name">{item.name}</h4>
                    <p className="result-price">
                      {item.price.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              ))}

              {filteredProducts.length > limit && (
                <div className="view-all-wrapper">
                  <button className="btn-view-all">
                    Xem thêm ({filteredProducts.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
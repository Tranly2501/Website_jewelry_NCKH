import React, { useState, useEffect } from 'react';
import './search.css';
import axios from 'axios';
import { transformProduct } from '../../util/transformProduct.js';

const categoryMapping = {
  "ring": "Nhẫn",
  "bracelet": "Vòng tay",
  "sets": "Bộ sưu tập",
  "other": "Khác"
};

const Search = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 8;

  const getVietnameseCategory = (englishCategory) => {
    if (!englishCategory) return "";
    return categoryMapping[englishCategory.toLowerCase()] || englishCategory;
  };

  // 1. XỬ LÝ TÌM KIẾM VỚI DEBOUNCE (Tối ưu cho API)
  useEffect(() => {
    // Nếu không có từ khóa hoặc popup đóng thì không làm gì
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    // Đợi 500ms sau khi người dùng ngừng gõ mới gọi API
    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsLoading(true);
        // Gửi từ khóa lên server để DB tự tìm kiếm
        const response = await axios.get(`http://localhost:8080/search-products?q=${searchTerm}`);
        
        if (response.data && response.data.products) {
          const transformed = response.data.products.map(item => transformProduct(item));
          setFilteredProducts(transformed);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm API:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const visibleProducts = filteredProducts.slice(0, limit);

  // Khóa cuộn trang
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-popup-overlay">
      <button className="close-search-btn" onClick={onClose}>✕</button>

      <div className="search-content">
        <h2 className="search-heading">Bạn đang tìm kiếm sản phẩm gì?</h2>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm...."
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          {searchTerm && (
            <span className="clear-btn" onClick={clearSearch}>✕ Xóa hết</span>
          )}
        </div>

        <div className="search-results-container">
          {isLoading && <p className="loading-text">Đang tìm kiếm trong kho dữ liệu...</p>}

          {!isLoading && searchTerm && filteredProducts.length === 0 && (
            <p className="no-result">Không tìm thấy sản phẩm nào phù hợp.</p>
          )}

          {!isLoading && filteredProducts.length > 0 && (
            <div className="result-list">
              {visibleProducts.map((item) => (
                <div key={item.id} className="result-item" onClick={() => window.location.href = `/product/${item.id}`}>
                  <div className="result-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="result-info">
                    <span className="result-category">{getVietnameseCategory(item.category)}</span>
                    <h4 className="result-name">{item.name}</h4>
                    <p className="result-price">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                </div>
              ))}

              {filteredProducts.length > limit && (
                <div className="view-all-wrapper">
                  <button className="btn-view-all">
                    Xem tất cả ({filteredProducts.length}) kết quả
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
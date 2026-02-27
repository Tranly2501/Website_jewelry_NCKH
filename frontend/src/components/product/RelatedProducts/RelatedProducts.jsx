import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../index.css";
import './RelatedProducts.css';

import ProductCard from '../productCard/ProductCard.jsx';
// Import hàm biến đổi dữ liệu quen thuộc
import { transformProduct } from "../../../util/transformProduct.js";

// Truyền thêm prop currentProductId để lát nữa lọc bỏ sản phẩm đang xem ra khỏi danh sách
const RelatedProducts = ({ currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (Bắt đầu từ 0)
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 4; // Mỗi lần bấm dot sẽ hiện 4 sản phẩm

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        // Lấy tất cả sản phẩm
        const response = await axios.get("http://localhost:8080/get-all-products");
        const rawData = response.data.products || response.data || [];

        // Phù phép data
        let formattedData = rawData.map(item => transformProduct(item));

        // MẸO UX: Lọc bỏ cái sản phẩm mà người dùng đang xem ở trang Chi tiết (để không bị trùng)
        if (currentProductId) {
          formattedData = formattedData.filter(p => p.id !== Number(currentProductId));
        }

        setRelatedProducts(formattedData);
      } catch (error) {
        console.error("Lỗi tải sản phẩm liên quan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId]);

  // --- LOGIC PHÂN TRANG (PAGINATION) ---
  // Tính tổng số trang (Ví dụ: 10 sản phẩm / 4 = 2.5 -> Làm tròn lên là 3 trang)
  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);
  
  // Tính toán vị trí cắt mảng dựa vào trang hiện tại
  const startIndex = currentPage * itemsPerPage;
  const currentDisplayList = relatedProducts.slice(startIndex, startIndex + itemsPerPage);

  // --- RENDER ---
  if (isLoading) return <div style={{ textAlign: "center", padding: "20px" }}>Đang tải sản phẩm liên quan...</div>;
  if (relatedProducts.length === 0) return null; // Nếu không có sản phẩm nào thì ẩn luôn khối này

  return (
    <section className="related-products-section">
      <h2 className="section-title">Một số sản phẩm khác</h2>
      
      {/* Grid Layout: Hiển thị 4 sản phẩm đã bị cắt bởi slice() */}
      <div className="related-grid">
        {currentDisplayList.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {/* Pagination Dots: Tự động sinh ra số lượng dot dựa trên totalPages */}
      {totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span 
              key={index}
              className={`dot ${currentPage === index ? "active" : ""}`} // Nếu dot này trùng với trang hiện tại thì cho class active (sáng lên)
              onClick={() => setCurrentPage(index)} // Bấm vào dot nào thì chuyển sang trang đó
              style={{ cursor: "pointer" }}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
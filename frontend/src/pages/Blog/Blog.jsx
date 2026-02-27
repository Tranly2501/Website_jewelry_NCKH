import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';
import { FaCalendarAlt, FaUser, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';

// Import hàm biến đổi dữ liệu quen thuộc
import { transformProduct } from "../../util/transformProduct.js";

const Blog = () => {
  // 1. TẠO STATE LƯU TRỮ DỮ LIỆU TỪ API
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. FETCH DỮ LIỆU SẢN PHẨM KHI TRANG VỪA LOAD
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setIsLoading(true);
        // Gọi API lấy toàn bộ sản phẩm (Bạn có thể đổi URL nếu có API riêng cho sản phẩm nổi bật)
        const response = await axios.get("http://localhost:8080/get-all-products");
        
        const rawData = response.data.products || response.data || [];

        // Lấy 3 sản phẩm đầu tiên và dùng transformProduct để format lại hình ảnh, giá...
        const formattedData = rawData.slice(0, 3).map(item => transformProduct(item));
        
        setSuggestedProducts(formattedData);
      } catch (error) {
        console.error("Lỗi tải sản phẩm gợi ý:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedProducts();
  }, []);

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  return (
    <div className="blog-page-wrapper">        
        {/* --- CỘT TRÁI: NỘI DUNG BÀI VIẾT --- */}
        <div className="blog-content-col">
          
          {/* Header bài viết */}
          <div className="article-header">
            <span className="article-category">Kinh nghiệm hay</span>
            <h1 className="article-title">BÍ QUYẾT CHỌN NHẪN KIM CƯƠNG HOÀN HẢO CHO NGÀY CƯỚI</h1>
            <div className="article-meta">
              <span><FaCalendarAlt /> 30/01/2026</span>
              <span><FaUser /> Bởi: Admin Jewelry</span>
            </div>
          </div>

          {/* Ảnh đại diện bài viết */}
          <div className="article-featured-image">
            <img src="https://placehold.co/800x450" alt="Nhẫn kim cương" />
          </div>

          {/* Nội dung chính */}
          <div className="article-body">
            <p className="lead-text">
              Nhẫn cưới không chỉ là tín vật tình yêu mà còn là món trang sức đi cùng bạn suốt cuộc đời. Việc lựa chọn một chiếc nhẫn hoàn hảo đòi hỏi sự tinh tế và hiểu biết nhất định.
            </p>
            
            <h3>1. Hiểu về tiêu chuẩn 4C</h3>
            <p>
              Khi nói đến kim cương, tiêu chuẩn 4C (Carat, Cut, Color, Clarity) là thước đo vàng. Bạn cần cân nhắc kỹ lưỡng giữa kích thước và độ tinh khiết để phù hợp với ngân sách.
            </p>
            
            {/* Trích dẫn nổi bật */}
            <blockquote className="article-quote">
              "Trang sức không chỉ là phụ kiện, nó là ngôn ngữ thể hiện cá tính và đẳng cấp của người sở hữu."
            </blockquote>

            <h3>2. Lựa chọn chất liệu vỏ nhẫn</h3>
            <p>
              Vàng trắng, vàng hồng hay Platinum? Mỗi chất liệu đều có vẻ đẹp riêng. Nếu bạn yêu thích sự cổ điển, vàng 18K là lựa chọn tuyệt vời. Nếu thích sự hiện đại, hãy chọn Platinum.
            </p>
            
            <div className="image-grid-2">
                <img src="https://placehold.co/400x300" alt="Mẫu 1" />
                <img src="https://placehold.co/400x300" alt="Mẫu 2" />
            </div>
          </div>

          {/* Footer bài viết: Tag & Share */}
          <div className="article-footer">
            <div className="article-tags">
              <span>Tags:</span>
              <a href="#">#NhanCuoi</a>
              <a href="#">#KimCuong</a>
              <a href="#">#TrangSuc</a>
            </div>
            <div className="article-share">
              <span>Chia sẻ:</span>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaPinterest /></a>
            </div>
          </div>

        </div>

        {/* --- CỘT PHẢI: SIDEBAR --- */}
        <div className="blog-sidebar-col">
          
          {/* Widget: Tìm kiếm */}
          <div className="sidebar-widget search-widget">
            <input type="text" placeholder="Tìm kiếm bài viết..." />
            <button>GO</button>
          </div>

          {/* Widget: Danh mục */}
          <div className="sidebar-widget">
            <h3 className="widget-title">DANH MỤC</h3>
            <ul className="category-list">
              <li><a href="#">Trang sức cưới <span>(12)</span></a></li>
              <li><a href="#">Kiến thức kim cương <span>(5)</span></a></li>
              <li><a href="#">Xu hướng mới <span>(8)</span></a></li>
              <li><a href="#">Khuyến mãi <span>(3)</span></a></li>
            </ul>
          </div>

          {/* Widget: Sản phẩm nổi bật (Cross-sale) */}
         <div className="sidebar-widget product-widget">
            <h3 className="widget-title">SẢN PHẨM GỢI Ý</h3>
            
            {/* 3. HIỂN THỊ LOGIC TỪ API */}
            {isLoading ? (
               <p style={{ textAlign: "center", color: "#666", padding: "10px" }}>Đang tải...</p>
            ) : suggestedProducts.length > 0 ? (
               suggestedProducts.map((product) => (
                 <div className="mini-product-card" key={product.id}>
                   <img 
                     src={product.images ? product.images[0] : (product.image || "https://placehold.co/80")} 
                     alt={product.name} 
                   />
                   
                   <div className="mini-info">
                     <h4>{product.name}</h4>
                     <p>{formatCurrency(product.price)}</p>
                   </div>
                 </div>
               ))
            ) : (
               <p style={{ textAlign: "center", color: "#666" }}>Chưa có sản phẩm gợi ý.</p>
            )}

          </div>

        </div>

      </div>
  );
};

export default Blog;
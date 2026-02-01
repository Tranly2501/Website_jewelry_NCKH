import React from 'react';
import './Blog.css';
import { FaCalendarAlt, FaUser, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';
import {products} from "../../data/product.js";

const Blog = () => {
    const suggestedProducts = products.slice(0, 3);

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
            
            {/* Map dữ liệu từ biến suggestedProducts */}
            {suggestedProducts.map((product) => (
              <div className="mini-product-card" key={product.id}>
                <img 
                  src={product.images ? product.images[0] : (product.image || "https://placehold.co/80")} 
                  alt={product.name} 
                />
                
                <div className="mini-info">
                  {/* Tên sản phẩm */}
                  <h4>{product.name}</h4>
                  
                  {/* Giá tiền đã format */}
                  <p>{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
  );
};

export default Blog;
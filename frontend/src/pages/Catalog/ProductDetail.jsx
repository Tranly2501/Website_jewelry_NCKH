import React, { useState } from 'react'
import "../Catalog/productDetail.css";
// import '../../index.css'; // Nếu cần
import Breadcrumb from '../../components/Breadcrumb';
import Polycy from '../../components/Polycy/Policy.jsx';
import RelatedProducts from '../../components/product/RelatedProducts/RelatedProducts.jsx';
import { products } from '../../data/product.js';

import Like from '../../assets/heart.svg'
import fullScreen from '../../assets/fullScreen.svg'

function ProductDetail() {
  const product = products[1]; 
  const [mainImage, setMainImage] = useState(product ? product.images[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("16 cm");
  
  // 1. STATE QUẢN LÝ TAB ĐANG MỞ
  const [activeTab, setActiveTab] = useState("description");

  const sizes = product.sizes || [];

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="page-container">
      <Breadcrumb />
      
      {/* ---  GALLERY & INFO --- */}
      <div className="product-wrapper">
        
        {/* Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={mainImage} alt={product.name} />
            <div className="overlay-icons">
               <img src={Like} alt="like" className="icon" />
               <img src={fullScreen} alt="fullscreen" className="icon" />
            </div>
          </div>

          <div className="thumbnail-list">
              {product.images.map((imgSrc, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${mainImage === imgSrc ? "active" : ""}`}
                  onClick={() => setMainImage(imgSrc)}
                >
                  <img src={imgSrc} alt={`thumb-${index}`} />
                </div>
              ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="product-info-box">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-row">
            <span className="stars">
              {"★".repeat(product.rating || 5)}
              {"☆".repeat(5 - (product.rating || 5))}
            </span>
          </div>

          <div className="price">{Number(product.price).toLocaleString()} ₫</div>
          
          <p className="description">{product.description}</p>
          
          <div className="attribute-line">
            <strong>Chất liệu: </strong>
            <span className="gold-text ">{product.material}</span>
          </div>

          <div className="attribute-block">
            <strong>Kích thước:</strong>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn-size ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="attribute-block">
            <strong>Số lượng</strong>
            <div className="quantity-control">
              <button onClick={() => handleQuantity('dec')}>-</button>
              <input value={quantity} readOnly />
              <button onClick={() => handleQuantity('inc')}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-add-cart">Thêm vào giỏ hàng</button>
            <button className="btn-ar">Trải nghiệm Ar</button>
          </div>
        </div>
      </div>

      {/* ---  TABS CHI TIẾT --- */}
      <div className="product-detail-section">
        {/* Header Tabs */}
        <div className="tab-headers">
          <button 
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            MÔ TẢ CHI TIẾT
          </button>
          <button 
            className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`}
            onClick={() => setActiveTab("specifications")}
          >
            THÔNG SỐ KỸ THUẬT
          </button>
          <button 
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            ĐÁNH GIÁ
          </button>
        </div>

        {/* Content Tabs */}
        <div className="tab-content-container">
          
          {/* TAB 1: MÔ TẢ (Giữ nguyên hoặc tùy chỉnh) */}
          {activeTab === "description" && (
            <div className="tab-pane fade-in">
              <div className="description-box">
                <p >
                  {product.descriptionDetail}
                </p>
              </div>
            </div>
          )}
          
          {/* TAB 2: THÔNG SỐ */}
          {activeTab === "specifications" && (
            <div className="tab-pane fade-in">
              <div className="specs-table">
               {product.specs && product.specs.length > 0 ? (
                  product.specs.map((item, index) => (
                    <div className="spec-row" key={index}>
                      <span className="spec-label">{item.label}</span>
                      <span className="spec-value">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p style={{textAlign: 'center'}}>Chưa có thông số kỹ thuật.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ĐÁNH GIÁ */}
          {activeTab === "reviews" && (
            <div className="tab-pane fade-in">
              <div className="review-form-container">
                <h3 className="review-heading">Hãy Là Người Đầu Tiên Đánh Giá Sản Phẩm</h3>
                
             <form className="review-form">
                    <div className="form-group">
                        <textarea className="form-control" rows="5" placeholder="Đánh giá của bạn *"></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group half-width">
                            <input type="text" className="form-control" placeholder="Tên *" />
                        </div>
                        <div className="form-group half-width">
                            <input type="email" className="form-control" placeholder="Email *" />
                        </div>
                    </div>
                    <span> Địa chỉ email của quý khách sẽ được bảo mật và không công bố. Những trường thông tin bắt buộc sẽ được đánh dấu * </span>
                    <button type="button" className="btn-submit-review">ĐÁNH GIÁ</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* ---  CÁC SẢN PHẨM LIÊN QUAN --- */}
          <RelatedProducts />
      <Polycy />
    </div>
  )   
}

export default ProductDetail
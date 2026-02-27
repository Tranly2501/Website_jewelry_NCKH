import React, { useState, useEffect } from 'react';
import "../Category/productDetail.css";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Import các công cụ và component bổ trợ
import { transformProduct } from "../../util/transformProduct.js";

import RelatedProducts from '../../components/product/RelatedProducts/RelatedProducts.jsx';

// Import assets
import Like from '../../assets/heart.svg';
import fullScreen from '../../assets/fullScreen.svg';

function ProductDetail({ setProductName }) {
  const { id } = useParams();
  // 1. KHỞI TẠO STATE
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("16 cm");
  const [activeTab, setActiveTab] = useState("description");


  // 2. GỌI API LẤY CHI TIẾT SẢN PHẨM
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        window.scrollTo(0, 0);
        const response = await axios.get(`http://localhost:8080/get-product/${id}`);

        // GIẢI PHÁP: Tự động tìm object thực tế (responseData.product)
        const responseData = response.data;
        const actualData = responseData.product || responseData.data || responseData;

        if (actualData && (actualData.name || actualData.id)) {
          const formattedProduct = transformProduct(actualData);
          setProduct(formattedProduct);
          // Gán ảnh đầu tiên làm ảnh chính khi vừa load xong
          if (formattedProduct.images && formattedProduct.images.length > 0) {
            setMainImage(formattedProduct.images[0]);
          }
    // 2. BƯỚC MỚI: Bắn tên sản phẩm ngược lên App.jsx cho Breadcrumb hiển thị
          if (setProductName) {
            setProductName(formattedProduct.name);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Lỗi API:", err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  // Dọn dẹp tên sản phẩm khi người dùng rời khỏi trang chi tiết
    return () => {
      if (setProductName) {
        setProductName("");
      }
    };
  }, [id, setProductName]);

  // 3. CÁC HÀM XỬ LÝ SỰ KIỆN
  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

   const handleAddToFavorite = async (e, productId) =>{
    e.preventDefault();   // Ngăn thẻ <Link> chuyển trang
    e.stopPropagation();  // Ngăn sự kiện nổi bọt lên các thẻ cha
    try {
      // LẤY THÔNG TIN USER TỪ TRÌNH DUYỆT (LOCALSTORAGE)
        const storedUser = localStorage.getItem('currentUser');

        // KIỂM TRA: Nếu chưa đăng nhập thì không cho gọi API
        if (!storedUser) {
           alert("Vui lòng đăng nhập để sử dụng tính năng này!");
           return;
        }
        const userData = JSON.parse(storedUser);
        const userId = userData.id;

      // 2. Gọi API POST lên Backend
        const response = await axios.post('http://localhost:8080/add-to-favorite', {
          user_id: userId,
          product_id: productId
        });

        if (response.data.errCode === 0) {
          alert("Đã thêm vào danh sách yêu thích!");
        } 

      } catch (error) {
        console.error("Lỗi thêm yêu thích:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
};


  

  // 4. KIỂM TRA TRẠNG THÁI (GARDEN CLAUSES)
if (isLoading) return <div style={{ textAlign: "center", padding: "100px" }}>Đang tải...</div>;
  if (!product) return <div style={{ textAlign: "center", padding: "100px" }}>Sản phẩm không tồn tại!</div>;

  // TÍNH TOÁN AN TOÀN
  const safeRating = Math.max(0, Math.min(5, Math.round(product.rating || 5)));

  return (
    <>
        
    <div className="page-container">

      {/* --- GALLERY & INFO --- */}
      <div className="product-wrapper">
        
        {/* Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img 
              src={mainImage || product.image} 
              alt={product.name} 
            />
            <div className="overlay-icons">
               <img src={Like} alt="like" className="icon"  onClick={(e) => handleAddToFavorite(e, product.id)}/>
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
              {"★".repeat(safeRating)}
              {"☆".repeat(5 - safeRating)}
            </span>
            <span className="review-count"> ({product.reviewCount} đánh giá)</span>
          </div>

          <div className="price">{product.price.toLocaleString('vi-VN')} ₫</div>
          <p className="description">{product.description}</p>
          
          <div className="attribute-line">
            <strong>Chất liệu: </strong>
            <span className="gold-text ">{product.material || "Đang cập nhật"}</span>
          </div>

          <div className="attribute-block">
            <strong>Kích thước:</strong>
            <div className="size-options">
            {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`btn-size ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >{size}</button>
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
          <Link to="/AR" state={{ productData: product }}>
            <button className="btn-ar">Trải nghiệm AR</button>
          </Link>
          </div>
        </div>
      </div>

      {/* --- TABS CHI TIẾT --- */}
      <div className="product-detail-section">
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

        <div className="tab-content-container">
          {activeTab === "description" && (
            <div className="tab-pane fade-in">
              <div className="description-box">
                <p>{product.descriptionDetail || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
              </div>
            </div>
          )}
          
          {activeTab === "specifications" && (
            <div className="tab-pane fade-in">
              <div className="specs-table">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((item, index) => (
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
                    <button type="button" className="btn-submit-review">ĐÁNH GIÁ</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts currentProductId={id} />
    </div>
    </>
  );
}

export default ProductDetail;
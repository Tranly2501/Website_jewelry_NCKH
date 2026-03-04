import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';
import {useCart} from '../../util/CartContenxt.jsx';
import { transformProduct } from "../../util/transformProduct.js";
import RelatedProducts from '../../components/product/RelatedProducts/RelatedProducts.jsx';

import Like from '../../assets/heart.svg';
import fullScreen from '../../assets/fullScreen.svg';
import "../Category/productDetail.css";

function ProductDetail({ setProductName }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- 1. STATE ---
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("16 cm");
  const [activeTab, setActiveTab] = useState("description");

  const { addToCartSuccess } = useCart();

  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(""); // Dùng duy nhất state này cho nội dung bình luận

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

  // --- 2. API FUNCTIONS ---
  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      window.scrollTo(0, 0);
      
      const resProd = await axios.get(`http://localhost:8080/get-product/${id}`);
      const actualData = resProd.data.product || resProd.data.data || resProd.data;

      if (actualData) {
        const formatted = transformProduct(actualData);
        setProduct(formatted);
        if (formatted.images?.length > 0) setMainImage(formatted.images[0]);
        if (setProductName) setProductName(formatted.name);
      }

      const resFeed = await axios.get(`http://localhost:8080/get-feedback/${id}`);
      if (resFeed.data.errCode === 0) {
        setReviews(resFeed.data.data || []);
      }

    } catch (err) {
      console.error("Lỗi tải trang:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductData();
    return () => { if (setProductName) setProductName(""); };
  }, [id]);

  // --- 3. EVENT HANDLERS ---
  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return navigate('/login');
    }
    const userData = JSON.parse(storedUser);

    try {
      const response = await axios.post('http://localhost:8080/add-to-cart', {
        user_id: userData.id,
        product_id: product.id,
        quantity: quantity,
        size: selectedSize,
        price: product.price
      });

      if (response.data.errCode === 0) {
        addToCartSuccess(quantity);
      }
    } catch (error) { 
      console.log(error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser.id) return navigate('/login');
    if (userRating === 0) return alert("Vui lòng chọn số sao!");

    try {
      const response = await axios.post('http://localhost:8080/add-feedback', {
        product_id: id,
        user_id: currentUser.id,
        star: userRating,
        context: comment // Gửi đúng state comment
      });

      if (response.data.errCode === 0) {
        alert("Cảm ơn bạn đã đánh giá!");
        setComment(""); // Reset nội dung
        setUserRating(0); // Reset sao
        fetchProductData(); // Gọi đúng tên hàm fetchProductData để tải lại danh sách
      }
    } catch (error) { 
      console.log(error)
        alert("Lỗi gửi đánh giá!"); 
    }
  };

  // --- 4. RENDER ---
  if (isLoading) return <div style={{ textAlign: "center", padding: "100px" }}>Đang tải...</div>;
  if (!product) return <div style={{ textAlign: "center", padding: "100px" }}>Sản phẩm không tồn tại!</div>;

  const safeRating = Math.max(0, Math.min(5, Math.round(product.rating || 5)));

  return (
    <div className="page-container">
      <div className="product-wrapper">
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={mainImage || product.image} alt={product.name} />
            <div className="overlay-icons">
               <img src={Like} alt="like" className="icon" />
               <img src={fullScreen} alt="fullscreen" className="icon" />
            </div>
          </div>
          <div className="thumbnail-list">
            {product.images.map((imgSrc, index) => (
              <div key={index} className={`thumbnail-item ${mainImage === imgSrc ? "active" : ""}`} onClick={() => setMainImage(imgSrc)}>
                <img src={imgSrc} alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-box">
          <h1 className="product-title">{product.name}</h1>
          <div className="rating-row">
            <span className="stars">{"★".repeat(safeRating)}{"☆".repeat(5 - safeRating)}</span>
            <span className="review-count"> ({reviews.length} đánh giá)</span>
          </div>
          <div className="price">{product.price?.toLocaleString('vi-VN')} ₫</div>
          <p className="description">{product.description}</p>
          <div className="attribute-line"><strong>Chất liệu: </strong><span className="gold-text">{product.material}</span></div>

          <div className="attribute-block">
            <strong>Kích thước:</strong>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button key={size} className={`btn-size ${selectedSize === size ? "selected" : ""}`} onClick={() => setSelectedSize(size)}>{size}</button>
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
            <button className="btn-add-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
            <Link to="/AR" state={{ productData: product }}><button className="btn-ar">Trải nghiệm AR</button></Link>
          </div>
        </div>
      </div>

      <div className="product-detail-section">
        <div className="tab-headers">
          <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>MÔ TẢ CHI TIẾT</button>
          <button className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`} onClick={() => setActiveTab("specifications")}>THÔNG SỐ KỸ THUẬT</button>
          <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>ĐÁNH GIÁ  ({reviews.length}) </button>
        </div>

        <div className="tab-content-container">
          {activeTab === "description" && (
            <div className="tab-pane fade-in"><div className="description-box"><p>{product.descriptionDetail}</p></div></div>
          )}
          
          {activeTab === "specifications" && (
            <div className="tab-pane fade-in">
              <div className="specs-table">
                {product.specifications?.map((item, index) => (
                  <div className="spec-row" key={index}><span className="spec-label">{item.label}</span><span className="spec-value">{item.value}</span></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-pane fade-in">
                <div className="reviews-display-list">
  
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="review-item">
                        <img src={`https://ui-avatars.com/api/?name=${rev.userData?.username}&background=random`} alt="avatar" className="review-avatar" />
                        <div className="review-body">
                          <div className="review-meta">
                            <div className="stars-small">
                              {[...Array(5)].map((_, i) => (i < rev.star ? <FaStar key={i} className="star-active" /> : <FaRegStar key={i} />))}
                            </div>
                            <span className="review-author">{rev.userData?.username}</span>
                            <span className="review-date">
                              {new Date(rev.create_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="review-text">{rev.context}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">Hiện chưa có đánh giá nào.</p>
                  )}
                </div>

              <div className="review-form-container">
                <h3 className="review-heading">Thêm đánh giá của bạn</h3>
                <form className="review-form" onSubmit={handleReviewSubmit}>
                    <div className="rating-input-group" style={{marginBottom: '15px'}}>
                      <span style={{fontSize: '14px'}}>ĐÁNH GIÁ CỦA BẠN *: </span>
                      <div className="stars-picker" style={{display: 'inline-block', marginLeft: '10px', cursor: 'pointer', fontSize: '20px', color: '#ffc400'}}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(s)}>
                            {s <= (hoverRating || userRating) ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" rows="5" placeholder="Nội dung đánh giá của bạn *" required
                          value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <div className="form-group half-width">
                          <input type="text" className="form-control" value={currentUser.username || ""} disabled placeholder="Tên của bạn" />
                        </div>
                        <div className="form-group half-width">
                          <input type="text" className="form-control" value={currentUser.email || ""} disabled placeholder="Email của bạn" />
                        </div>
                    </div>
                    <button type="submit" className="btn-submit-review">GỬI ĐÁNH GIÁ</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <RelatedProducts currentProductId={id} />
    </div>
  );
}

export default ProductDetail;
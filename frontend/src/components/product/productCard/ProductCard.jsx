import React, {useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {useCart} from "../../../util/CartContenxt.jsx"
import "./ProductCard.css";
import QuickViewPopup from "../../QuickViewPopUp/QuickViewPopUp.jsx";

export default function ProductCard({ product }) {
  const [showQuickView, setShowQuickView] =useState(false);
   const { addToCartSuccess } = useCart();

  const formatPrice = (price) => { 
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', '')
      .trim();
  };

  const safeRating = Math.max(0, Math.min(5, Math.round(product?.rating || 5)));
  const shortDescription = product?.description 
    ? product.description.substring(0, 50) + "..." 
    : "Đang cập nhật mô tả...";

  // Hàm xử lý khi bấm vào các nút hover (ngăn không cho chuyển trang)
  const handleActionClick = (e, actionType) => {
    e.preventDefault(); // Ngăn thẻ <Link> chuyển hướng
    if (actionType === 'cart') {
      alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      // Thêm logic dispatch Redux hoặc gọi API giỏ hàng ở đây
    } else if (actionType === 'wishlist') {
      console.log("Thêm vào yêu thích");
    } else if (actionType === 'quickview') {
      setShowQuickView(true);
    }
  };

   const handleAddToFavorite = async (e, productId) =>{
    e.preventDefault();   // Ngăn thẻ <Link> chuyển trang
    e.stopPropagation();  // Ngăn sự kiện nổi bọt lên các thẻ cha
    try {
      // LẤY THÔNG TIN USER TỪ TRÌNH DUYỆT (LOCALSTORAGE)
        const storedUser = localStorage.getItem('currentUser');

        // KIỂM TRA: Nếu chưa đăng nhập thì không cho gọi API
        if (storedUser) {
           
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
      } 
      else {
        // Lấy danh sách cũ ra (nếu chưa có thì tạo mảng rỗng)
            let guestFavorites = JSON.parse(localStorage.getItem('guestFavorites')) || [];

            // Kiểm tra xem ID sản phẩm đã có trong mảng chưa
            if (guestFavorites.includes(productId)) {
                alert(" Sản phẩm này đã có trong danh sách rồi!");
            } else {
                // Thêm ID mới vào mảng và lưu lại
                guestFavorites.push(productId);
                localStorage.setItem('guestFavorites', JSON.stringify(guestFavorites));
                alert(" Đã lưu tạm vào mục Yêu thích (Hãy đăng nhập để lưu vĩnh viễn nhé)!");
            }
      }
      } catch (error) {
        console.error("Lỗi thêm yêu thích:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
};

  const handleQuickAddToCart = async (e) =>{
     e.preventDefault();   // Ngăn thẻ <Link> chuyển trang
    e.stopPropagation();  // Ngăn sự kiện nổi bọt lên các thẻ cha
    try {
       const storedUser = localStorage.getItem('currentUser');

        const userData = JSON.parse(storedUser);
        const userId = userData.id;
        
        const response = await axios.post('http://localhost:8080/add-to-cart', {
        user_id: userId,
        product_id: product.id,
        quantity: 1,
        size: "16", // Size mặc định khi mua nhanh
        price: product.price
      });

      if (response.data.errCode === 0) {
        addToCartSuccess(1);
      }
    } catch(error)
    {console.log( error);
      alert("Không thể thêm vào giỏ!");}
  }
  return ( 
    <>
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        
        {/* KHUNG HÌNH ẢNH SẢN PHẨM */}
        <div className="image-box">
          {product.isNew && <span className="badge new">Mới</span>}
          {product.isFeatured && <span className="badge featured">Nổi bật</span>}
          {product.isSale && <span className="badge sale">Giảm giá</span>}
          
          <img src={product.image} alt={product.name} />

          {/* HIỆU ỨNG HOVER BẮT ĐẦU TỪ ĐÂY */}
          
          {/* Nhóm Icon Góc Trái */}
          <div className="hover-icon-group">
            <button className="hover-icon-btn" onClick={(e) => handleAddToFavorite(e, product.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="hover-tooltip">Yêu thích</span>
            </button>

            <button className="hover-icon-btn" onClick={(e) => handleActionClick(e, 'quickview')}>
              {/* Icon Con Mắt (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {/* Chú thích */}
              <span className="hover-tooltip">Xem nhanh</span>
            </button>
          </div>

          {/* Nút Add To Cart ở đáy */}
          <button 
            className="hover-add-to-cart-btn" 
            onClick={handleQuickAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
          
          {/* HIỆU ỨNG HOVER KẾT THÚC */}
        </div>

        {/* THÔNG TIN SẢN PHẨM */}
        <div className="product-info-wrapper">
          <p className="product-name">{product.name}</p>

          <div className="rating">
            {"★".repeat(safeRating)}
            {"☆".repeat(5 - safeRating)}
          </div>

          <p className="product-desc">{shortDescription}</p>

          <div className="product-price-box">
            <span className="new-price">{formatPrice(product.price)} ₫</span>
            {product.oldPrice && (
              <span className="old-price">{formatPrice(product.oldPrice)} ₫</span>
            )}
          </div>
        </div>
        
      </div>
    </Link>
    {/* Quick View Popup */}
    {showQuickView && (
      <QuickViewPopup 
        product={product} 
        onClose={() => setShowQuickView(false)} 
      />
    )}
    </>
  );
}
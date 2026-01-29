import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', '').trim();
  };

  return (
    <Link to="/ProductDetail" className="product-card-link">
      <div className="product-card">
        <div className="image-box">
          {/* Chỉ giữ lại badge "Mới" theo thiết kế mẫu */}
           {product.isNew && <span className="badge new">Mới</span>}
          {product.isFeatured && <span className="badge featured">Nổi bật</span>}
          {product.isSale && <span className="badge sale">Giảm giá</span>}
          
          <img src={product.image} alt={product.name} />
        </div>

        <p className="product-name">{product.name}</p>

        <div className="rating">
          {"★".repeat(product.rating)}
          {"☆".repeat(5 - product.rating)}
        </div>

        <p className="product-desc">{product.description}</p>

        {/* Phần hiển thị giá mới và giá cũ */}
        <div className="product-price-box">
          <span className="new-price">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="old-price">
              {formatPrice(product.oldPrice)} ₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
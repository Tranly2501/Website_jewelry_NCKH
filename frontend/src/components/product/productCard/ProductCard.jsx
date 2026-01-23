import "./ProductCard.css";
import { Link } from "react-router-dom";
// import ProductDetail from '../../../pages/ProductDetail.jsx';
import Like from '../../../assets/heart.svg'
import Cart from '../../../assets/cart.svg'
export default function ProductCard({ product }) {
  return (
   <Link to ='/ProductDetail'>
      <div className="product-card">
        <div className="image-box">
           <div className="overlay" />
           
          {/* Wishlist */}
          <div className="wishlist">
            <img src={Like} alt="" />
          </div>
          {product.isNew && <span className="badge">Mới</span>}
          {product.isFeatured && <span className="badge">Nổi bật</span>}
          {product.isSale && <span className="badge">Giảm giá</span>}
          <img src={product.image} alt={product.name} />
  
           {/* Add to cart */}
          <div className="add-to-cart">
            <img src={Cart} alt="" />
          </div>
        </div>
  
        <p className="product-name">{product.name}</p>
  
        <div className="rating">
          {"★".repeat(product.rating)}
          {"☆".repeat(5 - product.rating)}
        </div>
  
        <p className="product-desc">{product.description}</p>
  
        <div className="product-price">
          {product.price.toLocaleString()} ₫
        </div>
      </div>
   </Link>
  );
}

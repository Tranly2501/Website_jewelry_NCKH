import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="image-box">
        {product.isNew && <span className="badge">Mới</span>}
        <img src={product.image} alt={product.name} />
      </div>

      <h3 className="product-name">{product.name}</h3>

      <div className="rating">
        {"★".repeat(product.rating)}
        {"☆".repeat(5 - product.rating)}
      </div>

      <p className="product-desc">{product.description}</p>

      <div className="product-price">
        {product.price.toLocaleString()} ₫
      </div>
    </div>
  );
}

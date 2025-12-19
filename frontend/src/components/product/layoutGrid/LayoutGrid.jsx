import "./LayoutGrid.css";
import ProductCard from "../productCard/ProductCard";

export default function LayoutGrid({
  products = [],
  columns = 4,
  limit
}) {
  const displayProducts = limit
    ? products.slice(0, limit)
    : products;

  return (
    <div
      className="layout-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

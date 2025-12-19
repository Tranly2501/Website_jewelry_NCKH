import "./LayoutGrid.css";
import ProductCard from "../productCard/ProductCard";


const LayoutGrid = ({ products, columns = 4, limit }) => {
  return (
    <div
      className="layout-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {products.slice(0, limit).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default LayoutGrid;


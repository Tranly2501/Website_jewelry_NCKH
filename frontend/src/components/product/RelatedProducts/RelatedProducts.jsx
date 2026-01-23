import "../../../index.css"
import './RelatedProducts.css';
import { products } from '../../../data/product.js'; // Import dữ liệu
import ProductCard from '../productCard/ProductCard.jsx';


const RelatedProducts = () => {
  // Lấy 4 sản phẩm đầu tiên
  const relatedList = products.slice(0, 4);

  return (
    <section className="related-products-section">
       <h2 className="section-title">Một số sản phẩm khác</h2>
      {/* Grid Layout */}
      <div className="related-grid">
        {relatedList.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {/* Pagination Dots*/}
      <div className="pagination-dots">
        <span className="dot"></span>
        <span className="dot active"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
};

export default RelatedProducts;
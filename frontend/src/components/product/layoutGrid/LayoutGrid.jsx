import "./LayoutGrid.css";
import ProductCard from "../productCard/ProductCard";

// Thêm products = [] làm giá trị mặc định để lỡ API chưa có data cũng không bị lỗi
const LayoutGrid = ({ products = [], columns = 4, limit }) => {
  
  // Nếu có limit thì cắt mảng, không có thì lấy tất cả (vì Category đã phân trang rồi)
  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <div
      className="layout-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {/* Kiểm tra mảng rỗng thì hiện thông báo */}
      {displayProducts.length === 0 ? (
        <p style={{ gridColumn: `span ${columns}`, textAlign: "center", color: "#888" }}>
          Không tìm thấy sản phẩm nào.
        </p>
      ) : (
        displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

export default LayoutGrid;
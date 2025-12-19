import LayoutGrid from "../../components/product/layoutGrid/LayoutGrid";
import { products } from "../../data/product";
import "./Catalog.css";

const Catalog = () => {
  return (
    <div className="page">
      <LayoutGrid
        products={products}
        columns={4}
        limit={8}
      />
    </div>
  );
};

export default Catalog;

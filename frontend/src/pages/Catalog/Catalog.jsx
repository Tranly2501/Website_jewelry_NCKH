import LayoutGrid from "../../components/product/layoutGrid/LayoutGrid";
import { products } from "../../data/product";
import ringImg from "../../assets/images/ring.png";
import vongTayImg from "../../assets/images/vongTay.png";
import boImg from "../../assets/images/id6.png";
import otherImg from "../../assets/images/id10_4.png";

// import {ringImage} from ;
import "./Catalog.css";


const collections = [
  {
    id: 1,
    name: "Nhẫn",
    image: ringImg,
  },
  {
    id: 2,
    name: "Vòng tay",
    image: vongTayImg,
  },
  {
    id: 3,
    name: "Bộ",
    image: boImg,
  },
  {
    id: 4,
    name: "Khác",
    image: otherImg,
  },
];

const Catalog = () => {
  return (
    <>
    <section className="collection-section">
      <h2 className="collection-title">BỘ SƯU TẬP</h2>

      <div className="collection-list">
        {collections.map((item) => (
          <div key={item.id} className="collection-item"> 
            <div className="collection-image">
              <img src={item.image} alt={item.name} />
            </div>
          </div>
          ))}
      </div>

      <div className = "collection-filter">
        <div className="filter-right">
          <label htmlFor="sort">Sắp xếp theo:</label>
          <select id="sort" name="sort">
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="newest">Mới nhất</option>
          </select>
          
        </div>
      </div>
    </section>

        
      <LayoutGrid
        products={products}
        columns={4}
        limit={8}
      />
    
    </>

  );
};

export default Catalog;

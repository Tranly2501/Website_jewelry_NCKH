import { useState, useRef, useEffect, useMemo } from "react";
import LayoutGrid from "../../components/product/layoutGrid/LayoutGrid";
import Pagination from "../../components/Pagination.jsx";
import Policy from "../../components/Polycy/Policy.jsx";
import Breadcrumb from "../../components/Breadcrumb.jsx";

import filterIcon from "../../assets/filter.svg";
import sortIcon from "../../assets/arrow_down.svg";

import ringImg from "../../assets/images/ring.png";
import vongTayImg from "../../assets/images/vongTay.png";
import boImg from "../../assets/images/id6.png";
import otherImg from "../../assets/images/id10_4.png";

import { products as allProducts } from "../../data/product";
import "./Catalog.css";

/* ================= COLLECTIONS ================= */
const collections = [
  { id: 0, key: "all", name: "Tất cả", image: ringImg },
  { id: 1, key: "ring", name: "Nhẫn", image: ringImg },
  { id: 2, key: "bracelet", name: "Vòng tay", image: vongTayImg },
  { id: 3, key: "set", name: "Bộ", image: boImg },
  { id: 4, key: "other", name: "Khác", image: otherImg },
];

const PAGE_SIZE = 8;

const Catalog = () => {
  /* ================= STATE ================= */
  const [activeCollection, setActiveCollection] = useState("all");
  const [sortValue, setSortValue] = useState("Sắp xếp");
  const [openSort, setOpenSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sortRef = useRef(null);

  /* ================= CLICK OUTSIDE SORT ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FILTER BY COLLECTION ================= */
  const filteredProducts = useMemo(() => {
    if (activeCollection === "all") return allProducts;
    return allProducts.filter(
      (p) => p.category === activeCollection
    );
  }, [activeCollection]);

  /* ================= SORT ================= */
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortValue) {
      case "Mới nhất":
        return list.sort((a, b) => b.id - a.id);
      case "Giá: Thấp → Cao":
        return list.sort((a, b) => a.price - b.price);
      case "Giá: Cao → Thấp":
        return list.sort((a, b) => b.price - a.price);
      case "Từ A → Z":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "Từ Z → A":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "Nổi bật":
        return list.sort(
          (a, b) => (b.isFeatured === true) - (a.isFeatured === true)
        );
      default:
        return list;
    }
  }, [filteredProducts, sortValue]);

  /* ================= PAGINATION ================= */
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalProducts);

  /* ================= HANDLERS ================= */
  const handleSelectSort = (value) => {
    setSortValue(value);
    setCurrentPage(1);
    setOpenSort(false);
  };

  const handleSelectCollection = (key) => {
    setActiveCollection(key);
    setCurrentPage(1);
  };

  /* ================= RENDER ================= */
  return (
    <>
      {/* Thanh điều hướng breadcrumb */}
      <Breadcrumb />
      {/* COLLECTION */}
      <div className="collection-section">
        <h2 className="collection-title">BỘ SƯU TẬP</h2>
        <div className="collection-list">
          {collections.map((item) => (
            <div
              key={item.id}
              className={`collection-item ${
                activeCollection === item.key ? "active" : ""
              }`}
              onClick={() => handleSelectCollection(item.key)}
            >
              <div className="collection-image">
                <img src={item.image} alt={item.name} />
              </div>
              <p className="collection-name">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER */}
      <div className="collection-filter">
        <div className="filter-left">
          <span>
            Hiển thị {start}-{end} trong số {totalProducts} sản phẩm
          </span>
        </div>

        <div className="filter-right">
          <div className="sort" ref={sortRef}>
            <span
              className="sort-label"
              onClick={() => setOpenSort(!openSort)}
            >
              {sortValue}
            </span>
            <img
              src={sortIcon}
              alt=""
              className={`sort-icon ${openSort ? "rotate" : ""}`}
              onClick={() => setOpenSort(!openSort)}
            />

            {openSort && (
              <ul className="sort-dropdown">
                <li onClick={() => handleSelectSort("Mới nhất")}>Mới nhất</li>
                <li onClick={() => handleSelectSort("Giá: Thấp → Cao")}>
                  Giá: Thấp → Cao
                </li>
                <li onClick={() => handleSelectSort("Giá: Cao → Thấp")}>
                  Giá: Cao → Thấp
                </li>
                <li onClick={() => handleSelectSort("Từ A → Z")}>Từ A → Z</li>
                <li onClick={() => handleSelectSort("Từ Z → A")}>Từ Z → A</li>
                <li onClick={() => handleSelectSort("Nổi bật")}>Nổi bật</li>
              </ul>
            )}
          </div>

          <div className="filter">
            <img src={filterIcon} alt="" />
            Lựa chọn
          </div>
        </div>
      </div>

      {/* GRID */}
      <LayoutGrid products={paginatedProducts} columns={4} />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      <Policy />
    </>
  );
};

export default Catalog;

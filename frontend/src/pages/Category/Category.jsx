import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";

import LayoutGrid from "../../components/product/layoutGrid/LayoutGrid";
import Pagination from "../../components/Pagination.jsx";
import FilterSidebar from "../../components/filterSidebar/FilterSidebar.jsx"; // Đảm bảo đường dẫn đúng

import filterIcon from "../../assets/filter.svg";
import sortIcon from "../../assets/arrow_down.svg";

import ringImg from "../../assets/images/ring.png";
import vongTayImg from "../../assets/images/vongTay.png";
import boImg from "../../assets/images/id6.png";
import otherImg from "../../assets/images/id10_4.png";

import { transformProduct } from "../../util/transformProduct.js";

import "./Category.css";

/* ================= COLLECTIONS ================= */
const collections = [
  { id: 0, key: "all", name: "Tất cả", image: ringImg },
  { id: 1, key: "ring", name: "Nhẫn", image: ringImg },
  { id: 2, key: "bracelet", name: "Vòng tay", image: vongTayImg },
  { id: 3, key: "set", name: "Bộ", image: boImg },
  { id: 4, key: "other", name: "Khác", image: otherImg },
];

const PAGE_SIZE = 8;

const Category = () => {
  /* ================= STATE ================= */
  const [allProducts, setAllProducts] = useState([]);
  const [activeCollection, setActiveCollection] = useState("all");
  
  const [sortValue, setSortValue] = useState("Sắp xếp");
  const [openSort, setOpenSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // STATE ĐÓNG/MỞ SIDEBAR LỌC
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortRef = useRef(null);

  /* ================= FETCH API (Tích hợp Lọc) ================= */
  // Hàm này sẽ gọi API lấy tất cả, HOẶC gọi API lọc nếu có filterData
  const fetchProducts = async (filterData = null) => {
    try {
      let url = "http://localhost:8080/get-all-products";
      let params = {};

      // Nếu có dữ liệu từ Popup lọc gửi sang
      if (filterData) {
        url = "http://localhost:8080/products/filter";
        
        // Chuyển mảng thành chuỗi để gửi API (VD: ["Bạc", "Vàng"] -> "Bạc,Vàng")
        if (filterData.materials && filterData.materials.length > 0) {
          params.chatLieu = filterData.materials.join(",");
        }
        if (filterData.genders && filterData.genders.length > 0) {
          params.gioiTinh = filterData.genders.join(",");
        }
        if (filterData.sizes && filterData.sizes.length > 0) {
          params.sizes = filterData.sizes.join(",");
        }
        
        // Luôn gửi khoảng giá
        params.minPrice = filterData.minPrice || 0;
        params.maxPrice = filterData.maxPrice || 25000000;
      }

      const response = await axios.get(url, { params });
      
      // Xử lý dữ liệu trả về (tùy thuộc API trả về .data hay .products)
        const rawData = response.data.data || response.data.products || response.data || [];
        // THÊM DÒNG NÀY ĐỂ DEBUG:
      console.log("Số lượng SP API trả về:", rawData.length);
      const formattedData = rawData.map((item) => transformProduct(item));
      
      setAllProducts(formattedData);
    } catch (err) {
      console.error("Lỗi tải danh mục hoặc lọc sản phẩm:", err);
    }
  };

  // Lần đầu tiên vào trang -> Gọi API lấy tất cả sản phẩm
  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= XỬ LÝ KHI BẤM "ÁP DỤNG" Ở SIDEBAR ================= */
  const handleApplyFilters = (filterData) => {
    // Gọi lại API với thông số lọc
    fetchProducts(filterData);
    // Trở về trang 1
    setCurrentPage(1);
  };

  /* ================= CLICK OUTSIDE SORT ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LỌC THEO BỘ SƯU TẬP (Frontend) ================= */
  const filteredProducts = useMemo(() => {
    if (activeCollection === "all") return allProducts;
    return allProducts.filter((p) => p.categoryId === activeCollection);
  }, [activeCollection, allProducts]);

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
        return list.sort((a, b) => (b.isFeatured === true) - (a.isFeatured === true));
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

  const start = totalProducts === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
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
      {/* 1. GỌI COMPONENT SIDEBAR */}
      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters}
      />

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

      {/* FILTER HEADER */}
      <div className="collection-filter">
        <div className="filter-left">
          <span>
            Hiển thị {start}-{end} trong số {totalProducts} sản phẩm
          </span>
        </div>

        <div className="filter-right">
          {/* SORT */}
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

          {/* BẤM VÀO ĐÂY ĐỂ MỞ SIDEBAR LỌC */}
          <div className="filter" onClick={() => setIsFilterOpen(true)} style={{ cursor: "pointer" }}>
            <img src={filterIcon} alt="Lọc" />
            Lựa chọn
          </div>
        </div>
      </div>

      {/* GRID */}
      {paginatedProducts.length > 0 ? (
         <LayoutGrid products={paginatedProducts} columns={4} />
      ) : (
         <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
           Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
         </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default Category;
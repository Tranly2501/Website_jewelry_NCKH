import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ isOpen, onClose, onApply }) => {
  // Hàm định dạng tiền tệ VNĐ cho giao diện
  const formatPrice = (price) => { 
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Cấu hình giới hạn
  const ABSOLUTE_MIN = 450000;
  const ABSOLUTE_MAX = 25000000;
  const MIN_GAP = 1000000;

  const [minPrice, setMinPrice] = useState(ABSOLUTE_MIN);
  const [maxPrice, setMaxPrice] = useState(ABSOLUTE_MAX);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  const handleMinChange = (e) => {
    const value = Math.round(Number(e.target.value));
    if (value <= maxPrice - MIN_GAP) setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.round(Number(e.target.value));
    if (value >= minPrice + MIN_GAP) setMaxPrice(value);
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFilterSubmit = () => {
    // Đóng gói dữ liệu gửi sang Category.jsx
    onApply({
      minPrice,
      maxPrice,
      materials: selectedMaterials,
      genders: selectedGenders
    });
    onClose(); 
  };

  const leftPercent = ((minPrice - ABSOLUTE_MIN) / (ABSOLUTE_MAX - ABSOLUTE_MIN)) * 100;
  const rightPercent = 100 - ((maxPrice - ABSOLUTE_MIN) / (ABSOLUTE_MAX - ABSOLUTE_MIN)) * 100;

  return (
    <>
      <div className={`elegant-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`elegant-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <button className="close-square-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="sidebar-scrollable">
          <div className="filter-block">
            <h3 className="serif-title">GIÁ</h3>
            <div className="dual-slider-container">
              <div className="slider-track"></div>
              <div className="slider-range" style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}></div>
              <input type="range" min={ABSOLUTE_MIN} max={ABSOLUTE_MAX} value={minPrice} onChange={handleMinChange} className="thumb thumb-left" />
              <input type="range" min={ABSOLUTE_MIN} max={ABSOLUTE_MAX} value={maxPrice} onChange={handleMaxChange} className="thumb thumb-right" />
            </div>
            <p className="price-text">Từ: {formatPrice(minPrice)}đ — {formatPrice(maxPrice)}đ</p>
            <button className="filter-action-btn" onClick={handleFilterSubmit}>LỌC</button>
          </div>

          <div className="divider"></div>

          <div className="filter-block">
            <h3 className="serif-title">CHẤT LIỆU</h3>
            <div className="material-grid">
              {['Vàng', 'Bạc', 'Ngọc'].map(mat => (
                <button key={mat} className={`elegant-chip ${selectedMaterials.includes(mat) ? 'active' : ''}`} onClick={() => toggleSelection(mat, selectedMaterials, setSelectedMaterials)}>
                  {mat}
                </button>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <div className="filter-block">
            <h3 className="serif-title">GIỚI TÍNH</h3>
            <div className="gender-list">
              {['Nam', 'Nữ', 'Unisex'].map(gen => (
                <label key={gen} className="elegant-checkbox">
                  <input type="checkbox" checked={selectedGenders.includes(gen)} onChange={() => toggleSelection(gen, selectedGenders, setSelectedGenders)} />
                  <span className="checkmark"></span> {gen}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
// import React from 'react'
import "../../pages/Home/Home.css";
import '../../index.css';
import ProductSlider from "../../components/product/productSlider/ProductSlider.jsx";
import { products } from "../../data/product";
import { useState } from "react";


const Product = () => {
      const [activeTab, setActiveTab] = useState("new");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onchange(tab); // gửi tab ra ngoài để lọc sp
  };
    return( 
    <>
        <div className = "product-container">
            <h2>Luxury Jewerly</h2>
            <div className="product-tabs">
                <button
        className={`tab ${activeTab === "new" ? "active" : ""}`}
        onClick={() => handleTabClick("new")}
      >
        MỚI RA MẮT
                </button>

                <button
                className={`tab ${activeTab === "featured" ? "active" : ""}`}
                onClick={() => handleTabClick("featured")}
                >
                NỔI BẬT
                 </button>
                                 <button
                className={`tab ${activeTab === "sale" ? "active" : ""}`}
                onClick={() => handleTabClick("sale")}
                >
                GIẢM GIÁ
                 </button>
            </div>
            <div className="product-item"></div>
        </div>
        <ProductSlider products={products} />
    </>
    )
}
export default Product;
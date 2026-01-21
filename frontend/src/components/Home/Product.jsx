// import React from 'react'
import "../../pages/Home/Home.css";
import '../../index.css';
import ProductSlider from "../../components/product/productSlider/ProductSlider.jsx";
import { products } from "../../data/product";
import { useState } from "react";


const Product = () => {
      const [activeTab, setActiveTab] = useState("new");

    const filteredProducts = products.filter((product) => {
        if (activeTab === "new") return product.isNew;
        if (activeTab === "featured") return product.isFeatured;
        if (activeTab === "sale") return product.isSale;
        return true;
    });

    return( 
    <>
        <div className = "product-container">
            <h2>Luxury Jewerly</h2>
            <div className="product-tabs">
                <button
        className={`tab ${activeTab === "new" ? "active" : ""}`}
        onClick={() => setActiveTab("new")}
      >
        MỚI RA MẮT
                </button>

                <button
                className={`tab ${activeTab === "featured" ? "active" : ""}`}
                onClick={() => setActiveTab("featured")}
                >
                NỔI BẬT
                 </button>
                <button
                className={`tab ${activeTab === "sale" ? "active" : ""}`}
                onClick={() => setActiveTab("sale")}
                >
                GIẢM GIÁ
                 </button>
            </div>
        </div>
        <ProductSlider products={filteredProducts} />
    </>
    )
}
export default Product;
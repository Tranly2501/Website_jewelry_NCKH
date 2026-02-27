import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/Home/Home.css";
import '../../index.css';
import ProductSlider from "../../components/product/productSlider/ProductSlider.jsx";
import { transformProduct } from "../../util/transformProduct.js"; // Import hàm transform

const Product = () => {
    const [activeTab, setActiveTab] = useState("new");
    const [allProducts, setAllProducts] = useState([]); // State lưu toàn bộ SP từ API
    const [isLoading, setIsLoading] = useState(true);

    // 1. Gọi API lấy danh sách sản phẩm khi component mount
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setIsLoading(true);
                // URL này khớp với router.get('/get-all-products', ...) ở Backend của bạn
                const response = await axios.get("http://localhost:8080/get-all-products");
                
                if (response.data && response.data.products) {
                    // Vì API trả về mảng, ta dùng .map để transform từng sản phẩm một
                    const transformed = response.data.products.map(item => transformProduct(item));
                    setAllProducts(transformed);
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // 2. Logic lọc sản phẩm theo Tab
    const filteredProducts = allProducts.filter((product) => {
        if (activeTab === "new") return product.isNew;
        if (activeTab === "featured") return product.isFeatured;
        if (activeTab === "sale") return product.isSale;
        return true;
    });

    if (isLoading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải sản phẩm...</div>;

    return (
        <>
            <div className="product-container">
                <h2>Luxury Jewelry</h2>
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

            {/* Nếu không có sản phẩm nào sau khi lọc thì báo trống */}
            {filteredProducts.length > 0 ? (
                <ProductSlider products={filteredProducts} />
            ) : (
                <p style={{textAlign: 'center', color: '#888'}}>Hiện chưa có sản phẩm nào trong mục này.</p>
            )}
        </>
    );
}

export default Product;
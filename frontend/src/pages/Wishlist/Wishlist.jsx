import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './Wishlist.css';
import '../../index.css'
import { transformProduct } from "../../util/transformProduct.js";


const Wishlist = () => {
   
  // 1. TẠO STATE CHỨA DANH SÁCH SẢN PHẨM YÊU THÍCH
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //2. FETCH DATA TỪ BACKEND

  useEffect(()=>{
    const fetchWishlist = async () =>{
      try {
        setIsLoading(true);
        // LẤY THÔNG TIN USER TỪ TRÌNH DUYỆT (LOCALSTORAGE)
        const storedUser = localStorage.getItem('currentUser');

        // KIỂM TRA: Nếu chưa đăng nhập thì không cho gọi API
        if (!storedUser) {
           console.warn("User chưa đăng nhập, không thể lấy danh sách yêu thích!");
           setWishlistItems([]); // Trả về mảng rỗng
           setIsLoading(false);
           return; // Dừng hàm lại tại đây
        }

        //GIẢI MÃ DỮ LIỆU VÀ LẤY ID
        const userData = JSON.parse(storedUser);
        const currentUserId = userData.id; 
        console.log("Đang lấy Wishlist cho User ID:", currentUserId);


        const response = await axios.get(`http://localhost:8080/get-favorites/${currentUserId}`);
          
        //  Trỏ thẳng vào response.data.data
        const rawData = response.data.data || response.data.favorites || [];

        // Chuyển đổi dữ liệu từ API sang định dạng mà UI cần
        const formattedData = rawData.map(item => {
          // Lấy cục dữ liệu sản phẩm (Đề phòng Backend trả về hoa/thường)
          const productData = item.Product || item.product || item.products || item; 
          const prod = transformProduct(productData);

          // Lấy số lượng và ép kiểu về số nguyên
          const currentQuantity = parseInt(prod.quantity || 0, 10);

          return {
            ...prod,
            // Cập nhật trạng thái 
            status: currentQuantity > 0 ? "Còn hàng" : "Hết hàng" 
          };
        });
        
        setWishlistItems(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  },[]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddToCart = (id) => {
    alert(`Đã thêm sản phẩm ID: ${id} vào giỏ hàng!`);
    // Logic thêm vào giỏ hàng thực tế sẽ viết ở đây
  };
  // xoas sản phẩm khỏi wishlist (chỉ là demo, chưa gọi API) 
 const handleRemoveFromWishlist = async (productId) => {

    try {
      // 1. Lấy ID của User đang đăng nhập
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) return;
      
      const userData = JSON.parse(storedUser);
      const userId = userData.id;

      // 2. Gọi API Xóa
      const response = await axios.delete(`http://localhost:8080/remove-favorite/${userId}/${productId}`);

      if (response.data.errCode === 0) {
        // 3. Cập nhật lại State: Lọc bỏ cái sản phẩm vừa bị xóa ra khỏi mảng
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
      }

    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
    }
  };

  return (
    <div className="wishlist-page-wrapper">
      
      {/* TIÊU ĐỀ TRANG */}
      <div className="wishlist-header-section">
        <h1 className="wishlist-page-title">SẢN PHẨM YÊU THÍCH</h1>
      </div>

      {/* HEADER BẢNG */}
      <div className="wishlist-table-header">
        <div className="w-col w-product">SẢN PHẨM</div>
        <div className="w-col w-price">GIÁ</div>
        <div className="w-col w-status">TRẠNG THÁI</div>
        <div className="w-col w-action"></div> {/* Cột nút bấm */}
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="wishlist-items-container">
        {isLoading ? (
          <p className="wishlist-loading">Đang tải danh sách yêu thích...</p>
        ) : wishlistItems.length === 0 ? (
          <p className="wishlist-empty">Chưa có sản phẩm yêu thích nào.</p>
        ) : (
          wishlistItems.map((item) => (
            <div className="wishlist-item-row" key={item.id}>
              
              {/* Cột 1: Ảnh & Tên */}
              <div className="w-col w-product product-detail">
                <div className="wishlist-img-box">
                  <img src={item.image && item.images.length > 0 ? item.images[0] : "https://placehold.co/100"} alt={item.name} />
                </div>
                <h4 className="wishlist-item-name">{item.name}</h4>
              </div>

              {/* Cột 2: Giá */}
              <div className="w-col w-price">
                <span className="wishlist-price-text">{formatCurrency(item.price)}</span>
              </div>

              {/* Cột 3: Trạng thái */}
              <div className="w-col w-status">
                <span className={`wishlist-status-text ${item.status === "Còn hàng" ? "in-stock" : "out-of-stock"}`}>{item.status}</span>
              </div>

              {/* Cột 4: Nút bấm */}
              <div className="w-col w-action">
                <button 
                  className="btn-add-cart-wishlist"
                  onClick={() => handleAddToCart(item.id)}
                  disabled={item.status === 'Hết hàng'} // Khóa nút nếu hết hàng
                  style={{ opacity: item.status === 'Hết hàng' ? 0.5 : 1, cursor: item.status === 'Hết hàng' ? 'not-allowed' : 'pointer' }}
                >
                  Thêm vào giỏ hàng
                </button>
                <button 
                  className="btn-remove-wishlist" 
                  onClick={() => {
                    handleRemoveFromWishlist(item.id);
                    
                  }}

                
                  style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px' }}
                  title="Xóa khỏi yêu thích"
                >
                  ✕
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Wishlist
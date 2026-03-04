import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useCart} from '../../util/CartContenxt.jsx'
import './Wishlist.css';
import '../../index.css'
import { transformProduct } from "../../util/transformProduct.js";


const Wishlist = () => {
    const navigate = useNavigate();
   
  // 1. TẠO STATE CHỨA DANH SÁCH SẢN PHẨM YÊU THÍCH
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const { addToCartSuccess } = useCart();

  //2. FETCH DATA TỪ BACKEND

// LẤY DANH SÁCH YÊU THÍCH KHI MỞ TRANG
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('currentUser');

        // ==========================================
        // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP (Lấy từ Database)
        // ==========================================
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const userId = userData.id;

          const response = await axios.get(`http://localhost:8080/get-favorites/${userId}`);
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
        } 
        
        // ==========================================
        // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (Lấy từ LocalStorage)
        // ==========================================
        else {
          // 1. Lấy mảng ID từ localStorage (ví dụ: [1, 5, 12])
          const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites')) || [];

          // Nếu mảng rỗng thì dừng luôn, không cần gọi API
          if (guestFavorites.length === 0) {
            setWishlistItems([]);
            setIsLoading(false);
            return;
          }

          // 2. Dùng Promise.all để gọi API lấy chi tiết cho TỪNG sản phẩm cùng một lúc
          // (Tận dụng API lấy chi tiết sản phẩm bạn đã viết ở ProductDetail)
          const productPromises = guestFavorites.map(productId => 
             axios.get(`http://localhost:8080/get-product/${productId}`)
          );

          // Đợi tất cả API chạy xong
          const responses = await Promise.all(productPromises);

          // 3. Format dữ liệu và đưa vào State
          const formattedData = responses.map(res => {
             const actualData = res.data.product || res.data.data || res.data;
             return transformProduct(actualData);
          });

          setWishlistItems(formattedData);
        }

      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

const handleAddToCart = async (item) => { // Đổi tên tham số cho rõ ràng
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        alert("Vui lòng đăng nhập để mua hàng!");
        return navigate('/login');
    }
    const userData = JSON.parse(storedUser);

    try {
        const response = await axios.post('http://localhost:8080/add-to-cart', {
            user_id: userData.id,
            product_id: item.id,      
            quantity: 1,             
            size: item.size || '16 ', 
            price: item.price         
        });

        if (response.data.errCode === 0) {
            addToCartSuccess(1);
            alert("Đã thêm sản phẩm vào giỏ hàng!"); 
        }
    } catch (error) { 
        console.error("Lỗi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
};
const handleRemoveFromWishlist = async (productId) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi mục yêu thích?");
    if (!isConfirm) return;

    try {
      const storedUser = localStorage.getItem('currentUser');

      // ==========================================
      // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP (Xóa dưới Database)
      // ==========================================
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userId = userData.id;

        const response = await axios.delete(`http://localhost:8080/remove-favorite/${userId}/${productId}`);

        if (response.data.errCode === 0) {
          setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
         
        }
      } 
      
      // ==========================================
      // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (Xóa trong LocalStorage)
      // ==========================================
      else {
        // 1. Lấy mảng ID cũ ra
        let guestFavorites = JSON.parse(localStorage.getItem('guestFavorites')) || [];
        
        // 2. Lọc bỏ cái ID vừa bị xóa đi
        guestFavorites = guestFavorites.filter(id => id !== productId);
        
        // 3. Lưu mảng mới ngược lại vào localStorage
        localStorage.setItem('guestFavorites', JSON.stringify(guestFavorites));
        
        // 4. Cập nhật giao diện (ẩn thẻ sản phẩm đó đi)
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
                    onClick={() => handleAddToCart(item)} 
                    disabled={item.status === 'Hết hàng'}
                    style={{ 
                        opacity: item.status === 'Hết hàng' ? 0.5 : 1, 
                        cursor: item.status === 'Hết hàng' ? 'not-allowed' : 'pointer' 
                    }}
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
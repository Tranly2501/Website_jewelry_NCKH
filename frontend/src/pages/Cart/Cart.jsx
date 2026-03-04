import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5"; // Thay icon thùng rác bằng icon X
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { transformProduct } from '../../util/transformProduct.js'; 
import './Cart.css';
import '../../index.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= 1. FETCH GIỎ HÀNG ================= */
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      
      const userData = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:8080/get-cart/${userData.id}`);
      
      if (response.data.errCode === 0 && response.data.data) {
        const rawDetails = response.data.data.cartItemData || [];
        
        const formattedData = rawDetails.map(detail => {
          if (!detail.product) return null;
          const productInfo = { ...detail.product };
          
          if (typeof productInfo.image_url === 'object') {
            productInfo.image_url = productInfo.image_url.id1;
          }

          const product = transformProduct(productInfo);
          
          return {
            ...product,
            cartDetailId: detail.id,
            quantity: detail.quantity,
            size: detail.size,
            price: detail.price
          };
        }).filter(item => item !== null);

        setCartItems(formattedData);
      }
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  /* ================= 2. CẬP NHẬT & XÓA (API) ================= */
  const handleQuantityChange = async (cartDetailId, currentQty, type) => {
    let newQty = type === 'inc' ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) {
      handleRemoveItem(cartDetailId);
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/update-cart`, {
        cart_item_id: cartDetailId,
        product_quantity: newQty
      });
      if (response.data.errCode === 0) {
        setCartItems(prev => prev.map(item => 
          item.cartDetailId === cartDetailId ? { ...item, quantity: newQty } : item
        ));
      }
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const handleRemoveItem = async (cartDetailId) => {
    if (window.confirm("Bạn có muốn bỏ sản phẩm này khỏi đơn hàng?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/delete-cart-item/${cartDetailId}`);
        if (response.data.errCode === 0) {
          setCartItems(prev => prev.filter(item => item.cartDetailId !== cartDetailId));
        }
      } catch (err) {
        console.error("Lỗi xóa sản phẩm:", err);
      }
    }
  };

  /* ================= XỬ LÝ ĐỔI SIZE (API) ================= */
  const handleSizeChange = async (cartDetailId, newSize) => {
    try {
      // Gọi API update (Gửi kèm cart_item_id và size mới)
      const response = await axios.put(`http://localhost:8080/update-cart`, {
        cart_item_id: cartDetailId,
        size: newSize
      });

      if (response.data.errCode === 0) {
        // Cập nhật State local để giao diện thay đổi ngay lập tức
        setCartItems(prev => prev.map(item => 
          item.cartDetailId === cartDetailId ? { ...item, size: newSize } : item
        ));
      }
    } catch (err) {
      console.error("Lỗi cập nhật size:", err);
      alert("Không thể đổi size lúc này!");
    }
  };
  /* ================= 3. TÍNH TOÁN (TẤT CẢ SẢN PHẨM) ================= */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tính tiền trực tiếp trên toàn bộ cartItems
  const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxAmount = subTotal * 0.10; 
  const grandTotal = subTotal + taxAmount;
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate('/checkout', { 
      state: { items: cartItems, total: grandTotal } 
    });
  };

  if (loading) return <div className="loading-state">Đang tải giỏ hàng...</div>;

  return (
    <div className='cart-page-wrapper'>
      {/* THANH TIẾN TRÌNH */}
      <div className='cart-progress-container'>
        <div className='cart-step active'><div className='step-circle'>1</div><span>Giỏ hàng</span></div>
        <div className='cart-progress-line'></div>
        <div className='cart-step'><div className='step-circle'>2</div><span>Thanh toán</span></div>
        <div className='cart-progress-line'></div>
        <div className='cart-step'><div className='step-circle'>3</div><span>Xác nhận</span></div>
      </div>

      {/* HEADER BẢNG - BỎ CHECKBOX */}
      <div className='cart-header-row'>
        <div className='header-col product-col'>Sản phẩm</div>
        <div className='header-col quantity-col'>Số lượng</div>
        <div className='header-col total-col'>Tổng tiền</div>
        <div className='header-col action-col'></div>
      </div>
      
      {/* DANH SÁCH SẢN PHẨM */}
      <div className='cart-items-list'>
        {cartItems.length === 0 ? (
          <p className="empty-msg">Giỏ hàng của bạn đang trống.</p>
        ) : (
          cartItems.map((item) => (
            <div className='cart-item-row' key={item.cartDetailId}>
              <div className='cart-product-info'>
                <div className='cart-img-box'>
                  <img src={item.images && item.images.length > 0 ? item.images[0] : "https://placehold.co/100"} alt={item.name} />
                </div>
                <div className='cart-info-text'>
                  <h4 className='cart-item-name'>{item.name}</h4>
                  <p className='cart-item-price-unit'>Giá: {formatCurrency(item.price)}</p>
                    <div className="cart-item-size-selector">
                      <label htmlFor={`size-${item.cartDetailId}`}>Size: </label>
                      <select 
                        id={`size-${item.cartDetailId}`}
                        className="size-select-btn"
                        value={item.size} 
                        onChange={(e) => handleSizeChange(item.cartDetailId, e.target.value)}
                      >
                        {/* Nếu product có mảng sizes từ transformProduct thì dùng, không thì dùng mặc định */}
                        {(item.sizes && item.sizes.length > 0 ? item.sizes : ["16 ", "17 ", "18 ", "19 "]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                </div>
              </div>

              <div className='cart-quantity-section'>
                <div className='cart-qty-control'>
                  <button onClick={() => handleQuantityChange(item.cartDetailId, item.quantity, 'dec')}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => handleQuantityChange(item.cartDetailId, item.quantity, 'inc')}>+</button>
                </div>
              </div>

              <div className='cart-total-price'>
                {formatCurrency(item.price * item.quantity)}
              </div>

              <div className='cart-action-remove'>
                {/* THAY ICON THÀNH HÌNH CHỮ X */}
                <button className='btn-remove-x' onClick={() => handleRemoveItem(item.cartDetailId)}>
                  <IoClose />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER GIỎ HÀNG - BỎ CHECKBOX TẤT CẢ */}
      <div className='cart-update-row'>
        <div className='update-btn-box'>
           <button className='btn-update-cart' onClick={() => navigate('/Category')}>Tiếp tục mua sắm</button>
        </div>
      </div>
      
      <div className='cart-summary-wrapper'>
         <div className='cart-summary-title'> <p>TỔNG ĐƠN HÀNG ({cartItems.length} sản phẩm ) </p></div>
         <div className='cart-summary-box'>
            <div className='summary-col'>
                <p>Tổng số lượng: <strong>{totalQuantity}</strong></p>
                <p>Tổng tiền hàng: <span className='price-highlight'>{formatCurrency(subTotal)}</span></p>
            </div>
            <div className='summary-col'>
                <p>Thuế (10%): {formatCurrency(taxAmount)}</p>
                <p>Thành tiền: <span className='price-highlight final'>{formatCurrency(grandTotal)}</span></p>
            </div>
            <div className='summary-col action'>
                <button className='btn-checkout' onClick={handleGoToCheckout}>Tiến hành thanh toán</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Cart;
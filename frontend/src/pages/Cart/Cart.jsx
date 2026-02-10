import React, { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import './Cart.css';
import '../../index.css'
import { products } from '../../data/product.js'; 
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // lấy 2 sp đầu tiền để đề mo
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(
    products.slice(0, 2).map(item => ({
      ...item, 
      quantity: 1, 
      size: item.size || "16 cm" 
    }))
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleQuantityChange = (id, type) => {
    if (type === 'dec') {
      const item = cartItems.find((i) => i.id === id);
      if (item.quantity === 1) {
        handleRemoveItem(id);
        return; 
      }
    }

    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        if (type === 'dec') return { ...item, quantity: item.quantity - 1 };
        if (type === 'inc') return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(newCart);
  };

const handleRemoveItem = (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    if (isConfirmed) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };


  // Tổng tạm tính (Subtotal)
  const subTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Thuế 8%
  const taxAmount = subTotal * 0.08;
  // Tổng thành tiền (Total)
  const grandTotal = subTotal + taxAmount;
  // Tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleGoToCheckout = () => {
    // 3. Hàm chuyển trang
    if (cartItems.length === 0) {
      alert("Giỏ hàng của người khác đang trống!");
      return;
    }
    // CHUYỂN TRANG KÈM DỮ LIỆU (STATE)
    navigate('/checkout', { 
      state: { 
        items: cartItems, 
        total: grandTotal
      } 
    });
  };
  const updateCart = () =>{
    navigate('/Category');
  }

  return (
    <div className='cart-page-wrapper'>
        {/* THANH TIẾN TRÌNH */}
      <div className='cart-progress-container'>
        <div className='cart-step active'>
          <div className='step-circle'>1</div>
          <span>Giỏ hàng</span>
        </div>
        <div className='cart-progress-line'></div>
        <div className='cart-step'>
          <div className='step-circle'>2</div>
          <span>Thanh toán</span>
        </div>
        <div className='cart-progress-line'></div>
        <div className='cart-step'>
          <div className='step-circle'>3</div>
          <span>Xác nhận</span>
        </div>
      </div>

      {/* HEADER BẢNG */}
      <div className='cart-header-row'>
        <div className='header-col product-col'>Sản phẩm</div>
        <div className='header-col quantity-col'>Số lượng</div>
        <div className='header-col total-col'>Tổng tiền</div>
        <div className='header-col action-col'></div>
      </div>
      
      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <div className='cart-items-list'>
        {cartItems.length === 0 ? (
          <p style={{textAlign: 'center', padding: '20px'}}>Giỏ hàng trống.</p>
        ) : (
          cartItems.map((item) => (
            <div className='cart-item-row' key={item.id}>
              <div className='cart-product-info'>
                <input type="checkbox" className='cart-checkbox' />
                <div className='cart-img-box'>
                   {/* Dùng ảnh từ data, nếu lỗi thì hiện ảnh placeholder */}
                  <img src={item.images ? item.images[0] : "https://placehold.co/100"} alt={item.name} /> 
                </div>
                <div className='cart-info-text'>
                  <h4 className='cart-item-name'>{item.name}</h4>
                  <p className='cart-item-price-unit'>Giá: {formatCurrency(item.price)}</p>
                  <span className='cart-item-size'>Size: {item.size}</span>
                </div>
              </div>

              <div className='cart-quantity-section'>
                <div className='cart-qty-control'>
                  <button onClick={() => handleQuantityChange(item.id, 'dec')}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => handleQuantityChange(item.id, 'inc')}>+</button>
                </div>
              </div>

              <div className='cart-total-price'>
                {formatCurrency(item.price * item.quantity)}
              </div>

              <div className='cart-action-remove'>
                <button className='btn-trash' onClick={() => handleRemoveItem(item.id)}><FaTrashAlt /></button>
              </div>
            </div>
          ))
        )}
      </div>

        {/*  CẬP NHẬT GIỎ HÀNG */}
      <div className='cart-update-row'>
        <div className='select-all-box'>
           <input type="checkbox" className='cart-checkbox' id="check-all"/>
           <label htmlFor="check-all">Tất cả sản phẩm</label>
        </div>
        <div className='update-btn-box'>
           <button className='btn-update-cart' onClick={updateCart}>Cập nhật giỏ hàng</button>
        </div>
      </div>
      
      <div className='cart-summary-wrapper'>
         {/* Copy lại phần tính tổng tiền từ code cũ vào đây */}
         <div className='cart-summary-title'>TẠM TÍNH ĐƠN HÀNG</div>
         <div className='cart-summary-box'>
            <div className='summary-col'>
                <p>Số lượng: <strong>{totalQuantity}</strong></p>
                <p>Tổng tiền: <span className='price-highlight'>{formatCurrency(subTotal)}</span></p>
            </div>
            <div className='summary-col'>
                <p>Thuế (8%): {formatCurrency(taxAmount)}</p>
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
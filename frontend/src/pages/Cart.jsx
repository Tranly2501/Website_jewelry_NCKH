import React from 'react';
import './Cart.css';

const Cart = () => {
  return (
    <div className='container'>
      <div className='content-top'>
        <p>Trang chủ </p>
        <p>&gt;</p>
        <p>Giỏ hàng</p>
      </div>
      <div className='content-mid'>
        <div className='product'>
          <p className='title-header'>Sản phẩm</p> 
          <div className='detail-product'>
            <input type="checkbox" className='my-checkbox' /> 
            <img src="/vang.jpg" alt="nhẫn" />
            <div className='info'>
              <h4>Nhẫn kim cương xanh</h4>
              <p>Giá: 2.800.000đ</p>
              <span className='size-tag'>Size: 16cm</span>
             </div>
          </div>
        </div>
        <div className='number'>
          <p className='title-header'>Số lượng</p>
          <div className='quantity-controls'>
              <button className='btn-minus'>-</button>
              <span className='quantity-value'>1</span>
              <button className='btn-plus'>+</button>
          </div>
        </div>
        <div className='total'>
          <p className='title-header'>Tổng tiền</p>
          <h3>2.800.000đ</h3>
        </div>
        <div className='clear'>
          <button className='btn-delete'>🗑</button>
        </div>
      </div>

      <hr className='separator' />

      <div className='total-product'>
        <input type="checkbox" className='my-checkbox' />
        <p>Tất cả sản phẩm</p>
        <button>Cập nhật giỏ hàng</button>
      </div>

      <div className='content-bottom'>
        <div className='bottom-row1'>
          <p>Số lượng sản phầm: 4</p>
          <p>Tổng tiền: <span className='color-money'>11.200.000đ</span></p>
        </div>
        <div className='bottom-row2'>
          <p>Thuế (8%): 896.000đ</p>
          <p>Thành tiền: <span className='color-money'>12.096.000đ</span></p>
        </div>
        <div className='bottom-row3'>
          <button>Tiến hành thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
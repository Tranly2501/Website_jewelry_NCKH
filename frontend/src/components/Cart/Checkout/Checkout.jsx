import React from "react";
import "./Checkout.css";
import { useNavigate } from 'react-router-dom';
import  { useState } from "react";

const Checkout = () => {
  const [showCoupon, setShowCoupon] = useState(false);
  const navigate = useNavigate();

  const handleConfirmOrder = () => {
    // Người khác có thể xử lý lưu đơn hàng ở đây
    console.log("Đang chuyển sang trang xác nhận...");
    navigate('/confirm'); // Nhảy sang trang Confirm
  };
  return (
    <div className="checkout-container">
      {/* THANH TIẾN TRÌNH - Bước 2 active */}
      <div className='cart-progress-container'>
        <div className='cart-step active'>
          <div className='step-circle'>1</div>
          <span>Giỏ hàng</span>
        </div>
        <div className='cart-progress-line active'></div>
        <div className='cart-step active'>
          <div className='step-circle'>2</div>
          <span>Thanh toán</span>
        </div>
        <div className='cart-progress-line'></div>
        <div className='cart-step'>
          <div className='step-circle'>3</div>
          <span>Xác nhận</span>
        </div>
      </div>

      <div className="checkout-content">
        {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
        <div className="checkout-form-section">
          <h3>Thanh toán và giao hàng</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Tên <span className="required-star">*</span></label>
              <input type="text" placeholder="" />
            </div>
            <div className="form-group">
              <label>Họ <span className="required-star">*</span></label>
              <input type="text" placeholder="" />
            </div>
          </div>
          
          <div className="form-row">
              <div className="form-group">
              <label>Số điện thoại <span className="required-star">*</span></label>
              <input type="text" placeholder="Số điện thoại nhận hàng" />
            </div>

              <div className="form-group">
              <label>Địa chỉ email <span className="required-star">*</span></label>
              <input type="email" placeholder="Email của bạn" />
            </div>
          </div>
          {/* thêm */}

          <div className="form-group">
            <label>Quốc gia/ Khu vực <span className="required-star">*</span></label>
            <p>Việt Nam</p>
          </div>


          <div className="form-group">
            <label>Tỉnh/ Thành phố <span className="required-star">*</span></label>
            <select><option>Chọn Tỉnh/ Thành phố</option></select>
          </div>

          {/* thêm */}

          <div className="form-group">
            <label>Quận/ Huyện <span className="required-star">*</span></label>
            <select><option>Chọn quận/ huyện</option></select>
          </div>

          <div className="form-group">
            <label>Xã/ Phường <span className="required-star">*</span></label>
            <select><option>Chọn xã/ phường</option></select>
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết <span className="required-star">*</span></label>
            <select><option>Số nhà, tên đường/Xóm...</option></select>
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="insurance" />
            <label htmlFor="insurance">Bảo hiểm vận chuyển</label>
          </div>

          <div className="form-group">
            <h4>Thông tin bổ sung</h4>
            <label>Ghi chú đơn hàng (tùy chọn)</label>
            <textarea placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng..."></textarea>
          </div>
          {/* thêm */}
          <div className="coupon-section">
        <p className="coupon-toggle">
          Bạn có mã ưu đãi?{" "}
          <span 
            className="toggle-link" 
            onClick={() => setShowCoupon(!showCoupon)} // Đảo ngược trạng thái khi bấm
          >
            Ấn vào đây để nhập mã
          </span>
        </p>

        {/* Chỉ hiển thị khối này nếu showCoupon là true */}
        {showCoupon && (
          <div className="coupon-input-container">
            <p>Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới.</p>
            <div className="input-group">
              <input type="text" placeholder="Mã ưu đãi" />
              <button className="btn-apply">Áp dụng</button>
            </div>
          </div>
        )}
      </div>
          
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="checkout-summary-section">
          <h3>Đơn hàng của bạn</h3>
          <div className="order-items">
            <div className="order-item">
              <div className="item-info">
                <img src="https://placehold.co/50" alt="product" />
                <span>Nhẫn kim cương xanh x 1</span>
              </div>
              <span className="item-price">2.800.000 đ</span>
            </div>
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Tạm tính</span>
              <span>2.800.000 đ</span>
            </div>
            <div className="total-row">
              <span>Giao hàng</span>
              <span>Miễn phí</span>
            </div>
            <div className="total-row grand-total">
              <span>Tổng cộng</span>
              <span className="total-price">2.800.000 đ</span>
            </div>
          </div>

          <button className="btn-submit-order" onClick={handleConfirmOrder}>Tiến hành thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
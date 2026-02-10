import React, { useState } from "react";
import "./Checkout.css";
import { useNavigate ,useLocation} from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

     // 1. NHẬN DỮ LIỆU TỪ GIỎ HÀNG (Nếu không có thì dùng mảng rỗng để tránh lỗi)
  const cartState = location.state || { items: [], total: 0 };
  const { items, total } = cartState;

  // 2. TẠO STATE ĐỂ LƯU THÔNG TIN KHÁCH HÀNG NHẬP VÀO
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Việt Nam",
    address: "",
    phone: "",
    email: ""
  });

  const [showCoupon, setShowCoupon] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('flat'); // 'flat' hoặc 'free'
  const [paymentMethod, setPaymentMethod] = useState('bank');   // 'bank' hoặc 'e -wallet

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Cập nhật trường tương ứng
    });
  };

  const handleConfirmOrder = () => {
    if (!formData.phone || !formData.address || !formData.firstName) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    // Đóng gói toàn bộ dữ liệu để gửi sang Confirm
    const orderData = {
      // Thông tin khách hàng
      ...formData, 
      fullName: `${formData.lastName} ${formData.firstName}`,
      
      // Thông tin đơn hàng
      items: items,
      subtotal: total,

      shippingMethod,
      shippingFee: shippingMethod === 'flat' ? 30000 : 0,
      paymentMethod,
    };

    // Chuyển sang trang Confirm kèm dữ liệu
    navigate('/confirm', { state: orderData });
  };

  return (
    <div className="checkout-container">
      {/* --- THANH TIẾN TRÌNH --- */}
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
        {/* --- CỘT TRÁI: FORM NHẬP LIỆU (Giữ nguyên logic của bạn) --- */}
        <div className="checkout-form-section">
          <h3 className="section-title">Chi tiết thanh toán</h3>
          
          {/* Form nhập liệu giữ nguyên như cũ */}
          <div className="form-row">
            <div className="form-group">
              <label>Tên <span className="required-star">*</span></label>
              <input 
              type="text"  name="firstName"  value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Họ <span className="required-star">*</span></label>
              <input
               type="text" name="lastName" 
               value={formData.lastName} onChange={handleInputChange} />
            </div>
          </div>
          
          <div className="form-group">
             <label>Quốc gia/ Khu vực <span className="required-star">*</span></label>
             <p>Việt Nam</p>
          </div>
          <div className="form-group">
             <label>Địa chỉ chi tiết <span className="required-star">*</span></label>
             <input type="text" name="address" 
                   value={formData.address} onChange={handleInputChange} 
                   placeholder="Số nhà, tên đường..." />
          </div>
          <div className="form-group">
             <label>Số điện thoại <span className="required-star">*</span></label>
             <input type="text" name="phone" 
                   value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
             <label>Email <span className="required-star">*</span></label>
             <input type="email" name="email" 
                   value={formData.email} onChange={handleInputChange} />
          </div>

           {/* Phần Coupon (Mã giảm giá) */}
           <div className="coupon-section">
            <p className="coupon-toggle">
              Bạn có mã ưu đãi?{" "}
              <span className="toggle-link" onClick={() => setShowCoupon(!showCoupon)}>
                Ấn vào đây để nhập mã
              </span>
            </p>
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

        {/* --- CỘT PHẢI: ORDER SUMMARY (Làm giống ảnh mẫu) --- */}
        <div className="checkout-summary-wrapper">
           <div className="summary-box">
              
              {/* 1. Danh sách sản phẩm */}
              <h3 className="summary-heading">Đơn Hàng Của Bạn</h3>
              <div className="summary-row header-row">
                 <span className="product-name">Sản phẩm</span>
                 <span className="product-total">Tạm tính</span>
              </div>
               
               {/* 2. Tổng phụ */}
               <div className="summary-row item-row">
                   <span>Tổng phụ</span>
                   <span>{total.toLocaleString()} ₫</span>
                </div>



              {/* 3. Vận chuyển */}
              <div className="shipping-section">
                 <h4 className="section-sub-heading">Vận Chuyển</h4>
                 <div className="radio-group">
                    <label className="radio-label">
                       <input 
                          type="radio" 
                          name="shipping" 
                          checked={shippingMethod === 'flat'}
                          onChange={() => setShippingMethod('flat')}
                       />
                       <span>Giá cố định: 30.000 ₫</span>
                    </label>
                    <label className="radio-label">
                       <input 
                          type="radio" 
                          name="shipping" 
                          checked={shippingMethod === 'free'}
                          onChange={() => setShippingMethod('free')}
                       />
                       <span>Miễn phí vận chuyển</span>
                    </label>
                 </div>
              </div>

              {/* 4. Tổng cộng */}
              <div className="summary-row total-row">
                 <span className="label">Tổng cộng</span>
                 <span className="total-price">
                    {shippingMethod === 'flat' ? '480.000 ₫' : '450.000 ₫'}
                 </span>
              </div>

              {/* 5. Phương thức thanh toán */}
              <div className="payment-section">
                 <h4 className="section-sub-heading">Phương Thức Thanh Toán</h4>
                 
                 <div className="payment-options">
                    
                    {/* 1. Ngân hàng */}
                    <label className={`radio-label payment-card ${paymentMethod === 'bank' ? 'active' : ''}`}>
                       <input 
                          type="radio" name="payment" 
                          checked={paymentMethod === 'bank'}
                          onChange={() => setPaymentMethod('bank')}
                       />
                       <span>Chuyển khoản Ngân hàng</span>
                    </label>

                    {/* 2. Ví điện tử */}
                    <label className={`radio-label payment-card ${paymentMethod === 'e-wallet' ? 'active' : ''}`}>
                       <input 
                          type="radio" name="payment" 
                          checked={paymentMethod === 'e-wallet'}
                          onChange={() => setPaymentMethod('e-wallet')}
                       />
                       <span>Ví điện tử: momo, zalo pay</span>
                    </label>


                 </div>
                 
              </div>

              {/* 6. Chính sách & Điều khoản */}
              <div className="policy-text">
                 Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn trên trang web và cho các mục đích khác được mô tả trong <a href="#">chính sách bảo mật</a> của chúng tôi.
              </div>

              <div className="terms-checkbox">
                 <input type="checkbox" id="terms" />
                 <label htmlFor="terms">Tôi đã đọc và đồng ý với <a href="#">các điều khoản và điều kiện</a> của trang web *</label>
              </div>

              {/* 7. Nút Đặt hàng */}
              <button className="btn-place-order" onClick={handleConfirmOrder}>
                 ĐẶT HÀNG
              </button>

           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
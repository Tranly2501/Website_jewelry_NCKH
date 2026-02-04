import React from 'react';
import './confirm.css';
import qrImage from '../../../assets/qr-code.png'; // Chú ý đường dẫn tương ứng với file Confirm.jsx

// Sử dụng trong thẻ img
<img src={qrImage} alt="Mã QR thanh toán" className="qr-image" />
const Confirm = () => {
    return (
        <div className="confirm-container">
            {/* THANH TIẾN TRÌNH - Cả 3 bước đều active */}
            <div className='cart-progress-container'>
                <div className='cart-step active'><div className='step-circle'>1</div><span>Giỏ hàng</span></div>
                <div className='cart-progress-line active'></div>
                <div className='cart-step active'><div className='step-circle'>2</div><span>Thanh toán</span></div>
                <div className='cart-progress-line active'></div>
                <div className='cart-step active'><div className='step-circle'>3</div><span>Xác nhận</span></div>
            </div>

            <div className="success-message">
                <span className="check-icon"></span>
                <p>Cảm ơn bạn! Đơn hàng của bạn đã được nhận và thanh toán thành công</p>
            </div>

            <div className="confirm-main-content">
                <div className="order-details-card">
                    <h3>Chi tiết đơn hàng</h3>
                    <h4>Thông tin cá nhân</h4>
                    <div className="info-section">
                        
                        <p>Họ và tên: </p>
                        <p>Số điện thoại:</p>
                        <p>Email:</p>
                        <p>Địa chỉ giao hàng:</p>
                    </div>

                    <div className="products-summary">
                        <div className="summary-header">
                            <span>Sản phẩm</span>
                            <span>Tổng</span>
                        </div>
                        <div className="summary-row">
                            <span>Nhẫn kim cương xanh x 1</span>
                            <span>2.800.000 đ</span>
                        </div>
                        <div className="summary-row line">
                            <span>Tổng số phụ:</span>
                            <span>2.800.000 đ</span>
                        </div>
                        <div className="summary-row">
                            <span>Giao nhận hàng:</span>
                            <span>60.000 đ <small>(Giao hàng hỏa tốc trong 3-5 giờ)</small></span>
                        </div>
                        <div className="summary-row">
                            <span>Bảo hiểm vận chuyển:</span>
                            <span>25.000 đ</span>
                        </div>
                        <div className="summary-row">
                            <span>Giảm giá:</span>
                            <span>0 đ</span>
                        </div>
                        <div className="summary-row">
                            <span>Phương thức thanh toán:</span>
                            <span>Chuyển khoản ngân hàng trước 100%</span>
                        </div>
                        <div className="summary-row">
                            <span>Tổng cộng:</span>
                            <span>2.885.000 đ</span>
                        </div>
                        <div className="summary-row">
                            <span><strong>Lưu ý!</strong></span>
                            <span><strong>Phương thức vận chuyển: Giao hàng hỏa tốc trong 3-5 giờ</strong></span>
                        </div>
                    </div>

                    
                </div>

                <div className="payment-qr-section">
                    <div className="qr-box">
                        <h4>Mã QR chuyển khoản ngân hàng</h4>
                        <img src={qrImage} alt="VietQR" className="qr-image" />
                        <div className="status-badge">Trạng thái giao dịch: Chưa thanh toán</div>
                    </div>
                    
                    <div className="bank-info-box">
                        <h4>Thông tin chuyển khoản ngân hàng</h4>
                        <p>Tên tài khoản:</p>
                        <p>Số tài khoản:</p>
                        <p>Ngân hàng:</p>
                        <p>Số tiền: </p>
                        <p>Mã đơn hàng: </p>
                        <p>Nội dung:</p>
                        <p className="warning-text">Vui lòng nhập đúng nội dung để xác nhận đơn hàng!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
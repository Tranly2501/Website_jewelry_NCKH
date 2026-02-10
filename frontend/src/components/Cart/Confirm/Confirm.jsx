import React, { useState,  useEffect } from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
import './confirm.css';
import qrImage from '../../../assets/qr-code.png'; 
// Link ảnh QR Demo (Bạn thay ảnh thật vào nhé)
const momoQR = "https://developers.momo.vn/v3/assets/images/MOMO-Logo-App-6262c3743a290ef02396a24ea2b66c35.png"; 
const zaloQR = "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"; 

const Confirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // State quản lý trạng thái thanh toán
    const [status, setStatus] = useState('pending');
    // State quản lý Tab ví điện tử
    const [walletType, setWalletType] = useState('momo'); // 'momo' hoặc 'zalo'
    // 1. NHẬN DỮ LIỆU TỪ CHECKOUT
    const receivedData = location.state;

    // Kiểm tra bảo mật: Nếu không có dữ liệu -> Đẩy về trang chủ
    useEffect(() => {
        if (!receivedData) {
            navigate('/'); 
        }
    }, [receivedData, navigate]);

    // Nếu chưa có data thì return null để tránh lỗi render
    if (!receivedData) return null;

    // Chuẩn hóa dữ liệu để hiển thị
    const orderData = {
        id: "DH" + Date.now().toString().slice(-6), // Tạo mã đơn dựa trên thời gian
        name: receivedData.fullName,
        phone: receivedData.phone,
        email: receivedData.email,
        address: receivedData.address,
        
        shippingMethod: receivedData.shippingMethod,
        shippingFee: receivedData.shippingFee,
        paymentMethod: receivedData.paymentMethod,
        
        subtotal: receivedData.subtotal,
        total: receivedData.subtotal + receivedData.shippingFee
    };

    // Tính tổng tiền
    const finalShippingFee = orderData.shippingMethod === 'free' ? 0 : orderData.shippingFee;
    const totalAmount = orderData.subtotal + finalShippingFee;

 

    const handleConfirmPayment = () => {
        if (window.confirm("Bạn xác nhận đã thanh toán thành công?")) {
            setStatus('reviewing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Cấu hình hiển thị cho Ví điện tử
    const walletConfig = {
        momo: {
            name: "MoMo",
            color: "#a50064",
            logo: "https://developers.momo.vn/v3/assets/images/MOMO-Logo-App-6262c3743a290ef02396a24ea2b66c35.png",
            qr: momoQR 
        },
        zalo: {
            name: "ZaloPay",
            color: "#0068ff",
            logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
            qr: zaloQR 
        }
    };

    return (
        <div className="confirm-container">
            {/* THANH TIẾN TRÌNH */}
            <div className='cart-progress-container'>
                <div className='cart-step active'><div className='step-circle'>1</div><span>Giỏ hàng</span></div>
                <div className='cart-progress-line active'></div>
                <div className='cart-step active'><div className='step-circle'>2</div><span>Thanh toán</span></div>
                <div className='cart-progress-line active'></div>
                <div className='cart-step active'><div className='step-circle'>3</div><span>Xác nhận</span></div>
            </div>

            {/* THÔNG BÁO TRẠNG THÁI */}
            {status === 'pending' && (
                <div className="status-message pending-box">
                    <span className="icon">💳</span>
                    <div>
                        <h3>Đơn hàng đã được tạo!</h3>
                        <p>Vui lòng hoàn tất thanh toán cho đơn hàng <strong>#{orderData.id}</strong>.</p>
                    </div>
                </div>
            )}

            {status === 'reviewing' && (
                <div className="status-message reviewing-box">
                    <span className="icon">🔍</span>
                    <div>
                        <h3>Đang xác minh giao dịch...</h3>
                        <p>Hệ thống đang kiểm tra. Đơn hàng sẽ được chuyển đi ngay khi tiền về tài khoản.</p>
                    </div>
                </div>
            )}

            <div className="confirm-main-content">
                {/* CỘT TRÁI: CHI TIẾT ĐƠN HÀNG */}
                <div className="order-details-card">
                    <h3>Chi tiết đơn hàng #{orderData.id}</h3>
                    <div className="info-section">
                        <p><strong>Họ tên:</strong> {orderData.name}</p>
                        <p><strong>SĐT:</strong> {orderData.phone}</p>
                        <p><strong>Địa chỉ:</strong> {orderData.address}</p>            
                    </div>
                    <div className="products-summary">
                        {/* Lặp qua danh sách sản phẩm nhận được */}
                        {receivedData.items.map((item, idx) => (
                           <div key={idx} className="summary-row">
                               <span>{item.name} x {item.quantity}</span>
                               <span>{(item.price * item.quantity).toLocaleString()} ₫</span>
                           </div>
                        ))}
                        <div className="summary-row line">
                            <span>Tổng phụ:</span>
                            <span>{orderData.subtotal.toLocaleString()} ₫</span>
                        </div>
                        <div className="summary-row">
                            <span>Vận chuyển:</span>
                            <span>{finalShippingFee === 0 ? 'Miễn phí' : '30.000 ₫'}</span>
                        </div>
                        <div className="summary-row">
                            <span>Phương thức:</span>
                            <span style={{fontWeight: 'bold', color: '#2c5282'}}>
                                {orderData.paymentMethod === 'bank' ? 'Chuyển khoản Ngân hàng' : 'Ví điện tử'}
                            </span>
                        </div>
                        <div className="summary-row" style={{borderBottom: 'none', paddingTop: '15px'}}>
                            <span style={{fontSize: '18px', fontWeight: 'bold'}}>TỔNG CỘNG:</span>
                            <span style={{fontSize: '20px', fontWeight: 'bold', color: '#b7791f'}}>
                                {totalAmount.toLocaleString()} ₫
                            </span>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: KHUNG THANH TOÁN */}
                <div className="payment-qr-section">
                    
                    {/* TRƯỜNG HỢP 1: NGÂN HÀNG (BANK) */}
                    {orderData.paymentMethod === 'bank' && (
                        status === 'pending' ? (
                            <>
                                <div className="qr-box">
                                   <h4>Mã QR chuyển khoản ngân hàng</h4>
                                    <img src={qrImage} alt="VietQR" className="qr-image" />
                                    <div className="status-badge">Trạng thái giao dịch: Chưa thanh toán</div>
                                </div>
                                <div className="bank-info-box">
                                    <h4>Thông tin chuyển khoản</h4>
                                    <p>Ngân hàng: <strong>MB Bank</strong></p>
                                    <p>Số tài khoản: <strong>0909123456</strong></p>
                                    <p>Chủ tài khoản: <strong>NGUYEN VAN A</strong></p>
                                    <p>Số tiền: <strong className="amount">{totalAmount.toLocaleString()} ₫</strong></p>
                                    <p>Nội dung: <strong className="highlight">{orderData.id} thanh toán</strong></p>
                                    <button className="btn-confirm-transfer" onClick={handleConfirmPayment}>
                                        XÁC NHẬN ĐÃ CHUYỂN KHOẢN
                                    </button>
                                </div>
                            </>
                        ) : (
                            <ReviewMessage />
                        )
                    )}

                    {/* TRƯỜNG HỢP 2: VÍ ĐIỆN TỬ (MOMO / ZALO) */}
                    {orderData.paymentMethod === 'e-wallet' && (
                        status === 'pending' ? (
                            <div className="e-wallet-layout">
                                {/* CỘT TRÁI CỦA VÍ: CHỌN VÍ & QR */}
                                <div className="wallet-left-section">
                                    {/* Tabs chọn ví */}
                                    <div className="wallet-cards-container">
                                        <div 
                                            className={`wallet-card-item ${walletType === 'momo' ? 'active momo' : ''}`}
                                            onClick={() => setWalletType('momo')}
                                        >
                                            <img src={walletConfig.momo.logo} alt="MoMo" />
                                            <span>MOMO</span>
                                        </div>
                                        <div 
                                            className={`wallet-card-item ${walletType === 'zalo' ? 'active zalo' : ''}`}
                                            onClick={() => setWalletType('zalo')}
                                        >
                                            <img src={walletConfig.zalo.logo} alt="ZaloPay" />
                                            <span>ZALOPAY</span>
                                        </div>
                                    </div>

                                    {/* Hiển thị QR */}
                                    <div className="qr-display-area">
                                        <p style={{color: walletConfig[walletType].color, fontWeight: 'bold'}}>
                                            Quét bằng {walletConfig[walletType].name}
                                        </p>
                                        <div className="qr-frame" style={{borderColor: walletConfig[walletType].color}}>
                                            <img src={walletConfig[walletType].qr} alt="Wallet QR" />
                                        </div>
                                        <div className="status-tag">Chờ thanh toán</div>
                                    </div>
                                </div>

                                {/* CỘT PHẢI CỦA VÍ: THÔNG TIN & NÚT */}
                                <div className="bank-info-box">
                                    <h4 className="info-title">Thông tin thanh toán</h4>
                                    
                                    <div className="payment-info-rows">
                                        <div className="info-row">
                                            <span className="label">Ví nhận:</span>
                                            <span className="value" style={{fontWeight: 'bold'}}>{walletConfig[walletType].name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Người nhận:</span>
                                            <span className="value" style={{textTransform: 'uppercase'}}>NGUYEN VAN A</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Số điện thoại:</span>
                                            <span className="value font-number">0909123456</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Số tiền:</span>
                                            <span className="value font-number bold">{totalAmount.toLocaleString()} ₫</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Nội dung:</span>
                                            <span className="value font-number bold">{orderData.id} thanh toán </span>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn-confirm-wallet"
                                        onClick={handleConfirmPayment}
                                        style={{backgroundColor: walletConfig[walletType].color}}
                                    >
                                        XÁC NHẬN ĐÃ THANH TOÁN
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ReviewMessage />
                        )
                    )}

                </div>
            </div>
        </div>
    );
};

// Component con hiển thị khi đang chờ duyệt
const ReviewMessage = () => (
    <div className="review-mode">
        <h4><span style={{fontSize: '24px'}}>🎉</span> Yêu cầu đã được ghi nhận!</h4>
        <p>Vui lòng đợi trong giây lát để nhân viên xác nhận giao dịch.</p>
        <button className="btn-secondary" onClick={() => window.location.href='/'}>Về trang chủ</button>
    </div>
);

export default Confirm;
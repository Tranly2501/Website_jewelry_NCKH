import React, { useState } from "react";
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";

const Register = ({ onSwitch }) => {
  // 1. Quản lý trạng thái ẩn/hiện cho 2 ô mật khẩu riêng biệt
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. Hàm xử lý khi nhấn Đăng ký (Người khác có thể thêm logic kiểm tra dữ liệu ở đây)
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Cỗ máy bắt đầu khởi tạo tài khoản mới...");
  };

  return (
    <div className="register-card">
      <h2 className="title">Đăng kí</h2>
      
      <form onSubmit={handleRegister}>
        {/* Hàng Họ và Tên - Chia đôi theo Figma */}
        <div className="name-row">
          <div className="input-group">
            <label></label>
            <input type="text" placeholder="Họ..." required />
          </div>
          <div className="input-group">
            <label></label>
            <input type="text" placeholder="Tên..." required />
          </div>
        </div>

        {/* Ô nhập Email */}
        <div className="input-group">
          <label>Địa chỉ email:</label>
          <input type="email" placeholder="" required />
        </div>

        {/* Ô Mật khẩu */}
        <div className="input-group relative-box">
          <label>Mật khẩu:</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="" 
            required 
          />
          <span 
            className="eye-icon" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </span>
        </div>

        {/* Ô Xác nhận mật khẩu */}
        <div className="input-group relative-box">
          <label>Xác nhận mật khẩu:</label>
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="" 
            required 
          />
          <span 
            className="eye-icon" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </span>
        </div>

        {/* Điều khoản dịch vụ */}
        <div className="terms">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            Tôi đồng ý với <u>Điều khoản dịch vụ</u> và <u>Chính sách bảo mật</u>
          </label>
        </div>

        <button type="submit" className="btn-register">Đăng kí</button>
      </form>

      {/* Dây dẫn onSwitch để lật lại trang Login */}
      <p className="register-lead">
        {/* Đã có tài khoản?{" "} */}
        <span className="switch-link" onClick={onSwitch}>
          {/* Đăng nhập ngay! */}
        </span>
      </p>
    </div>
  );
};

export default Register;
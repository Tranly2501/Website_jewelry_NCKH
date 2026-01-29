import React, { useState } from "react";
import axios from "axios"; // <--- 1. NHỚ IMPORT AXIOS
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";

const Register = ({ onSwitch }) => {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU NHẬP ---
  // <--- THÊM STATE CHO HỌ VÀ TÊN
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  
  // --- 2. STATE HIỂN THỊ/ẨN MẬT KHẨU ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 3. STATE QUẢN LÝ LỖI (ERROR MESSAGE) ---
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");

  // --- CÁC HÀM VALIDATE GIỮ NGUYÊN ---
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Vui lòng nhập email.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Email không hợp lệ (ví dụ: abc@gmail.com).");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if(emailError) validateEmail(val);
  };

  const validatePassword = (value) => {
    // Regex: 8 ký tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    
    if (!value) { 
        setPassError("Vui lòng nhập mật khẩu."); 
        return false;
    }   
    if (!strongRegex.test(value)) {
        setPassError("Mật khẩu yếu: Cần 8 ký tự, Hoa, thường, số, ký tự đặc biệt.");
        return false;
    }
    setPassError("");
    return true;
  };
  
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);       
    if(passError) validatePassword(val);
    if (confirmPassword) validateConfirmPassword(val, confirmPassword);
  };

  const validateConfirmPassword = (pass, confirmPass) => {
    if (!confirmPass) {
        setConfirmError("Vui lòng xác nhận mật khẩu.");
        return false;
    }
    if (pass !== confirmPass) {
        setConfirmError("Mật khẩu nhập lại không khớp.");
        return false;
    }
    setConfirmError("");
    return true;
  };
    
  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    validateConfirmPassword(password, val);
  };

  // --- 4. XỬ LÝ SUBMIT FORM & KẾT NỐI BACKEND ---
  const handleRegister = async (e) => { 
    e.preventDefault(); 
    
    const isEmailValid = validateEmail(email);
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(password, confirmPassword);

    if (!isEmailValid || !isPassValid || !isConfirmValid) {
        return; 
    }

    try {
        // <--- GỌI API KẾT NỐI
        // Ghép Họ + Tên thành username để gửi cho Backend
        const fullName = `${firstName} ${lastName}`.trim();

        await axios.post("http://localhost:8080/api/user/register", {
            username: fullName || "User", 
            email: email,
            password: password
        });

        // Nếu thành công
        alert("Đăng ký thành công! Hãy đăng nhập ngay.");
        
        // Gọi hàm onSwitch để chuyển giao diện sang Login luôn
        if(onSwitch) onSwitch(); 

    } catch (error) {
        // <--- XỬ LÝ LỖI TỪ BACKEND TRẢ VỀ
        console.error("Lỗi đăng ký:", error);
        if (error.response && error.response.data) {
            // Backend trả về lỗi (ví dụ: "Email đã tồn tại")
            alert(error.response.data); 
        } else {
            alert("Lỗi kết nối Server. Vui lòng thử lại sau.");
            console.log(error.response)
        }
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <h2 className="register-title">Đăng kí</h2>
      </div>
      
      <form onSubmit={handleRegister} noValidate>
        
        {/* Hàng Họ và Tên (ĐÃ SỬA: Thêm value và onChange) */}
        <div className="name-row">
          <div className="input-group half-width">
            <label>Họ:</label>
            <input 
                type="text" 
                placeholder="Nguyễn" 
                value={firstName} // <--- Thêm dòng này
                onChange={(e) => setFirstName(e.target.value)} // <--- Thêm dòng này
            />
          </div>
          <div className="input-group half-width">
            <label>Tên:</label>
            <input 
                type="text" 
                placeholder="Văn A" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Các phần Email, Password giữ nguyên như code của bạn */}
        <div className="input-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validateEmail(email)}
            className={emailError ? "input-error" : ""}
            placeholder="example@gmail.com"
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        <div className="input-group">
          <label>Mật khẩu:</label>
          <div className="password-relative-box">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              className={passError ? "input-error" : ""}
              placeholder="Nhập mật khẩu mạnh..."
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} color="#666" /> : <EyeOff size={18} color="#666" />}
            </span>
          </div>
          {passError && <p className="error-message">{passError}</p>}
        </div>

        <div className="input-group">
          <label>Xác nhận mật khẩu:</label>
          <div className="password-relative-box">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => validateConfirmPassword(password, confirmPassword)}
              className={confirmError ? "input-error" : ""}
              placeholder="Nhập lại mật khẩu..."
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye size={18} color="#666" /> : <EyeOff size={18} color="#666" />}
            </span>
          </div>
          {confirmError && <p className="error-message">{confirmError}</p>}
        </div>

        <div className="terms-container">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            Tôi đồng ý với <u>Điều khoản dịch vụ</u> và <u>Chính sách bảo mật</u>
          </label>
        </div>

        <div className="switch-login-text">
          <p>Bạn đã có tài khoản.</p>
          <span className="red-link" onClick={onSwitch}>Nhấn vào đây để đăng nhập</span>
        </div>

        <a><button type="submit" className="btn-register">Đăng kí</button></a>
      </form>
    </div>
  );
};

export default Register;
import React, { useState } from "react";
import axios from "axios"; 
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";

const Register = ({ onSwitch }) => {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(""); // <--- THÊM STATE PHONE
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  
  // --- 2. STATE HIỂN THỊ/ẨN MẬT KHẨU ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 3. STATE LỖI ---
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState(""); // <--- THÊM LỖI PHONE

  // --- VALIDATE EMAIL ---
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Vui lòng nhập email.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Email không hợp lệ.");
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

  // --- VALIDATE PHONE (SỐ ĐIỆN THOẠI) ---
  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10}$/; // Bắt buộc 10 chữ số
    if (!value) {
        setPhoneError("Vui lòng nhập số điện thoại.");
        return false;
    }
    if (!phoneRegex.test(value)) {
        setPhoneError("SĐT phải gồm 10 chữ số.");
        return false;
    }
    setPhoneError("");
    return true;
  };

  // --- VALIDATE PASSWORD ---
  const validatePassword = (value) => {
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

  // --- 4. XỬ LÝ SUBMIT ---
  const handleRegister = async (e) => { 
    e.preventDefault(); 
    
    // Validate toàn bộ trước khi gửi
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone); // <--- CHECK PHONE
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(password, confirmPassword);

    if (!isEmailValid || !isPhoneValid || !isPassValid || !isConfirmValid) {
        return; 
    }

    try {
        const fullName = `${firstName} ${lastName}`.trim();

        // Gửi phone kèm theo request
        await axios.post("http://localhost:8080/api/user/register", {
            username: fullName || "User", 
            email: email,
            phone: phone, 
            password: password,
        });

        alert("Đăng ký thành công!");
        if(onSwitch) onSwitch(); 

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        if (error.response && error.response.data) {
            alert(error.response.data); 
        } else {
            alert("Lỗi kết nối Server.");
        }
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <h2 className="register-title">Đăng kí</h2>
      </div>
      
      <form onSubmit={handleRegister} noValidate>
        
        {/* HỌ TÊN */}
        <div className="name-row">
          <div className="uth-input-group half-width">
            <label>Họ:</label>
            <input 
                type="text" 
                placeholder="Nguyễn" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
            />
          </div>
          <div className="uth-input-group half-width">
            <label>Tên:</label>
            <input 
                type="text" 
                placeholder="Văn A" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="uth-input-group">
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

         {/* SỐ ĐIỆN THOẠI (ĐÃ SỬA) */}
         <div className="uth-input-group">
          <label>Số điện thoại:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => {
                setPhone(e.target.value);
                if(phoneError) validatePhone(e.target.value);
            }}
            onBlur={() => validatePhone(phone)}
            className={phoneError ? "input-error" : ""}
            placeholder="0912345678"
          />
          {phoneError && <p className="error-message">{phoneError}</p>}
        </div>

        {/* MẬT KHẨU */}
        <div className="uth-input-group">
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

        {/* XÁC NHẬN MẬT KHẨU */}
        <div className="uth-input-group">
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

        <button type="submit" className="btn-register">Đăng kí</button>
      </form>
    </div>
  );
};

export default Register;
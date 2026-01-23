
import React, { useState } from "react";
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    // 1. Thêm trạng thái để theo dõi lỗi
    const [error, setError] = useState(false); 

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // 2. Hàm xử lý khi nhấn nút Đăng nhập
    const handleLogin = (e) => {
        e.preventDefault();
        // Giả lập: Nếu người khác nhấn nút mà chưa nhập gì thì hiện đỏ
        // Sau này người khác sẽ thay bằng logic kiểm tra mật khẩu từ database
        setError(true); 
    };

    return (
        <div className="login-card">
            <h2 className="login-title">Đăng nhập</h2>

            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Tên đăng nhập hoặc địa chỉ email</label>
                    <input type="text" placeholder="" />
                </div>

                {/* 3. Class "error-mode" chỉ được thêm vào khi error là true */}
                <div className={`input-group password-wrapper ${error ? "error-mode" : ""}`}>
                    <label>Mật khẩu</label>
                    <div className="relative-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            // 4. Class "error-border" cũng chỉ xuất hiện khi có lỗi
                            className={`password-input ${error ? "error-border" : ""}`}
                            placeholder=""
                        />
                        <span className="eye-icon" onClick={togglePassword}>
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>
                    
                    {/* 5. Chỉ khi đăng nhập sai (error === true) mới hiện dòng chữ này */}
                    {error && <p className="error-text">Mật khẩu không đúng. Xin vui lòng nhập lại</p>}
                </div>

                <div className="login-option">
                    <label><input type="checkbox" />Nhớ mật khẩu</label>
                    <span className="forgot-password">Quên mật khẩu</span>
                </div>

                <p className="register-lead">
                    Bạn chưa có tài khoản?
                    <span className="switch-link" onClick={onSwitch}>Đăng ký ngay!</span>
                </p>
                <button type="submit" className="btn-login">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;
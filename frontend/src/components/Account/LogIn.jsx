import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onSwitch }) => {
    const navigate = useNavigate();

    // 1. State lưu trữ dữ liệu nhập vào
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) {
            setError(false); 
            setErrorMessage("");
        }
    };

    // 2. Logic xử lý đăng nhập (ĐÃ KẾT NỐI BACKEND)
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // GỌI API ĐĂNG NHẬP

            const response = await axios.post('http://localhost:8080/api/user/login', {
                email: usernameInput, // Backend chờ field là "email", nên ta map usernameInput vào đây
                password: passwordInput
            });

            // NẾU THÀNH CÔNG (Backend trả về 200 OK)
            const { token, user } = response.data; 

            // 1. Lưu token để dùng cho các phiên sau
            localStorage.setItem("accessToken", token);
            
            // 2. Lưu thông tin user 
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
            } 

            // 3. L chuyển trang dựa trên ROLE (Quyền)
            if (user && user.role === 'admin') {
                navigate("/Admin"); 
            } else {
                navigate("/MyAccount"); 
            }

        } catch (err) {
            // NẾU CÓ LỖI (Sai pass, lỗi server...)
            console.error("Lỗi đăng nhập:", err);
            setError(true);
            
            // Lấy thông báo lỗi từ backend gửi về (nếu có)
            if (err.response && err.response.data) {
                const msg = typeof err.response.data === 'string' 
                            ? err.response.data 
                            : err.response.data.message || "Đăng nhập thất bại";
                setErrorMessage(msg);
            } else {
                setErrorMessage("Lỗi kết nối Server. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="login-card">
            <h2 className="login-title">Đăng nhập</h2>

            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Email đăng nhập</label>
                    <input 
                        type="text" 
                        placeholder="Nhập email..." 
                        value={usernameInput}
                        onChange={handleInputChange(setUsernameInput)}
                    />
                </div>

                <div className={`input-group password-wrapper ${error ? "error-mode" : ""}`}>
                    <label>Mật khẩu</label>
                    <div className="relative-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`password-input ${error ? "error-border" : ""}`}
                            placeholder="Nhập mật khẩu"
                            value={passwordInput}
                            onChange={handleInputChange(setPasswordInput)}
                        />
                        <span className="eye-icon" onClick={togglePassword}>
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>
                    
                    {/* Hiển thị lỗi từ state */}
                    {error && <p className="error-text">{errorMessage || "Tên đăng nhập hoặc mật khẩu không đúng."}</p>}
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
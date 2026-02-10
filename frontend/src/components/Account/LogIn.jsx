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
    // 2. Logic xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // GỌI API ĐĂNG NHẬP
            const response = await axios.post('http://localhost:8080/api/user/login', {
                email: usernameInput,
                password: passwordInput
            });

            // --- BƯỚC 1: KIỂM TRA DỮ LIỆU TỪ SERVER (QUAN TRỌNG) ---
            console.log("Kết quả API trả về:", response.data); 
            
            const { token, user } = response.data;

            // Kiểm tra xem có lấy được user không
            if (!user) {
                setErrorMessage("Lỗi: Không lấy được thông tin người dùng!");
                return;
            }

            console.log("Vai trò (Role) của user là:", user.role);

            // --- BƯỚC 2: XỬ LÝ ADMIN ---
            // Chuyển role về chữ thường để so sánh cho chính xác (tránh lỗi Admin vs admin)
            const role = user.role ? user.role.toLowerCase() : "";

            if (role === 'admin') {
                // 1. Hiện thông báo hỏi
                const confirmSwitch = window.confirm(
                    `Xin chào Admin ${user.username || ""}!\nBạn có muốn chuyển sang trang Quản Trị (Dashboard) không?`
                );

                // 2. Nếu bấm OK -> Chuyển sang cổng 5013
                if (confirmSwitch) {
                    console.log("Đang chuyển sang trang Admin...");
                    const userString = encodeURIComponent(JSON.stringify(user));

                    window.location.href = `http://localhost:5013?accessToken=${token}&userData=${userString}`;
                    return; 
                }
                // Nếu bấm Cancel -> Code sẽ chạy tiếp xuống dưới (coi như admin muốn mua hàng)
            }

            // --- BƯỚC 3: XỬ LÝ KHÁCH HÀNG (HOẶC ADMIN TỪ CHỐI SANG DASHBOARD) ---
            
            // Lưu token
            localStorage.setItem("accessToken", token);
            localStorage.setItem("currentUser", JSON.stringify(user));
            
            alert("Đăng nhập thành công!");
            navigate("/MyAccount"); 
            
        } catch (err) {
            console.error("Lỗi đăng nhập chi tiết:", err);
            setError(true);
            
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
                <div className="uth-input-group">
                    <label>Email đăng nhập</label>
                    <input 
                        type="text" 
                        placeholder="Nhập email..." 
                        value={usernameInput}
                        onChange={handleInputChange(setUsernameInput)}
                    />
                </div>

                <div className={`uth-input-group password-wrapper ${error ? "error-mode" : ""}`}>
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
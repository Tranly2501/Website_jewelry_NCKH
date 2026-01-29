import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "../../pages/Account/Account.css";
import "../../index.css";
import { Eye, EyeOff } from "lucide-react";


const Login = ({ onSwitch }) => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng

    // 1. State lưu trữ dữ liệu nhập vào
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Hàm reset lỗi khi người dùng bắt đầu gõ lại
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) {
            setError(false); 
            setErrorMessage("");
        }
    };

    // 2. Logic xử lý đăng nhập
    const handleLogin = async(e) => {
        e.preventDefault();
        
        try{
            //Gọi api đăng nhập 
            const response = await axios.post('http://localhost:8080/api/user/login', {
                email: usernameInput, 
                password: passwordInput
            });

            // NẾU THÀNH CÔNG (Backend trả về 200 OK)
            const { token, user } = response.data; // Giả sử backend trả về token và thông tin user

            // 1. Lưu token để dùng cho các phiên sau
            localStorage.setItem("accessToken", token);

            // 2. Lưu thông tin user (nếu cần hiển thị tên)
            // Nếu backend chưa trả về object 'user', bạn có thể tự lưu tạm
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                alert(`Xin chào ${user.username || "bạn"}!`);
            } else {
                alert("Đăng nhập thành công!");
            }

            // 3. Logic chuyển trang dựa trên ROLE (Quyền)
            if (user && user.role === 'admin') {
                navigate("/Admin"); 
            } else {
                navigate("/MyAccount"); // Trang mặc định cho khách hàng
            }

        } catch (err) {
           // NẾU CÓ LỖI (Sai pass, lỗi server...)
            console.error("Lỗi đăng nhập:", err);
            setError(true);
            
            // Lấy thông báo lỗi từ backend gửi về (nếu có)
            if (err.response && err.response.data) {
                // Backend thường gửi về dạng: "Sai mật khẩu" hoặc "Email không tồn tại"
                // Kiểm tra xem nó là object hay string
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
                    <label>Tên đăng nhập hoặc địa chỉ email</label>
                    <input 
                        type="text" 
                        placeholder="Nhập username hoặc email" 
                        // Liên kết input với state
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
                            // Liên kết input với state
                            value={passwordInput}
                            onChange={handleInputChange(setPasswordInput)}
                        />
                        <span className="eye-icon" onClick={togglePassword}>
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>
                    
                    {error && <p className="error-text">{errorMessage || "Tên đăng nhập hoặc mật khẩu không đúng. Xin vui lòng nhập lại"}</p>}
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
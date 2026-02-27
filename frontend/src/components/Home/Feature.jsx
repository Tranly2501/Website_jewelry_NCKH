import "../../pages/Home/Home.css";
import '../../index.css';
import React from "react";
import ringImage from "../../assets/Home/ring.png";
import TryAR from "../../assets/Home/tryAR.png";
import Bracelet from "../../assets/Home/bracelet.png";
import MyButton from '../../components/TabButtoon.jsx';
import { useNavigate } from 'react-router-dom';

const Feature = () => {
    const navigate = useNavigate();
    
    // Cập nhật hàm: Nhận thêm biến categoryName (nếu có)
    const handleClick = (path, categoryName = null) => {
        if (categoryName) {
            // Nếu có categoryName, gửi kèm nó qua 'state'
            navigate(path, { state: { selectedCategory: categoryName } });
        } else {
            // Dành cho trang AR (không cần lọc)
            navigate(path);
        }
    }

    return (
        <div className='feature-grid'>
            <div className='feature-item bracelet '>
                <img src={Bracelet} alt="" />
                <div className='feature-text bracelet-text'>
                    <p>BỘ SƯU TẬP VÒNG TAY </p>
                    {/* Chú ý: Tôi dùng '/Category' vì trong file App.jsx lúc trước của bạn, đường dẫn tên là /Category */}
                    <MyButton onClick={() => handleClick('/Category', 'bracelet')}>Khám phá </MyButton>
                </div>
            </div>

            <div className='feature-item ar '>
                <img src={TryAR} alt="" />
                <div className='feature-text ar '>
                    <p>CÔNG NGHỆ THỬ AR</p>
                    <MyButton onClick={() => handleClick('/AR')}>Khám phá </MyButton>
                </div>
            </div>
            
            <div className='feature-item ring'>
                <img src={ringImage} alt="" />
                <div className='feature-text ring'>
                    <p>BỘ SƯU TẬP NHẪN </p>
                    <MyButton onClick={() => handleClick('/Category', 'ring')}>Khám phá </MyButton>
                </div>
            </div>
        </div>
    )
} 
export default Feature;
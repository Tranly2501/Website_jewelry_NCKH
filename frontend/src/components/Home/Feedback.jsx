import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../pages/Home/Home.css";
import '../../index.css';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';



const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    // --- GỌI API LẤY DỮ LIỆU THẬT ---
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:8080/get-all-feedbacks');
                if (response.data.errCode === 0) {
                    setFeedbacks(response.data.data);
                }
            } catch (err) {
                console.error("Lỗi lấy feedback:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);
    
    const prev = () => {
        setIndex((prev) =>
        prev === 0 ? feedbacks.length - 1 : prev - 1
        );
    };

    const next = () => {
        setIndex((prev) =>
        prev === feedbacks.length - 1 ? 0 : prev + 1
        );
     };
    
     if (isLoading) return <div className="loading">Đang tải đánh giá...</div>;
    if (feedbacks.length === 0) return null; // Không hiện nếu không có data

    return( 
    <>
        <div className = "feedback-wrapper">
           {/* arrow left */}
           <img src={arrowLeft} alt="Trước đó" className="arrow arrow-left" onClick={prev} />

            {/*  feedback content*/}
            
        <div
          className="track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {feedbacks.map((fb) => (
            <div className="slide" key={fb.id}>
              {/* GIỮ NGUYÊN CARD */}
              <div className="feedback-card">
               <img src={fb.avatar || `https://ui-avatars.com/api/?name=${fb.userData?.username}&background=random`} className="avatar" alt="User" />
                {/* Hiện số sao đánh giá */}
                    <div className="stars-row" style={{ color: '#d4af37' }}>
                       {"★".repeat(fb.star)}
                        {"☆".repeat(5 - fb.star)}
                    </div>
                <p className="content">{fb.context}</p>
                <span className="name">{fb.userData?.username || "Khách hàng"}</span>
              </div>
            </div>
          ))}
        </div>
       


           {/* arrow right */}
           <img src={arrowRight} alt="Tiếp theo" className="arrow arrow-right" onClick={next}/>
        </div>
    </>
    )
}
export default Feedback;
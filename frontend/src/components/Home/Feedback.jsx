// import React from 'react'
import "../../pages/Home/Home.css";
import '../../index.css';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';
import avatarImg from '../../assets/Home/avataar.jpg';
import { useState } from "react";
const feedbacks = [
  {
    id: 1,
    avatar: avatarImg,
    content:
      "Sản phẩm rất tinh xảo, đóng gói sang trọng và giao hàng nhanh.",
    name: "Le Linh Anh",
  },
  {
    id: 2,
    avatar: avatarImg,
    content:
      "Thiết kế trang nhã, đeo rất nhẹ tay, phù hợp làm quà tặng.",
    name: "Ngọc Mai",
  },
  {
    id: 3,
    avatar: avatarImg,
    content:
      "Trải nghiệm mua sắm tốt, tư vấn nhiệt tình, sẽ ủng hộ tiếp.",
    name: "Thu Hằng",
  },
];
const Feedback = () => {
    const [index, setIndex] = useState(0);
    
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
                <img src={fb.avatar} className="avatar" />
                <p className="content">{fb.content}</p>
                <span className="name">{fb.name}</span>
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
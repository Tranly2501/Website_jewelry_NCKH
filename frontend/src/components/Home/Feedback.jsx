// import React from 'react'
import "../../pages/Home/Home.css";
import '../../index.css';
import arrowLeft from '../../assets/arrow-left.svg';
import arrowRight from '../../assets/arrow-right.svg';
import avatarImg from '../../assets/Home/avataar.jpg';
const Feedback = () => {

    return( 
    <>
        <div className = "feedback-wrapper">
           {/* arrow left */}
           <img src={arrowLeft} alt="Trước đó" className="arrow arrow-left" />

            {/*  feedback content*/}
            <div className="feedback-content">
                <img src={avatarImg} alt="" className="avatar" />
                <p className="feedback-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <span className="feedback-name">Nguyễn Văn A</span>    
            </div>

           {/* arrow right */}
           <img src={arrowRight} alt="Tiếp theo" className="arrow arrow-right" />
        </div>
    </>
    )
}
export default Feedback;
import React from 'react';
import './Contact.css';

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaInstagram, FaFacebookF } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page-container">
      
      {/* TIÊU ĐỀ TRANG */}
      <div className="contact-page-header">
        <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
      </div>

      {/* KHUNG NỘI DUNG CHÍNH (CÓ VIỀN) */}
      <div className="contact-box-wrapper">
        
        {/* --- CỘT TRÁI: THÔNG TIN LIÊN HỆ --- */}
        <div className="contact-info-col">
          
          {/* Địa chỉ */}
          <div className="info-group">
            <h3>Địa chỉ</h3>
            <p>
              <FaMapMarkerAlt className="contact-icon" /> 
              123 Trần Phú, Hà Đông, Hà Nội
            </p>
          </div>

          {/* Số điện thoại */}
          <div className="info-group">
            <h3>Số điện thoại</h3>
            <p>
              <FaPhoneAlt className="contact-icon" /> (+84)866182502
            </p>
            <p>
              <FaPhoneAlt className="contact-icon" /> (+84)866182502
            </p>
          </div>

          {/* Email */}
          <div className="info-group">
            <h3>Email</h3>
            <p>
              <FaEnvelope className="contact-icon" /> info@Jewelry.com
            </p>
          </div>

          {/* Thời gian làm việc */}
          <div className="info-group">
            <h3>Thời gian làm việc</h3>
            <p>
              <FaClock className="contact-icon" /> Thứ 2 - thứ 7: 8:30 - 18:30
            </p>
          </div>

          {/* Mạng xã hội */}
          <div className="info-group">
            <h3>Theo dõi chúng tôi</h3>
            <div className="social-links">
              <a href="https://instagram.com" className="social-item">
                <FaInstagram /> https://www.instagram.com/italicJewelry/
              </a>
              <a href="https://facebook.com" className="social-item">
                <FaFacebookF /> https://www.facebook.com/italic.Jewelry.23
              </a>
            </div>
          </div>

        </div>

        {/* --- CỘT PHẢI: FORM GỬI CÂU HỎI --- */}
        <div className="contact-form-col">
          <h3 className="form-title">Gửi câu hỏi của bạn</h3>
          
          <form className="contact-form">
            <div className="form-group">
              <label>Tên của bạn:</label>
              <input type="text" placeholder="" />
            </div>

            <div className="form-group">
              <label>Email của bạn:</label>
              <input type="email" placeholder="" />
            </div>

            <div className="form-group">
              <label>Câu hỏi của bạn:</label>
              <textarea rows="5" placeholder=""></textarea>
            </div>

            <button type="submit" className="btn-send-contact">GỬI CÂU HỎI</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
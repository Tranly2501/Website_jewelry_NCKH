import React, { useState, useRef, useEffect } from 'react';
import { products } from '../../data/product.js';
import { ARProcessor } from '../../components/ArProcessor.jsx';
import "./AR.css";
import "../../index.css"


import iconCamera from "../../assets/camera.svg"
import iconFullScreen from "../../assets/fullScreen.svg"
import iconWishlist from "../../assets/heart.svg";
import iconCart from "../../assets/cart.svg";

const AR = () => {
  const [activeCategory, setActiveCategory] = useState('ring');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // --- CAMERA LOGIC ---
const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const arContainerRef = useRef(null);
  const processorRef = useRef(null);

  const [photo, setPhoto] = useState(null); // Ảnh chụp
  const [isFlashing, setIsFlashing] = useState(false); // Hiệu ứng nháy

  // --- KHỞI TẠO AR
  useEffect( () => {
    const initAR = async () => {
      if ( videoRef.current && arContainerRef.current) {
        processorRef.current = new ARProcessor(videoRef.current, arContainerRef.current);
        await processorRef.current.init();
        processorRef.current.start();
      }
    }; 
    initAR();
    return () => {
      if (processorRef.current) processorRef.current.stop();
    };
  }, []);

  //--  LOAD MODEL 3D LÊN 
  useEffect(() => {
    if (processorRef.current && selectedProduct) {
        console.log("Load model cho:", selectedProduct.name);
        processorRef.current.loadModel("/assets/ring.glb"); 
    }
  }, [selectedProduct]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Lỗi mở camera:", err);
    }
  };

  const takePhoto = () => {
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d');

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Lật ngược ảnh để giống gương
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setPhoto(dataUrl);

    // Kích hoạt hiệu ứng flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  };

  const closePopup = () => {
    setPhoto(null);
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const arProducts = products.filter(
    (p) => p.isAR === true && p.category === activeCategory
  );


  return (
    <>
      <section className="ar-section">
        <h2 className="ar-title">TRẢI NGHIỆM THỰC TẾ TĂNG CƯỜNG AR</h2>

        <div className="ar-container">

          {/* --- KHUNG CAMERA--- */}
          <div className="ar-camera-view">
            
            {/* Hiệu ứng Flash */}
            <div className={`camera-flash ${isFlashing ? 'active' : ''}`}></div>

            <div className="camera-feed">
                {/* Luôn hiển thị Video trực tiếp */}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="live-video"
                  style={{ 
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)', // Lật gương
                      zIndex: 1
                  }}
                />

                {/* Container AR 3D (Đè lên video) */}
                <div 
                    ref={arContainerRef}
                    className="ar-3d-container"
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        pointerEvents: 'none',
                        zIndex: 2, // Cao hơn video
                        transform: 'scaleX(-1)'
                    }}
                ></div>

                {/* Canvas ẩn */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                {/* Overlay tên sản phẩm */}
                {selectedProduct && (
                    <div className="ar-overlay-product">
                    Đang thử: {selectedProduct.name}
                    </div>
                )}
            </div>

            {/* THANH CÔNG CỤ  */}
            <div className="ar-tools-bar" style={{ zIndex: 20 }}>
               <button className="tool-btn camera-btn" onClick={takePhoto}>
                <img src={iconCamera} alt="Chụp ảnh" />
               </button>
               <button className="tool-btn ">
                <img src={iconFullScreen} alt="Toàn màn hình" />
               </button>
               <button className="tool-btn">
                <img src={iconWishlist} alt="Thêm vào sản phẩm yêu thích" />
               </button>
               <button className="tool-btn">
                <img src={iconCart} alt="Thêm vào giỏ hàng" />
               </button>
            </div>
          </div>

          {/* --- CỘT PHẢI: LIST SẢN PHẨM --- */}
          <div className="ar-sidebar">
            <h3 className="sidebar-title">Mục sản phẩm</h3>
            <div className="ar-tabs">
              <button className={`ar-tab-btn ${activeCategory === 'ring' ? 'active' : ''}`} onClick={() => setActiveCategory('ring')}>Nhẫn</button>
              <button className={`ar-tab-btn ${activeCategory === 'bracelet' ? 'active' : ''}`} onClick={() => setActiveCategory('bracelet')}>Vòng tay</button>
            </div>
            <div className="ar-product-grid">
              {arProducts.length > 0 ? (
                arProducts.map(item => (
                  <div key={item.id} className={`ar-product-card ${selectedProduct?.id === item.id ? 'selected' : ''}`} onClick={() => setSelectedProduct(item)}>
                    <div className="ar-card-img">
                      <img src={item.images ? item.images[0] : item.image} alt={item.name} />
                    </div>
                    <h4 className="ar-card-name">{item.name}</h4>
                    <div className="ar-card-price">{item.price.toLocaleString()} ₫</div>
                  </div>
                ))
              ) : (<p className="no-data">Chưa có sản phẩm AR mục này</p>)}
            </div>
          </div>

        </div>
      </section>

      {/* --- POPUP HIỂN THỊ ẢNH ĐÃ CHỤP (Nằm ngoài cùng) --- */}
      {photo && (
        <div className="ar-popup-overlay">
          <div className="ar-popup-content">
            <h3>Ảnh chụp của bạn</h3>
            <div className="ar-popup-img-box">
               <img src={photo} alt="Captured" />
            </div>
            
            <div className="ar-popup-actions">
              <button className="popup-btn close" onClick={closePopup}>Đóng</button>
              <a href={photo} download="ar-snapshot.png" className="popup-btn download">Tải xuống</a>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
export default AR;
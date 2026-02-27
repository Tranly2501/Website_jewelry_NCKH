import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom'; // 1. THÊM IMPORT useLocation
import { transformProduct } from "../../util/transformProduct.js"; 

import { ARProcessor } from '../../components/ArProcessor.jsx';
import "./AR.css";
import "../../index.css"

import iconCamera from "../../assets/camera.svg"
import iconFullScreen from "../../assets/fullScreen.svg"
import iconWishlist from "../../assets/heart.svg";
import iconCart from "../../assets/cart.svg";

const AR = () => {
  // 2. KHỞI TẠO location ĐỂ NHẬN DỮ LIỆU
  const location = useLocation();
  const incomingProduct = location.state?.productInfo;

  // 3. SET MẶC ĐỊNH SẢN PHẨM NẾU CÓ DỮ LIỆU TRUYỀN SANG
  const [activeCategory, setActiveCategory] = useState(incomingProduct ? incomingProduct.categoryId : 'ring');
  const [selectedProduct, setSelectedProduct] = useState(incomingProduct || null);

  //--STATE CHO API --
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- CAMERA LOGIC ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const arContainerRef = useRef(null);
  const processorRef = useRef(null);

  const [photo, setPhoto] = useState(null); // Ảnh chụp
  const [isFlashing, setIsFlashing] = useState(false); // Hiệu ứng nháy
  
  // 4. (Tùy chọn) NẾU NGƯỜI DÙNG VÀO TỪ TRANG DETAIL NHƯNG DATA CHƯA KỊP LOAD VÀO ALLPRODUCTS
  // Ta có thể thêm nó tạm thời vào mảng để hiển thị ngay
  useEffect(() => {
     if (incomingProduct && !allProducts.find(p => p.id === incomingProduct.id)) {
        // Chỉ thêm nếu nó chưa có trong mảng
        setAllProducts(prev => [incomingProduct, ...prev]);
     }
  }, [incomingProduct, allProducts]);


  // --- FETCH DỮ LIỆU SẢN PHẨM TỪ API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/get-all-products");
        const rawData = response.data.products || response.data || [];

        const formattedData = rawData.map(item => transformProduct(item));
        setAllProducts(formattedData);
        
      } catch (err) {
        console.error("Lỗi tải sản phẩm AR:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- KHỞI TẠO AR
  useEffect(() => {
    const initAR = async () => {
      if (videoRef.current && arContainerRef.current) {
        processorRef.current = new ARProcessor(videoRef.current, arContainerRef.current);
        await processorRef.current.init();
        processorRef.current.start();
        
        // 5. NẾU VỪA VÀO CÓ SẴN SẢN PHẨM -> LOAD LUÔN MODEL
        if (incomingProduct && incomingProduct.model_url) {
            const fullModelUrl = `http://localhost:8080${incomingProduct.model_url}`;
            processorRef.current.loadModel(fullModelUrl); 
        } else if (incomingProduct && !incomingProduct.model_url) {
            // Trường hợp không có 3D
            processorRef.current.loadModel(null);
        }
      }
    }; 
    initAR();
    return () => {
      if (processorRef.current) processorRef.current.stop();
    };
  
  }, []); // Chỉ chạy 1 lần khi mount

  //--  LOAD MODEL 3D KHI CHỌN SẢN PHẨM KHÁC TỪ SIDEBAR
  useEffect(() => {
    if (processorRef.current && selectedProduct) {
      if (selectedProduct.model_url) {
        const fullModelUrl = `http://localhost:8080${selectedProduct.model_url}`;
        console.log("Đang load model 3d từ:", fullModelUrl);
        processorRef.current.loadModel(fullModelUrl); 
      } else {
        console.log("Sản phẩm không có model 3D, xóa model cũ");
        processorRef.current.loadModel(null); // Gửi null để ARProcessor xóa nhẫn cũ
      }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const arProducts = allProducts.filter(
    (p) => p.isAR === true && p.categoryId === activeCategory
  );

  return (
    <>
      <section className="ar-section">
        <h2 className="ar-title">TRẢI NGHIỆM THỰC TẾ TĂNG CƯỜNG AR</h2>

        <div className="ar-container">

          {/* --- KHUNG CAMERA--- */}
          <div className="ar-camera-view">
            
            <div className={`camera-flash ${isFlashing ? 'active' : ''}`}></div>

            <div className="camera-feed">
                {/* 6. HIỂN THỊ ẢNH TĨNH NẾU SẢN PHẨM KHÔNG CÓ MÔ HÌNH 3D */}
                {selectedProduct && !selectedProduct.model_url && (
                   <div style={{
                       position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                       background: 'rgba(255,255,255,0.8)', padding: '5px', borderRadius: '8px',
                       display: 'flex', flexDirection: 'column', alignItems: 'center'
                   }}>
                       <img src={selectedProduct.image} alt={selectedProduct.name} style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                       <span style={{fontSize: '12px', marginTop: '5px', color: '#ff4d4f'}}>*Chưa có mô hình 3D</span>
                   </div>
                )}

                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="live-video"
                  style={{ 
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover', transform: 'scaleX(-1)', zIndex: 1
                  }}
                />

                <div 
                    ref={arContainerRef}
                    className="ar-3d-container"
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        pointerEvents: 'none', zIndex: 2, transform: 'scaleX(-1)'
                    }}
                ></div>

                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                {selectedProduct && (
                    <div className="ar-overlay-product" style={{zIndex: 10}}>
                    Đang thử: {selectedProduct.name}
                    </div>
                )}
            </div>

            {/* THANH CÔNG CỤ */}
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
              {isLoading ? (
                <p className="no-data">Đang tải dữ liệu 3D...</p>
              ) : arProducts.length > 0 ? (
                arProducts.map(item => (
                  <div key={item.id} className={`ar-product-card ${selectedProduct?.id === item.id ? 'selected' : ''}`} onClick={() => setSelectedProduct(item)}>
                    <div className="ar-card-img">
                      <img src={item.images ? item.images[0] : item.image} alt={item.name} />
                    </div>
                    <h4 className="ar-card-name">{item.name}</h4>
                    <div className="ar-card-price">{item.price.toLocaleString('vi-VN')} ₫</div>
                  </div>
                ))
              ) : (
                <p className="no-data">Chưa có sản phẩm AR mục này</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* POPUP ẢNH */}
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
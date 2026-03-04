import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { OneEuroFilter } from '../util/OneEuroFilter.js';

export class ARProcessor {
  constructor(videoElement, containerElement) {
    this.videoElement = videoElement;
    this.containerElement = containerElement;

    this.videoTexture = null;
    
    // 1. Khởi tạo biến lưu dấu mốc thời gian bắt đầu (T_start)
    this.t_start = 0;
    
    // Core components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.hands = null;
    this.cameraUtils = null;
    
    // 3D Objects
    this.ring = null;
    this.landmarkPoints = [];
    
    // Flags
    this.isRunning = false;

    // 2. KHỞI TẠO BỘ LỌC CHO CHIẾC NHẪN (X, Y, Z)
const actualFreq = 45;    
const minCutoff = 0.5;   // Giảm xuống để lọc rung cực tốt khi đứng yên
const beta = 1;        // Tăng từ 0.012 lên 0.5 để nhẫn "dính" chặt vào tay khi di chuyển

this.filterX = new OneEuroFilter(actualFreq, minCutoff, beta);
this.filterY = new OneEuroFilter(actualFreq, minCutoff, beta);
this.filterZ = new OneEuroFilter(actualFreq, minCutoff, beta);
  }

  async init() {
    // 1. Setup Three.js Scene
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.containerElement.clientWidth, this.containerElement.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.containerElement.appendChild(this.renderer.domElement);

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);
    this.scene.add(ambientLight, dirLight);

    // 2. Setup Debug Points (21 điểm landmark)
    // LƯU Ý: Thường ở production ta nên để màu trong suốt hoặc ẩn đi
    const pointGeometry = new THREE.SphereGeometry(0.015, 8, 8);
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.1 });
    for (let i = 0; i < 21; i++) {
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      point.visible = false; // Ẩn mặc định
      this.scene.add(point);
      this.landmarkPoints.push(point);
    }

    // 3. Setup MediaPipe Hands
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults(this.onResults.bind(this)); 

    // 4. Setup Camera Utils
    if (this.videoElement) {
      this.cameraUtils = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.isRunning) {
          // 2. Đánh dấu T_start ngay trước khi gửi ảnh đi xử lý
          this.t_start = performance.now(); 
          
          await this.hands.send({ image: this.videoElement });
        }
      },
        width: 1280, 
        height: 720
      });
    }
  }

  // --- HÀM LOAD MODEL TỪ UI GỌI VÀO ---
  loadModel(glbPath) {
    // TỐI ƯU 1: Nếu truyền vào path rỗng (Sản phẩm không có 3D) -> Xóa nhẫn cũ và Dừng lại
    if (!glbPath) {
      if (this.ring) {
        this.scene.remove(this.ring);
        this.ring = null;
      }
      return; 
    }

    // Xóa model cũ nếu đang có
    if (this.ring) {
      this.scene.remove(this.ring);
      this.ring = null;
    }

    /// Đập chất liệu 
    
    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => {
      this.ring = gltf.scene;
      this.ring.scale.set(0.07, 0.07, 0.07);
      
      // Setup vật liệu
      this.ring.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.05,
            roughness: 0.08
          });
        }
      });

      this.ring.visible = false;
      this.scene.add(this.ring);
      console.log("Đã load model thành công:", glbPath);
    }, undefined, (error) => {
      console.error("Lỗi khi load model 3D:", error);
    });
  }


  // --- HÀM MỚI: DỊCH TỌA ĐỘ MEDIAPIPE SANG 3D SIÊU CHUẨN ---
  get3DPosition(lm) {
    // 1. Điều chỉnh tọa độ dựa trên độ crop của hình nền
    const ndcX = ((lm.x - this.bgOffsetX) / this.bgScaleX) * 2 - 1;
    const ndcY = -(((lm.y - this.bgOffsetY) / this.bgScaleY) * 2 - 1);

    // 2. Dùng Raycaster phóng tia từ Camera để tìm vị trí 3D chính xác trên màn hình
    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(this.camera);

    const dir = vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z; 
    const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    
    // 3. Cộng thêm độ sâu (Z) từ tay
    pos.z += -lm.z; 
    return pos;
  }

  // --- LOGIC XỬ LÝ (Loop) ---
  onResults(results) {

    // 3. Đánh dấu T_end ngay khi nhận được kết quả từ MediaPipe
    const t_end = performance.now();
    
    // 4. Tính toán Latency (Độ trễ)
    const latency = t_end - this.t_start;

    // 5. In ra màn hình console để theo dõi
    // .toFixed(2) để lấy 2 chữ số thập phân cho gọn
    console.log(`Latency ($T_{end} - T_{start}$): ${latency.toFixed(2)} ms`);

    // --- 1. ĐỒNG BỘ HÓA KHUNG HÌNH (RENDER SYNC) ---
    // MediaPipe trả về results.image chính là khung hình khớp 100% với landmark hiện tại
    if (results.image) {
      if (!this.videoTexture) {
        // Khởi tạo Texture ở frame đầu tiên
        this.videoTexture = new THREE.Texture(results.image);
        // Đảm bảo màu sắc hiển thị đúng chuẩn, không bị nhợt nhạt (dành cho Three.js bản mới)
        this.videoTexture.colorSpace = THREE.SRGBColorSpace; 
        
        // Gắn Texture này làm phông nền cho toàn bộ Scene 3D
        this.scene.background = this.videoTexture;
      } else {
        // Các frame tiếp theo: Cập nhật hình ảnh mới vào Texture
        this.videoTexture.image = results.image;
        this.videoTexture.needsUpdate = true;
      }
      // --- SỬA LỖI 2: XỬ LÝ TEXTURE THÀNH OBJECT-FIT: COVER ---
      const canvasW = this.containerElement.clientWidth;
      const canvasH = this.containerElement.clientHeight;
      const canvasAspect = canvasW / canvasH;
      const imageAspect = results.image.width / results.image.height;

      this.bgScaleX = 1; this.bgScaleY = 1;
      this.bgOffsetX = 0; this.bgOffsetY = 0;

      if (canvasAspect > imageAspect) {
        // Khung rộng hơn Ảnh -> Cắt bớt chiều dọc
        this.bgScaleY = imageAspect / canvasAspect;
        this.bgOffsetY = (1 - this.bgScaleY) / 2;
      } else {
        // Khung cao hơn Ảnh -> Cắt bớt chiều ngang
        this.bgScaleX = canvasAspect / imageAspect;
        this.bgOffsetX = (1 - this.bgScaleX) / 2;
      }

      this.videoTexture.repeat.set(this.bgScaleX, this.bgScaleY);
      this.videoTexture.offset.set(this.bgOffsetX, this.bgOffsetY);
      
    }

    // TỐI ƯU 2: GUARD CLAUSE
    if (!this.ring) {
        this.landmarkPoints.forEach(p => p.visible = false);
        // Vẫn phải render scene trống để khung hình camera không bị đứng
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return; // Dừng hàm tại đây, máy sẽ chạy rất nhẹ
    }

    

    // Tự động ẩn nhẫn nếu không thấy tay
    this.ring.visible = false;
    // Ẩn các điểm xanh (Chỉ bật lên khi thực sự tìm thấy tay)
    this.landmarkPoints.forEach(p => p.visible = false);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      

      //Lấy thời gian hiện tại (giây) để bộ lọc tính toán tần số thực tế
      const now = performance.now() / 1000;

      // 1. Cập nhật 21 điểm landmark 
       for(let i=0; i<landmarks.length; i++){
        const pos3D = this.get3DPosition(landmarks[i]);
        this.landmarkPoints[i].position.copy(pos3D);
        this.landmarkPoints[i].visible = true; // Bật lên test nếu cần
      }
      

      // 2. XỬ LÝ VỊ TRÍ NHẪN VỚI ONE EURO FILTER
      this.ring.visible = true; // Bật hiển thị nhẫn vì đã tìm thấy tay
      
     const lm9 = landmarks[9];
      const lm10 = landmarks[10];

      // Tọa độ THÔ (Raw)
      const rawMidX = (lm9.x + lm10.x) / 2;
      const rawMidY = (lm9.y + lm10.y) / 2 ;
      const rawMidZ = (lm9.z + lm10.z) / 2;

      // const rawX = (rawMidX - 0.5) * 2 * aspectRatio;
      // const rawY = -(rawMidY - 0.5) * 2; 
      // const rawZ = -rawMidZ;
      // Gọi hàm map 3D
      const midPoint3D = this.get3DPosition({ x: rawMidX, y: rawMidY, z: rawMidZ });

// Áp dụng bộ lọc One Euro
      const smoothX = this.filterX.filter(midPoint3D.x, now);
      const smoothY = this.filterY.filter(midPoint3D.y, now) - 0.02; // Chỉnh offset ở đây
      const smoothZ = this.filterZ.filter(midPoint3D.z, now);
      
     // Gán tọa độ ĐÃ LÀM MƯỢT cho nhẫn
      this.ring.position.set(smoothX, smoothY, smoothZ);
      this.ring.visible = true;
    }else {
      // TỐI ƯU: Nếu không thấy tay, hãy reset bộ lọc để tránh nhẫn bị "văng" khi tay xuất hiện lại
      this.filterX.reset();
      this.filterY.reset();
      this.filterZ.reset();
    }
    // Render 
    if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
    }
  }

  start() {
    this.isRunning = true;
    if (this.cameraUtils) this.cameraUtils.start();
  }

  stop() {
    this.isRunning = false;
    if (this.cameraUtils) this.cameraUtils.stop();
    
    // Cleanup WebGL
    if (this.containerElement && this.renderer) {
      this.containerElement.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { OneEuroFilter } from '../../util/OneEuroFilter.js';
import {MaterialManager} from '../../util/MaterialManager.jsx';

import {RingLogic} from './RingLogic.js';
import {BraceletLogic} from './BraceletLogic.js';

export class ARProcessor {
  constructor(videoElement, containerElement) {
    this.videoElement = videoElement;
    this.containerElement = containerElement;
    this.canvasW = this.containerElement.clientWidth;
    this.canvasH = this.containerElement.clientHeight;
    this.videoTexture = null;
    
    // 1. Khởi tạo biến lưu dấu mốc thời gian bắt đầu (T_start)
    this.t_start = 0;
    
    // Core components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.hands = null;
    this.cameraUtils = null;  
    this.isRunning = false;

    //Bộ lọc Vị trí
    const actualFreq = 50;    
    const minCutoff =1;   // Giảm xuống để lọc rung cực tốt khi đứng yên
    const beta = 1;       
    const dcutoff=1.0;
    this.filterX = new OneEuroFilter(actualFreq, minCutoff, beta, dcutoff);
    this.filterY = new OneEuroFilter(actualFreq, minCutoff, beta,dcutoff);
    this.filterZ = new OneEuroFilter(actualFreq, minCutoff, beta, dcutoff);

    // Bộ lọc Xoay
    const qFreq = 20;
    const qMinCutoff = 0.001; // Cắt tần số thấp để tránh xoay quá nhạy
    const qBeta = 2;
    this.filterQx = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQy = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQz = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQw = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);

    // Bộ lọc Thu phóng (Scale)
  this.filterScale = new OneEuroFilter(50, 0.05, 1, 1.0);
    
    // Biến lưu thông tin tay (Trái/Phải) để xử lý xoay
    this.isRightHand = true;

    this.ringGroup = new THREE.Group();
    this.activeModel = null;
    this.currentLogic = null; // Chứa RingLogic hoặc BraceletLogic

    // Thông số background
    this.bgScaleX = 1; this.bgScaleY = 1;
    this.bgOffsetX = 0; this.bgOffsetY = 0;
  }

  async init() {
    // 1. Setup Three.js Scene
    this.scene = new THREE.Scene();
    
    // THÊM RING GROUP VÀO SCENE
    this.scene.add(this.ringGroup);
    
    this.camera = new THREE.PerspectiveCamera(80, this.canvasW / this.canvasH, 0.01, 1400);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true , preserveDrawingBuffer: true});
    this.renderer.setSize(this.canvasW,  this.canvasH);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.containerElement.appendChild(this.renderer.domElement);

    // Ánh sáng
    // 1. AmbientLight (Ánh sáng môi trường)
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    // 2. Key Light (Đèn chính)
    const dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
    dirLight.position.set(0, 1, 5); 

  // 3. Fill Light (Đèn phụ - Tùy chọn)
    const fillLight = new THREE.DirectionalLight(0xf0f0ff, 2);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(ambientLight, dirLight,fillLight);


// Tải HDRI
    await MaterialManager.loadEnvironment(this.renderer, this.scene);

    // 3. Setup MediaPipe Hands
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
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
        width: 1240, 
        height: 720
      });
    }
  }

  // 1. kiểm tra sp người dùng đang chọn là gì 
  switchProduct(product) {
    // Phân loại dựa trên categoryId (kiểm tra theo data thực tế của bạn)
    const cat = typeof product.categoryId === 'string' ? product.categoryId.toLowerCase() : product.categoryId;

    if (cat === 'ring' || cat === 1) {
      this.currentLogic = new RingLogic();
    } else if (cat === 'bracelet' || cat === 2) {
      this.currentLogic = new BraceletLogic();
    }

    const fullModelUrl = `http://localhost:8080${product.model_url}`;
    this.loadModel(fullModelUrl);
  }

  // ---NẠP MODEL VÀ GỌI LOGIC SETUP ---
  loadModel(glbPath) {
    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => {
      this.clearModel();
      this.activeModel = gltf.scene;
      
      // Gọi ringLogic hoặc braceleetLogic tự setup Scale, Rotation và Occluder cho model
      this.currentLogic.setupModelAndOccluder(this.activeModel, this.ringGroup);
      
      // Setup vật liệu từ MaterialManager
      MaterialManager.applyMaterialsToModel(this.activeModel);
      
      this.ringGroup.add(this.activeModel);
      console.log("Đã load model thành công:", glbPath);
    });
  }

  // THÊM HÀM DỌN DẸP MÔ HÌNH
  clearModel() {
    if (this.activeModel) {
      this.ringGroup.remove(this.activeModel);
      this.activeModel = null;
    }
    const oldOccluder = this.ringGroup.children.find(child => child.isMesh && child.material.colorWrite === false);
    if (oldOccluder) this.ringGroup.remove(oldOccluder);
    
    this.ringGroup.visible = false;
  }

  // --- CẬP NHẬT BACKGROUND (Bị thiếu) ---
  updateBackground(image) {
    if (!this.videoTexture) {
      this.videoTexture = new THREE.Texture(image);
      this.videoTexture.colorSpace = THREE.SRGBColorSpace; 
      this.scene.background = this.videoTexture;
    } else {
      this.videoTexture.image = image;
      this.videoTexture.needsUpdate = true;
    }

    const canvasAspect = this.canvasW / this.canvasH;
    const imageAspect = image.width / image.height;

    this.bgScaleX = 1; this.bgScaleY = 1;
    this.bgOffsetX = 0; this.bgOffsetY = 0;

    if (canvasAspect > imageAspect) {
      this.bgScaleY = imageAspect / canvasAspect;
      this.bgOffsetY = (1 - this.bgScaleY) / 2;
    } else {
      this.bgScaleX = canvasAspect / imageAspect;
      this.bgOffsetX = (1 - this.bgScaleX) / 2;
    }

    this.videoTexture.repeat.set(this.bgScaleX, this.bgScaleY);
    this.videoTexture.offset.set(this.bgOffsetX, this.bgOffsetY);
  }

  // --- DỊCH TỌA ĐỘ MEDIAPIPE SANG 3D  CHUẨN ---
  get3DPosition(lm) {
    // 1. Điều chỉnh tọa độ dựa trên độ crop của hình nền
    const ndcX = ((lm.x - this.bgOffsetX) / this.bgScaleX) * 2 - 1;
    const ndcY = -(((lm.y - this.bgOffsetY) / this.bgScaleY) * 2 - 1);
    const ndcz = (-lm.z) *2;
    // 2. Dùng Raycaster phóng tia từ Camera để tìm vị trí 3D chính xác trên màn hình
    const vector = new THREE.Vector3(ndcX, ndcY, ndcz);
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

    //  tính độ trễ 
    const t_end = performance.now();
    const latency = t_end - this.t_start;
    console.log(`Latency ($T_{end} - T_{start}$): ${latency.toFixed(2)} ms`);

    if (results.image) {
      this.updateBackground(results.image);
    }

    // Nếu chưa load xong hoặc không thấy tay thì ẩn đi
    if (!this.activeModel || !results.multiHandLandmarks?.length) {
      this.ringGroup.visible = false;
      this.render();
      return;
    }

    const now = performance.now() / 1400; 

    if (this.ringGroup && this.currentLogic) {
          // LẤY KẾT QUẢ TỪ RING LOGIC
          const transform = this.currentLogic.calculateTransform(results, this.camera, this);

          // ÁP DỤNG BỘ LỌC VÀ GẮN VÀO MODEL
          this.ringGroup.position.set(
              this.filterX.filter(transform.position.x, now),
              this.filterY.filter(transform.position.y, now), // Y đã được cộng 0.02 bên RingLogic
              this.filterZ.filter(transform.position.z, now)
          );

          this.ringGroup.quaternion.set(
              this.filterQx.filter(transform.quaternion.x, now),
              this.filterQy.filter(transform.quaternion.y, now),
              this.filterQz.filter(transform.quaternion.z, now),
              this.filterQw.filter(transform.quaternion.w, now)
          ).normalize();

          if (transform.scale !== undefined) {
              const smoothScale = this.filterScale.filter(transform.scale, now);
              this.ringGroup.scale.set(smoothScale, smoothScale, smoothScale);
          }

          this.ringGroup.visible = true;
      }
      this.render();
  }
  
  render() {
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


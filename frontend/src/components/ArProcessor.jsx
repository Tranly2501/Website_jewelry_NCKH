// src/components/AR/ARProcessor.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export class ARProcessor {
  constructor(videoElement, containerElement) {
    this.videoElement = videoElement;
    this.containerElement = containerElement;
    
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
    const pointGeometry = new THREE.SphereGeometry(0.02,8 , 8);
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.0 });
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
      minTrackingConfidence: 0.7
    });

    this.hands.onResults(this.onResults.bind(this)); // Bind 'this' để dùng trong hàm

    // 4. Setup Camera Utils
    if (this.videoElement) {
      this.cameraUtils = new Camera(this.videoElement, {
        onFrame: async () => {
          if (this.isRunning) await this.hands.send({ image: this.videoElement });
        },
        width: 1280, // Độ phân giải camera input
        height: 720
      });
    }
  }

  // --- HÀM LOAD MODEL TỪ UI GỌI VÀO ---
  loadModel(glbPath) {
    if (!glbPath) return;

    // Xóa model cũ nếu có
    if (this.ring) {
      this.scene.remove(this.ring);
      this.ring = null;
    }

    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => {
      this.ring = gltf.scene;
      this.ring.scale.set(0.05, 0.05, 0.05);
      
      // Setup vật liệu
      this.ring.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.5
          });
        }
      });

      this.ring.visible = false;
      this.scene.add(this.ring);
      console.log("Đã load model:", glbPath);
    });
  }

  // --- LOGIC XỬ LÝ (Loop) ---
  onResults(results) {
    // Ẩn tất cả trước khi tính toán
    if (this.ring) this.ring.visible = false;
    this.landmarkPoints.forEach(p => p.visible = false);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Tính aspect ratio
      const videoWidth = this.videoElement.videoWidth || 1;
      const videoHeight = this.videoElement.videoHeight || 1;
      const aspectRatio = videoWidth / videoHeight;

      // 1. Cập nhật 21 điểm landmark (Logic của bạn)
      for(let i=0; i<landmarks.length; i++){
        const lm = landmarks[i];
        const x = ((lm.x - 0.5) * 2 * aspectRatio) + 0.03;
        const y = -(lm.y - 0.5) * 2; // Đã bỏ aspectRatio ở Y theo chuẩn ThreeJS, hoặc bạn nhân vào nếu muốn giữ logic cũ
        const z = -lm.z;
        
        this.landmarkPoints[i].position.set(x, y, z);
        this.landmarkPoints[i].visible = true;
      }

      // 2. Cập nhật vị trí Nhẫn
      if (this.ring) {
        this.ring.visible = true;
        const lm9 = landmarks[9];
        const lm10 = landmarks[10];

        const midX = (lm9.x + lm10.x) / 2;
        const midY = (lm9.y + lm10.y) / 2;
        const midZ = (lm9.z + lm10.z) / 2;

        const x = (midX - 0.5) * 2 * aspectRatio;
        const y = -(midY - 0.5) * 2; 
        const z = -midZ;

        this.ring.position.set(x, y, z);
        
        // Bonus: Xoay nhẫn theo hướng ngón tay (Logic Quaternion)
        // ... bạn có thể thêm lại logic xoay container ở đây nếu muốn
      }
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
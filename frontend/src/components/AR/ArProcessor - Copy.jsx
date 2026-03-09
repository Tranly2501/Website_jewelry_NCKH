import * as THREE from 'three';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { OneEuroFilter } from '../util/OneEuroFilter.js';
import {MaterialManager} from '../util/MaterialManager.jsx';

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
    
    // 3D Objects
    this.ring = null;
    this.landmarkPoints = [];
    
    this.isRunning = false;

    // 2. KHỞI TẠO BỘ LỌC CHO CHIẾC NHẪN (X, Y, Z)
    const actualFreq = 50;    
    const minCutoff =1;   // Giảm xuống để lọc rung cực tốt khi đứng yên
    const beta = 1;       
    const dcutoff=1.0;
    this.filterX = new OneEuroFilter(actualFreq, minCutoff, beta, dcutoff);
    this.filterY = new OneEuroFilter(actualFreq, minCutoff, beta,dcutoff);
    this.filterZ = new OneEuroFilter(actualFreq, minCutoff, beta, dcutoff);
    const qFreq = 20;
    const qMinCutoff = 0.001; // Cắt tần số thấp để tránh xoay quá nhạy
    const qBeta = 2;
    this.filterQx = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQy = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQz = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    this.filterQw = new OneEuroFilter(qFreq, qMinCutoff, qBeta, 1.0);
    
    // Biến lưu thông tin tay (Trái/Phải) để xử lý xoay
    this.isRightHand = true;
  }

  async init() {
    // 1. Setup Three.js Scene
    this.scene = new THREE.Scene();
    
    
    this.camera = new THREE.PerspectiveCamera(75, this.canvasW / this.canvasH, 0.01, 1400);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true , preserveDrawingBuffer: true});
    this.renderer.setSize(this.canvasW,  this.canvasH);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.containerElement.appendChild(this.renderer.domElement);

    // Ánh sáng
    // 1. AmbientLight (Ánh sáng môi trường)
    // Đổi sang màu trắng (0xffffff) để toàn bộ nhẫn được phủ sáng đều
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    // 2. Key Light (Đèn chính)
    // Đèn định hướng màu trắng sáng, cường độ cao
    const dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
    // Đặt ở vị trí: X=0 (chính giữa), Y=5 (trên cao chiếu xuống), Z=5 (từ camera chiếu thẳng vào tay)
    dirLight.position.set(0, 1, 5); 

    // // 3. Fill Light (Đèn phụ - Tùy chọn)
    // // Đánh sáng từ hướng ngược lại để phần gầm/bên hông nhẫn không bị đen đặc
    const fillLight = new THREE.DirectionalLight(0xf0f0ff, 2); // Ánh sáng hơi xanh lạnh
    fillLight.position.set(-5, 0, -5);
    this.scene.add(ambientLight, dirLight,fillLight);


    // Truyền renderer và scene vào để MaterialManager cấu hình mtr
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


  // --- HÀM LOAD MODEL ---
  loadModel(glbPath) {
    if (!glbPath) {
      if (this.ringGroup) { this.scene.remove(this.ringGroup); this.ringGroup = null; }
      return; 
    }

    if (this.ringGroup) { this.scene.remove(this.ringGroup); this.ringGroup = null; }

    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => {
      this.ring = gltf.scene;
      this.ring.scale.set(0.75, 0.75,0.75); 
      
      // Setup vật liệu từ MaterialManager
      MaterialManager.applyMaterialsToModel(this.ring);

    // --- TẠO NGÓN TAY TÀNG HÌNH VÀ GROUP ---

    // Cấu trúc lệnh: CylinderGeometry(Bán_kính_trên, Bán_kính_dưới, Chiều_dài, Số_mặt_cắt)
      const occluderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08,80) 
      const occluderMat = new THREE.MeshBasicMaterial({ colorWrite: false });

      // // CHẾ ĐỘ X-QUANG ĐỂ BẮT BỆNH:
      // const occluderMat = new THREE.MeshBasicMaterial({ 
      //     color: 0xff0000,      // Cho khối trụ màu ĐỎ CHÓT
      //     colorWrite: true,     // Bật màu lên (Thay vì false)
      //     wireframe: true       // Biến thành lưới để nhìn xuyên qua
      // });
      
      // Quan trọng: Bắt buộc ghi vào bộ nhớ độ sâu
      occluderMat.depthWrite = true; 
      
      this.occluder = new THREE.Mesh(occluderGeo, occluderMat);
      // this.occluder.rotation.x = Math.PI / 2; // Xoay dọc theo ngón tay
       this.occluder.position.z =  this.occluder.position.z - 0.015; // Xoay dọc theo ngón tay
      console.log('toa do tay '+  this.occluder.position);

      // PHÉP MÀU NẰM Ở ĐÂY: Ép khối tàng hình luôn được vẽ ĐẦU TIÊN
      this.occluder.renderOrder = -1; // Số càng nhỏ càng được vẽ trước
      
      // Đảm bảo chiếc nhẫn luôn được vẽ SAU (Mặc định renderOrder là 0)
      this.ring.renderOrder = 1; 

      // Gom nhẫn và ngón tay vào Group
      this.ringGroup = new THREE.Group();
      this.ringGroup.add(this.ring);
      this.ringGroup.add(this.occluder);

      this.ringGroup.visible = false;
      this.scene.add(this.ringGroup); 
      
      console.log("Đã load model thành công:", glbPath);
    });
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

    // 3. Đánh dấu T_end ngay khi nhận được kết quả từ MediaPipe
    const t_end = performance.now();
    
    // 4. Tính toán Latency (Độ trễ)
    const latency = t_end - this.t_start;

    // 5. In ra màn hình console để theo dõi
    // .toFixed(2) để lấy 2 chữ số thập phân cho gọn
    console.log(`Latency ($T_{end} - T_{start}$): ${latency.toFixed(2)} ms`);

    // --- 1. ĐỒNG BỘ HÓA KHUNG HÌNH (RENDER SYNC) ---
    // MediaPipe trả về results.image chính là khung hình khớp 140% với landmark hiện tại
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
     
      
    }

     // ---  XỬ LÝ TEXTURE THÀNH OBJECT-FIT: COVER ---

      const canvasAspect = this.canvasW / this.canvasH;
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
    // TỐI ƯU 2: GUARD CLAUSE
    if (!this.ringGroup) {
        this.landmarkPoints.forEach(p => p.visible = false);
        // Vẫn phải render scene trống để khung hình camera không bị đứng
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return; // Dừng hàm tại đây, máy sẽ chạy rất nhẹ
    }

    // Tự động ẩn nhẫn nếu không thấy tay
    this.ringGroup.visible = false;
    // Ẩn các điểm xanh (Chỉ bật lên khi thực sự tìm thấy tay)
    this.landmarkPoints.forEach(p => p.visible = false);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handInfo = results.multiHandedness[0]; // Lấy thông tin tay trái hay phải
    this.isRightHand = handInfo.label === 'Right';
      
      //Lấy thời gian hiện tại (giây) để bộ lọc tính toán tần số thực tế
      const now = performance.now() / 1400;

      // // 1. Cập nhật 21 điểm landmark 
      //  for(let i=0; i<landmarks.length; i++){
      //   const pos3D = this.get3DPosition(landmarks[i]);
      //   this.landmarkPoints[i].position.copy(pos3D);
      //   this.landmarkPoints[i].visible = true; // Bật lên test nếu cần
      // }
      
      if (this.ringGroup) {
          this.ringGroup.visible = true; // Bật  GROUP (Nhẫn + Ngón tay tàng hình)
          
          // --- 2.1  TÍNH TỌA ĐỘ VỊ TRÍ ---
          const lm13 = landmarks[13];
          const lm14 = landmarks[14];
          
          // Tọa độ THÔ (Raw)
          const rawMidX = (lm13.x + lm14.x) / 2;
          const rawMidY = (lm13.y + lm14.y) / 2;
          const rawMidZ = (lm13.z + lm14.z) / 2;
          // Gọi hàm map 3D
          const midPoint3D = this.get3DPosition({ x: rawMidX, y: rawMidY, z: rawMidZ });

          // Áp dụng bộ lọc One Euro
          const smoothX = this.filterX.filter(midPoint3D.x, now);
          const smoothY = this.filterY.filter(midPoint3D.y, now) ;
          const smoothZ = this.filterZ.filter(midPoint3D.z, now);

          // Set vị trí cho Group
          this.ringGroup.position.set(smoothX, smoothY, smoothZ);

          // 2. XỬ LÝ VỊ TRÍ VÀ GÓC XOAY CHO NHẪN
          if (this.ringGroup) {
              this.ringGroup.visible = true;
              
              const lm13 = landmarks[13];
              const lm14 = landmarks[14];

              // --- 2.1 PHỤC HỒI LẠI TÍNH TỌA ĐỘ VỊ TRÍ ---
              const rawMidX = (lm13.x + lm14.x) / 2 ;
              const rawMidY = (lm13.y + lm14.y) / 2 ;
              const rawMidZ = (lm13.z + lm14.z) / 2;
              const midPoint3D = this.get3DPosition({ x: rawMidX, y: rawMidY, z: rawMidZ });

              const smoothX = this.filterX.filter(midPoint3D.x, now);
              const smoothY = this.filterY.filter(midPoint3D.y, now) +0.02; // Bù trừ offset
              const smoothZ = this.filterZ.filter(midPoint3D.z, now) ;

              console.log(" toa di , t, z cua mo hinh "+ smoothX + " , " + smoothY  + " , " + smoothZ );
              // Set vị trí cho Group
              this.ringGroup.position.set(smoothX, smoothY, smoothZ);

              // --- 2.2 TÍNH GÓC XOAY (BẰNG WORLD LANDMARKS) ---
              // Lấy bộ tọa độ thế giới thực (Không bị méo phối cảnh)
              const worldLms = results.multiHandWorldLandmarks[0];

              // Đảo trục MediaPipe (Y hướng xuống, Z đâm vào) sang hệ trục Three.js (Y hướng lên, Z đâm ra)
              const w5 = new THREE.Vector3(worldLms[5].x, -worldLms[5].y, -worldLms[5].z);
              const w13 = new THREE.Vector3(worldLms[13].x, -worldLms[13].y, -worldLms[13].z);
              const w14 = new THREE.Vector3(worldLms[14].x, -worldLms[14].y, -worldLms[14].z);
              const w17 = new THREE.Vector3(worldLms[17].x, -worldLms[17].y, -worldLms[17].z);

              // Dựng Trục Y (Chiều dọc ngón tay)
              const yAxis = new THREE.Vector3().subVectors(w14, w13).normalize();
              
              // Dựng Trục Z (Vuông góc mu bàn tay)
              const v_across = new THREE.Vector3().subVectors(w5, w17).normalize();
              const zAxis = new THREE.Vector3().crossVectors(v_across, yAxis).normalize();
              
              // Nếu là tay trái, trục X sẽ bị ngược, ta cần đảo trục Z để hệ trục luôn thuận
              if (!this.isRightHand) {
                  zAxis.multiplyScalar(-1);
              }

              // Dựng Trục X
              const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();

              // Cập nhật Quaternion
              // Ghép 3 trục thành Ma trận xoay
              const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
              // Chuyển đổi sang Quaternion để khóa vĩnh viễn hệ trục
              const targetQ = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

              // 3. Lọc độ rung lắc cho Quaternion (Nếu bạn có khai báo filterQx, Qy, Qz, Qw)
              // Nếu chưa có, bạn có thể gán trực tiếp: this.ringGroup.quaternion.copy(targetQ);
              if (this.filterQx) {
                  const smoothQx = this.filterQx.filter(targetQ.x, now);
                  const smoothQy = this.filterQy.filter(targetQ.y, now);
                  const smoothQz = this.filterQz.filter(targetQ.z, now);
                  const smoothQw = this.filterQw.filter(targetQ.w, now);
                  this.ringGroup.quaternion.set(smoothQx, smoothQy, smoothQz, smoothQw).normalize();
              } else {
                  this.ringGroup.quaternion.copy(targetQ);
              }
          }
      } 

    } else {
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


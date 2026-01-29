import * as THREE from 'three'
import { GLTFLoader } from '/libs/three/examples/jsm/loaders/GLTFLoader.js';

// // Khởi tạo Three.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

// Video camera
const videoElement = document.createElement('video');
videoElement.style.display = 'none';
document.body.appendChild(videoElement);




// Vẽ điểm landmark
const landmarkPoints = [];
const pointGeometry = new THREE.SphereGeometry(0.02,100,100);
const pointMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 ,roughness:0.0});

for (let i = 0 ;i < 21; i++) {
  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  scene.add(point);
  landmarkPoints.push(point);
}

// MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.7
});

let ring;
const loader = new GLTFLoader();
loader.load('./assets/ring.glb', (gltf) => {
  ring = gltf.scene;
  ring.scale.set(0.05, 0.05, 0.05);
  

 // Thay toàn bộ material không quan tâm là gì
  ring.traverse((child) => {
    if (child.isMesh) {
      // Hủy material cũ (tránh rò bộ nhớ)
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => mat.dispose());
      } else if (child.material) {
        child.material.dispose();
      }

      // Tạo material mới hợp lệ
      child.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.5
      });
    }
  });

  scene.add(ring);
  ring.visible =false;
});







hands.onResults((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0 && ring) {
    ring.visible = true;
    const landmarks = results.multiHandLandmarks[0];

    // tao 21 diem
const videoWidth=videoElement.videoWidth;
 
    const videoHeight=videoElement.videoHeight;
    const aspectRatio= videoWidth/videoHeight;
    
    for( let i=0; i<landmarks.length; i++){
      const lm=landmarks[i];
      const x=((lm.x-0.5)*2*aspectRatio)+0.03;
      const y=-(lm.y-0.5)*2*aspectRatio;
      const z= -lm.z;
      landmarkPoints[i].position.set(x,y,z);
    }



    if(ring){
      const lm1= landmarks[9];
      const lm2=landmarks[10];
      const ringFingerBase= {
        x: (lm1.x+lm2.x)/2,
        y: (lm1.y+lm2.y)/2,
        z: ( lm1.z+lm2.z)/2
      };

      // Chuyển đổi tọa độ từ normalized (0-1) sang không gian 3D
      const x = (ringFingerBase.x - 0.5) * 2*aspectRatio;
      const y = -(ringFingerBase.y - 0.5) * 2*aspectRatio;
      const z = -ringFingerBase.z;

      ring.position.set(x, y, z);
    }
  }
});


// Camera
const cameraUtils = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 680,
  height: 500
});
cameraUtils.start();

// Vòng lặp render
function animate() {
  requestAnimationFrame(animate);
  // if (ring) {
  //   ring.rotation.y += 0.01; // xoay nhẫn nhẹ quanh trục Y
  // }
  // Ẩn nhẫn và landmark trước khi render depth
if (ring) ring.visible = false;
landmarkPoints.forEach(p => p.visible = false);



// Bật lại nhẫn và landmark
if (ring) ring.visible = true;
landmarkPoints.forEach(p => p.visible = true);

// Pass 2: render scene bình thường
renderer.clearDepth(); // ✅ quan trọng để vẽ pass 2 đúng
renderer.render(scene, camera);

}
animate();

import * as THREE from 'three';
import {HDRLoader} from 'three/examples/jsm/loaders/HDRLoader.js'

//1. Định nghĩa các chất liệu 
const goldMaterial = new THREE.MeshPhysicalMaterial ({
  color: 0xfea04d, // màu vàng
  metalness: 1.0, //kim loại hoàn toàn
  roughness: 0.1, // bề mặt nhám thấp tạo độ bóng
  envMapIntensity: 2.0, // cường độ phản chiếu môi trường
  reflectivity: 1.0,
  clearcoat: 1.0, // thêm lớp bóng vật liệu
  clearcoatRoughness: 0.05
});

const silverMaterial = new THREE.MeshPhysicalMaterial ({
  color: 0xc0c0c0, //màu xám
  metalness: 1.0,
  roughness: 0.1,
  envMapIntensity: 2.0,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05
});

const diamondMaterial = new THREE.MeshPhysicalMaterial ({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.02,
  reflectivity: 1.0, // tăng chỉ số khúc xạ bề mặt
  transparent: true,
  side: THREE.DoubleSide,
  envMapIntensity: 4.0,
  opacity: 1.0,
  transmission: 1.0, // độ truyền qua ánh sáng
  ior: 2.42, // chỉ số khúc xạ của kim cương
  thickness: 1.0// độ dày để hiệu ứng truyền qua tốt hơn
});
const rubyMaterial = new THREE.MeshPhysicalMaterial ({
  color: 0x841b2d,
  metalness: 0.0,
  roughness: 0.02,
  reflectivity: 1.0,
  transparent: true,
  envMapIntensity: 4.0,
  opacity: 1.0,
  ior: 2.3,
  transmission: 1.0,
  thickness: 1.0
});
const emerialMaterial = new THREE.MeshPhysicalMaterial ({
      color: 0x50C878,
      metalness: 0.0,
      roughness: 0.02,
      ior: 1.57,
      transmission: 1.0,
      thickness: 0.5,
      attenuationColor: 0x004B23,
      AttenuationDistance: 0.1,
      opacity: 1.0,
      envMapIntensity: 4.0
    })

  const sapphireMaterial = new THREE.MeshPhysicalMaterial ({
      color: 0x0000FF,
      metalness: 0.0,
      roughness: 0.02,
      reflectivity: 1.0,
      transparent: true,
      envMapIntensity: 4.0,
      opacity: 1.0,
      ior: 2.418,
      transmission: 1.0,
      thickness: 1.0
    });
  const whiteGoldMaterial = new THREE.MeshPhysicalMaterial ({
      color: 0xE5E4E2,
      metalness: 1.0,
      roughness: 0.05,
      ior: 2.4,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      opacity: 1.0,
      thickness: 1.0,
      envMapIntensity: 4.0
    });

export class MaterialManager {
  static async loadEnvironment(renderer, scene, hdriPath = 'assets/studio_small_08_4k.hdr') {
    // Cấu hình Renderer để hiển thị HDR chuẩn
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6; // Điều chỉnh độ sáng tối của nhẫn tại đây
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    return new Promise((resolve, reject) => {
      new HDRLoader().load(hdriPath, (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
        // Gán môi trường cho toàn bộ Scene
        scene.environment = envMap;
      
        texture.dispose();
        pmremGenerator.dispose();
        
        console.log("✅ Đã kích hoạt môi trường phản chiếu HDR");
        resolve(envMap);
      }, undefined, (err) => {
        console.error("❌ Lỗi tải file HDR:", err);
        reject(err);
      });
    });
  }
    

  /**
   * Hàm này nhận vào toàn bộ cục mô hình 3D (gltf.scene) và môi trường (scene.environment)
   * Sau đó nó tự động chạy traverse để đắp chất liệu
   */
  static applyMaterialsToModel(ringModel, environmentMap) {
    ringModel.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh name:", child.name, "| Material name:", child.material.name);
        const matName = child.material.name.toLowerCase();
        
        if (matName.includes('silver')) {
          child.material = silverMaterial;
        } else if (matName.includes('gold')) {
          child.material = goldMaterial;
        } else if (matName.includes('diamond')) {
          child.material = diamondMaterial;
        } else if (matName.includes('ruby')) {
          child.material = rubyMaterial;
        }else if (matName.includes('saphire')) {
            child.material = sapphireMaterial;
          }
          else if (matName.includes('white_golf')) {
            child.material = whiteGoldMaterial;
          }
          else if (matName.includes('emerial')) {
            child.material = emerialMaterial;
          }

        if (environmentMap) {
          child.material.envMap = environmentMap;
        }
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}


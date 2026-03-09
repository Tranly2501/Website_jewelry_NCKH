import * as THREE from 'three'; 

export class RingLogic {

    // CẤU HÌNH MÔ HÌNH VÀ VẬT CẢN (OCCLUDER)
    setupModelAndOccluder(model, group){
    // 1. Cấu hình mô hình 
        model.scale.set(0.75,0.75,0.75);
        model.renderOrder = 1; 

        //2. Cấu hình vật che khuất 
        const occluderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 80);
        const occluderMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true });

            // // CHẾ ĐỘ X-QUANG ĐỂ xem hinh dạng vật che:
        // const occluderMat = new THREE.MeshBasicMaterial({ 
        //     color: 0xff0000,      
        //     colorWrite: true,     
        //     wireframe: true      
        // });
        
        const occluder = new THREE.Mesh (occluderGeo , occluderMat);
        occluder.position.z = -0.015;
        occluder.renderOrder = -1; // ép vẽ đầu tiên
        
        group.add(occluder);
    }

    //TÍNH TOÁN VỊ TRÍ VÀ GÓC XOAY

    calculateTransform ( results, camera, processor) {
       const landmarks = results.multiHandLandmarks[0];
        const worldLms = results.multiHandWorldLandmarks[0];
        const handInfo = results.multiHandedness[0];
        const isRightHand = handInfo.label === 'Right';

        //1. tính tọa độ vị trí gắn nhẫn 
        const lm13 = landmarks[13];
    const lm14 = landmarks[14];
    
    const rawMidX = (lm13.x + lm14.x) / 2;
    const rawMidY = (lm13.y + lm14.y) / 2;
    const rawMidZ = (lm13.z + lm14.z) / 2;
    
    // Gọi hàm chuyển đổi 3D từ ARProcessor
    const targetPos = processor.get3DPosition({ x: rawMidX, y: rawMidY, z: rawMidZ });
    
    // Áp dụng độ bù trừ Y (+0.02)
    targetPos.y += 0.02;

    // TÍNH GÓC XOAY (BẰNG WORLD LANDMARKS) ---
    const w5 = new THREE.Vector3(worldLms[5].x, -worldLms[5].y, -worldLms[5].z);
    const w13 = new THREE.Vector3(worldLms[13].x, -worldLms[13].y, -worldLms[13].z);
    const w14 = new THREE.Vector3(worldLms[14].x, -worldLms[14].y, -worldLms[14].z);
    const w17 = new THREE.Vector3(worldLms[17].x, -worldLms[17].y, -worldLms[17].z);

    // Trục Y (Chiều dọc ngón tay)
    const yAxis = new THREE.Vector3().subVectors(w14, w13).normalize();
    
    // Trục ngang tạm thời (Từ ngón trỏ sang ngón út)
    const v_across = new THREE.Vector3().subVectors(w5, w17).normalize();
    
    // Trục Z (Vuông góc mu bàn tay)
    const zAxis = new THREE.Vector3().crossVectors(v_across, yAxis).normalize();
    
    // Xử lý chống lật (Anti-flip) khi đổi tay trái/phải
    if (!isRightHand) {
      zAxis.multiplyScalar(-1);
    }

    // Trục X hoàn thiện hệ trục vuông góc
    const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();

    // Tạo Quaternion từ 3 trục
    const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    const targetQ = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

    // Trả về kết quả thô, để "lọc mượt (OneEuroFilter)"  ở file  ARProcessor xử lý 
    return { position: targetPos, quaternion: targetQ };
    }

}
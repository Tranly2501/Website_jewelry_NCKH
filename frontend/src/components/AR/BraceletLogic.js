import * as THREE from 'three'; 

export class BraceletLogic {

setupModelAndOccluder(model, group) {
    // 1. Cấu hình Vòng tay (Scale to hơn)
    model.scale.set(0.2, 0.2, 0.2); 
    model.rotation.set(0,0,0);
    model.renderOrder = 1;
    model.position.set(0, -0.25,0);

    // 2. Cấu hình Occluder (To, dẹt cho cổ tay)
    const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 40);
    const mat= new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true });

        // CHẾ ĐỘ X-QUANG ĐỂ xem hinh dạng vật che:
        // const mat= new THREE.MeshBasicMaterial({ 
        //     color: 0xff0000,      
        //     colorWrite: true,     
        //     wireframe: true      
        // });

    const occluder = new THREE.Mesh(geo, mat);
    
    // occluder.rotation.x = Math.PI / 2;
    // Làm dẹt hình trụ để ôm sát cổ tay
    occluder.scale.set(1.2, 1.0, 0.7); 
    occluder.position.z = 0; // Vòng tay thường nằm chính giữa
    occluder.position.y -=0.25;
    occluder.renderOrder = -1;

    group.add(occluder);
  }

  calculateTransform(results, camera, processor) {
    const landmarks = results.multiHandLandmarks[0];
    const worldLms = results.multiHandWorldLandmarks[0];
    
    // Lấy thông tin tay trái hay phải để lật trục cho đúng
    const handInfo = results.multiHandedness[0];
    const isRightHand = handInfo.label === 'Right';

    // 1. TÍNH VỊ TRÍ (Điểm neo tại Cổ tay - Landmark 0)
    const targetPos = processor.get3DPosition(landmarks[0]);
    // 2. TÍNH GÓC XOAY (Dựa vào mu bàn tay)
    const w0 = new THREE.Vector3(worldLms[0].x, -worldLms[0].y, -worldLms[0].z);
    const w5 = new THREE.Vector3(worldLms[5].x, -worldLms[5].y, -worldLms[5].z);
    const w9 = new THREE.Vector3(worldLms[9].x, -worldLms[9].y, -worldLms[9].z);
    const w17 = new THREE.Vector3(worldLms[17].x, -worldLms[17].y, -worldLms[17].z);

    // TRỤC Y: Chạy dọc theo cẳng tay (Từ cổ tay 0 lên gốc ngón giữa 9)
    // Trục này cực kỳ ổn định, không bị lắc khi cử động các ngón tay
    const yAxis = new THREE.Vector3().subVectors(w9, w0).normalize();
    

    // TRỤC NGANG: Chạy ngang qua bàn tay (Từ gốc ngón trỏ 5 sang gốc ngón út 17)
    const v_across = new THREE.Vector3().subVectors(w5, w17).normalize();

    // TRỤC Z: Đâm xuyên qua mu bàn tay (Vuông góc với Y và Ngang)
    // Chính trục này sẽ quyết định việc vòng tay lật mặt trước hay mặt sau!
    const zAxis = new THREE.Vector3().crossVectors(v_across, yAxis).normalize();

    // Nếu là tay trái, trục Z sẽ bị ngược, ta cần đảo lại để vòng không bị lật từ trong ra ngoài
    if (!isRightHand) {
      zAxis.multiplyScalar(-1);
    }

    // TRỤC X: Hoàn thiện hệ trục 3D vuông góc
    const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();

    // Khởi tạo ma trận và đưa  ra kết quả
    const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    const targetQ = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

    

    // Trả về cho cỗ máy ARProcessor xử lý
    return { position: targetPos, quaternion: targetQ };
  }
}
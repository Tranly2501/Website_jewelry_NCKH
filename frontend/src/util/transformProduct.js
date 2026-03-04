export const transformProduct = (apiProduct) => {
  // 1. Kiểm tra đầu vào an toàn
  if (!apiProduct) return null;

  // --- HÀM HELPER ĐÃ CẬP NHẬT: CHẶN LỖI URL VÀ XỬ LÝ CHUỖI LỒNG CHUỖI ---
  const safeParseJSON = (data) => {
    if (!data) return {};
    
    // Nếu data đã là Object rồi (do Sequelize tự parse) thì trả về luôn
    if (typeof data === 'object' && data !== null) return data;

    // BƯỚC MỚI: Kiểm tra nếu là link URL trực tiếp (bắt đầu bằng http)
    // Nếu là link, ta bọc vào Object { id1: url } để Object.values() ở dưới chạy được
    if (typeof data === 'string' && data.trim().startsWith('http')) {
      return { id1: data.trim() };
    }

    let parsed = data;
    try {
      // Parse lần 1
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      
      // Kiểm tra sau khi parse lần 1, nếu kết quả lại là một URL chuỗi
      if (typeof parsed === 'string' && parsed.trim().startsWith('http')) {
        return { id1: parsed.trim() };
      }

      // Parse lần 2 (Đề phòng API trả về chuỗi bị bọc 2 lớp JSON)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
    } catch (error) {
      // Nếu parse lỗi mà chuỗi chứa http, cố gắng cứu vãn bằng cách trả về link thô
      if (typeof data === 'string' && data.includes('http')) {
        return { id1: data.trim() };
      }
      console.error("Lỗi parse JSON dữ liệu thô:", data, error);
      return {};
    }

    return (typeof parsed === 'object' && parsed !== null) ? parsed : {};
  };

  // --- GIỮ NGUYÊN LOGIC XỬ LÝ BÊN DƯỚI ---
  
  // Ép các trường văn bản từ API thành Object thật
  const parsedImages = safeParseJSON(apiProduct.image_url);
  const parsedSpecs = safeParseJSON(apiProduct.specification);
  const parsedStatus = safeParseJSON(apiProduct.status);

  // 2. Xử lý hình ảnh (Object.values sẽ lấy ra mảng các link ảnh)
  const imageUrls = Object.values(parsedImages);
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : "https://placehold.co/600x600?text=No+Image";

  // 3. Xử lý giá cả
  const currentPrice = Number(apiProduct.price) || 0;
  const oldPrice = apiProduct.oldprice ? Number(apiProduct.oldprice) : null;

  // 4. Xử lý thông số kỹ thuật (Specification)
  let specArray = Object.entries(parsedSpecs).map(([key, value]) => ({
    label: key,
    value: value
  }));
  
  let materialStr = parsedSpecs["Chất liệu"] || parsedSpecs["Đá chính"] || "Bạc S925";

  let mappedCategory = "other";
  if (apiProduct.category_id === 1) mappedCategory = "ring";
  else if (apiProduct.category_id === 2) mappedCategory = "bracelet";
  else if (apiProduct.category_id === 3) mappedCategory = "set"; 

  return {
    id: apiProduct.id,
    name: apiProduct.name || "Sản phẩm chưa có tên",
    description: apiProduct.description || "Đang cập nhật mô tả...",
    descriptionDetail: apiProduct.descriptionDetail || "Đang cập nhật chi tiết...",
    price: currentPrice,
    oldPrice: oldPrice,
    image: mainImage,
    images: imageUrls,
    model_url: apiProduct.model_url || null, 
    isAR: parsedStatus.isAR || false,
    isSale: parsedStatus.isSale || (oldPrice > currentPrice),
    isNew: parsedStatus.isNew || false,
    isFeatured: parsedStatus.isFeatured || false,
    categoryId: mappedCategory,
    rating: apiProduct.averageRating ? parseFloat(apiProduct.averageRating) : 0, 
    reviewCount: apiProduct.reviewCount || 0,
    material: materialStr,
    specifications: specArray,
    sizes: ["16 ", "17 ", "18 ", "19 "],
    quantity: apiProduct.quantity || 0
  };
};
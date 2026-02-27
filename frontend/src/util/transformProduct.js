export const transformProduct = (apiProduct) => {
  // 1. Kiểm tra đầu vào an toàn
  if (!apiProduct) return null;

  // 2. Xử lý hình ảnh: Chuyển Object {id1: 'url', id2: 'url'} -> mảng ['url', 'url']
  const imageUrls = apiProduct.image_url ? Object.values(apiProduct.image_url) : [];
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : "https://placehold.co/600x600?text=No+Image";

  // 3. Xử lý giá cả: Ép kiểu số vì API trả về string
  const currentPrice = Number(apiProduct.price) || 0;
  const oldPrice = apiProduct.oldprice ? Number(apiProduct.oldprice) : null;

  // 4. Xử lý thông số kỹ thuật (Specification)
  let specArray = [];
  let materialStr = "Bạc S925"; 

  if (apiProduct.specification && typeof apiProduct.specification === 'object') {
    specArray = Object.entries(apiProduct.specification).map(([key, value]) => ({
      label: key,
      value: value
    }));
    // Ưu tiên lấy "Đá chính" làm thông tin chất liệu hiển thị nhanh
    materialStr = apiProduct.specification["Chất liệu"] || apiProduct.specification["Đá chính"] || materialStr;
  }

   // Tính toán map category trước
  let mappedCategory = "other";
  if (apiProduct.category_id === 1) mappedCategory = "ring";
  else if (apiProduct.category_id === 2) mappedCategory = "bracelet";
  else if (apiProduct.category_id === 3) mappedCategory = "set"; 
  // 5. Xử lý trạng thái (status)
  const status = apiProduct.status || {};

  return {
    id: apiProduct.id,
    name: apiProduct.name || "Sản phẩm chưa có tên",
    description: apiProduct.description || "Đang cập nhật mô tả...",
    descriptionDetail: apiProduct.descriptionDetail || "Đang cập nhật chi tiết...",
    price: currentPrice,
    oldPrice: oldPrice,
    image: mainImage,      // Dùng cho ảnh lớn
    images: imageUrls,     // Dùng cho danh sách ảnh nhỏ (thumbnails)
    model_url: apiProduct.model_url || null, 
    
    // Để biến isAR tự động linh hoạt: Nếu có model_url thì isAR = true, ngược lại là false
    // isAR: apiProduct.model_url ? true : false,
    isAR: status.isAR || false,
    isSale: status.isSale || (oldPrice > currentPrice),
    isNew: status.isNew || false,
    isFeatured: status.isFeatured || false,
    categoryId: mappedCategory,
    rating: apiProduct.averageRating ? parseFloat(apiProduct.averageRating) : 0, 
    reviewCount: apiProduct.reviewCount || 0,
    material: materialStr,
    specifications: specArray,
    sizes: ["16 cm", "17 cm", "18 cm", "19 cm"],
    quantity: apiProduct.quantity || 0
  };
};
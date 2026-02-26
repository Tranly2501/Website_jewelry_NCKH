const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController');
const feedbackController = require('../controllers/feedbackController');
const favoriteController = require('../controllers/favoriteController');



// Route 1: Lấy toàn bộ (Dùng để tính sao trung bình ở Frontend như Cách 2 phía trên)
router.get('/get-all-feedbacks', feedbackController.getAllFeedbacks);

// Route 2: Lấy theo ID sản phẩm (Dùng khi người dùng bấm vào xem chi tiết 1 cái nhẫn)
router.get('/get-feedbacks-by-product/:id', feedbackController.getFeedbackByProductId);
// Route 3: Lấy toàn bộ sản phẩm (Dùng để hiển thị tất cả sản phẩm )
router.get('/get-all-products', productsController.getAllProducts);
// Route 4: Lấy chi tiết sản phẩm theo ID (Dùng khi người dùng bấm vào xem chi tiết 1 cái nhẫn)
router.get('/get-product/:id', productsController.getProductById);
//route 5: Tìm kiếm sản phẩm theo tên (Dùng khi người dùng nhập từ khóa vào ô tìm kiếm)
router.get('/search-products', productsController.searchProduct);
//route 6: Lấy sản phẩm theo loại (Dùng khi người dùng bấm vào 1 loại sản phẩm như nhẫn, vòng tay, bông tai)
router.get('/get-related-products/:categoryId', productsController.getRelatedProducts);
// Route 7: Lấy danh sách yêu thích của người dùng theo ID người dùng (Dùng khi người dùng bấm vào xem danh sách yêu thích của mình)
router.get('/get-favorites/:userId', favoriteController.getFavoriteByUserId);
module.exports = router;
 
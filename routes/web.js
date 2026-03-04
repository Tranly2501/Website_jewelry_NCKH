const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController');
const feedbackController = require('../controllers/feedbackController');
const favoriteController = require('../controllers/favoriteController');
const cartController = require('../controllers/cartController');



// Route 1: Lấy toàn bộ (Dùng để tính sao trung bình ở Frontend như Cách 2 phía trên)
router.get('/get-all-feedbacks', feedbackController.getAllFeedbacks);

//Thêm feedback 
router.post('/add-feedback',feedbackController.addFeedback);

// Route 2: Lấy theo ID sản phẩm (Dùng khi người dùng bấm vào xem chi tiết 1 cái nhẫn)
router.get('/get-feedback/:productId', feedbackController.getFeedbackByProductId);

// Route 3: Lấy toàn bộ sản phẩm (Dùng để hiển thị tất cả sản phẩm )
router.get('/get-all-products', productsController.getAllProducts);

// Route 4: Lấy chi tiết sản phẩm theo ID (Dùng khi người dùng bấm vào xem chi tiết 1 cái nhẫn)
router.get('/get-product/:id', productsController.getProductById);

//route 5: Tìm kiếm sản phẩm theo tên (Dùng khi người dùng nhập từ khóa vào ô tìm kiếm)
router.get('/search-products', productsController.searchProduct);

//route 6: Lấy sản phẩm theo loại (Dùng khi người dùng bấm vào 1 loại sản phẩm như nhẫn, vòng tay, bông tai)
router.get('/get-related-products/:categoryId', productsController.getRelatedProducts);
// // Route lọc sản phẩm theo các tiêu chí trong spec
router.get('/products/filter', productsController.getFilteredProducts);

//SẢN PHẨM YÊU THÍCH 
// Route 7: Lấy danh sách yêu thích của người dùng theo ID người dùng (Dùng khi người dùng bấm vào xem danh sách yêu thích của mình)
router.get('/get-favorites/:userId', favoriteController.getFavoriteByUserId);

// Route 8: Thêm sản phẩm vào danh sách yêu thích
router.post('/add-to-favorite', favoriteController.addFavorite);

// Route 9: Xóa sản phẩm khỏi danh sách yêu thích 
router.delete('/remove-favorite/:userId/:productId', favoriteController.removeFavorite);

//GIỎ HÀNG
// Route 10: Lấy thông tin giỏ hàng của người dùng theo ID người dùng (Dùng khi người dùng bấm vào xem giỏ hàng của mình)
router.get('/get-cart/:userId', cartController.getCartByUserId);

// Route 11: Thêm sản phẩm vào giỏ hàng (Dùng khi người dùng bấm vào nút "Thêm vào giỏ" ở trang chi tiết sản phẩm)
router.post('/add-to-cart', cartController.addToCart);          

 // Route 12: Cập nhật số lượng sản phẩm trong giỏ hàng (Dùng khi người dùng bấm vào nút + / - ở trang giỏ hàng để tăng giảm số lượng)
router.put('/update-cart', cartController.updateCartQuantity);  

// Route 13: Xóa sản phẩm khỏi giỏ hàng (Dùng khi người dùng bấm vào nút "Xóa" ở trang giỏ hàng để xóa sản phẩm khỏi giỏ)
router.delete('/delete-cart-item/:id', cartController.deleteCartItem); 

router.get('/get-cart-summary/:userId', cartController.getCartSummary);

module.exports = router;

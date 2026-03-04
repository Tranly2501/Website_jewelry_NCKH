// controllers/feedbackController.js
const db = require('../models'); 
const Feedback = db.feedback;

// thêm data cho bảng feedback
const addFeedback = async (req,res) => {
    try {
        const {product_id, user_id, star, context } = req.body;

        // kiểm trả dữ liệu đầu vào 
        if (!product_id || !user_id || !star || !context) {
            return res.status(400).json({ 
                errCode: 1, 
                message: "Thiếu thông tin đánh giá (sao hoặc nội dung)!" 
            });
        }

        const newFeedback = await db.feedback.create({
            product_id,
            user_id,
            star,
            context
        });

        return res.status(200).json({
            errCode: 0,
            message: "Gửi đánh giá thành công!",
            data: newFeedback
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
};


// API: Lấy Feedback theo 1 Sản phẩm cụ thể
const getFeedbackByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;
        
        const feedbacks = await db.feedback.findAll({
                    where: { product_id: productId },
                    include: [{
                        model: db.users,
                        as: 'userData',
                        attributes: ['username', 'email'] // Lấy tên người dùng để hiển thị
                    }],
                    order: [['create_at', 'DESC']] // Đánh giá mới nhất lên đầu
                });

        return res.status(200).json({
            errCode: 0,
            data: feedbacks
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        const data = await db.feedback.findAll({
            include: [{
                model: db.users,
                as: 'userData',
                attributes: ['username'] // Lấy tên người dùng
            }],
            limit: 10, // Giới hạn 10 đánh giá mới nhất cho trang chủ
            order: [['create_at', 'DESC']]
        });
        return res.status(200).json({ errCode: 0, data });
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
};
module.exports = {
    getFeedbackByProductId,
    addFeedback, getAllFeedbacks
};
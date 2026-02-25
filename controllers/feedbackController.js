// controllers/feedbackController.js
const db = require('../models'); 
const Feedback = db.feedback;

// API: Lấy toàn bộ Feedback
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            // ĐÃ COMMENT ĐOẠN INCLUDE ĐỂ TRÁNH LỖI "User is not defined"
            // include: [
            //     { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
            // ]
        });

        // Trả về danh sách feedback dạng JSON
        return res.status(200).json(feedbacks);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách feedback:", error);
        return res.status(500).json({ 
            message: "Lỗi server khi lấy feedback", 
            error: error.message 
        });
    }
};

// API: Lấy Feedback theo 1 Sản phẩm cụ thể
const getFeedbackByProductId = async (req, res) => {
    try {
        const productId = req.params.id; 
        
        const feedbacks = await Feedback.findAll({
            where: { product_id: productId }
            // include: [{ model: User, as: 'user', attributes: ['username'] }]
        });

        return res.status(200).json(feedbacks);

    } catch (error) {
        console.error("Lỗi:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    getAllFeedbacks,
    getFeedbackByProductId
};
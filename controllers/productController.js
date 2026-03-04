const db = require('../models');
const {Op} = require('sequelize'); // Để dùng toán tử Op.like
// Lấy model product
const Product = db.products;

const getAllProducts = async(req,res) =>{
    try{
        // lấy tất cả sp 
        const data = await db.products.findAll({
            raw: true, // chỉ lấy dữ liệu gốc , bỏ qua sequelize
            nest:true
        });

        // kiem xem lay dươc khong 
        console.log("--------------------------------");
        console.log("Dữ liệu lấy từ DB:", data); 
        console.log("--------------------------------");

        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            products: data
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({errCode:-1, message: err.message});

    }
}


// hàm lấy chi tiết 1 sản phẩm theo id
const getProductById = async(req,res) =>{
    try{
        const productId = req.params.id; // Lấy ID sản phẩm từ URL

        const product = await db.products.findOne({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tìm thấy sản phẩm"
            });
        }
        return res.status(200).json({
            product: product
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            errCode:-1, 
            message: 'Lỗi Server'
        });
    }
};

const searchProduct = async (req,res) =>{
    try {
        // lấy từ khóa từ query 
        const searchTerm = req.query.q; // Ví dụ: /search?q=nhẫn

        if (!searchTerm) {
            return res.status(200).json ({products: []}); // Trả về mảng rỗng nếu không có từ khóa
        }

        const data = await db.products.findAll({
            where: {
                // Sử dụng Op.like để tìm kiếm theo tên sản phẩm
                name: {[Op.like]: `%${searchTerm}%` //
                }
            },
            raw: true,
            nest: true
        });
        return res.status(200).json({
            errCode: 0,
            products: data
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({errCode:-1, message: 'Lỗi Server'});
    }
}; 

const getRelatedProducts = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { excludeId } = req.query; // ID của sản phẩm đang xem để loại bỏ khỏi danh sách gợi ý

        const data = await db.products.findAll({
            where: {
                category_id: categoryId, // Lọc theo số ID danh mục
                id: { [Op.ne]: excludeId } // Op.ne là "not equal" - không lấy chính nó
            },
            limit: 4, // Chỉ lấy 4 cái cho nhẹ
            raw: true,
            nest: true
        });

        return res.status(200).json({
            errCode: 0,
            products: data
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errCode: -1, message: 'Lỗi Server' });
    }
};

const getFilteredProducts = async (req, res) => {
    try {
        const { minPrice, maxPrice, chatLieu, gioiTinh } = req.query;
        const andConditions = [];

        // 1. LỌC GIÁ
        if (minPrice && maxPrice) {
            andConditions.push({
                price: { [Op.between]: [Number(minPrice), Number(maxPrice)] }
            });
        }

        // 2. LỌC CHẤT LIỆU (Xử lý thông minh theo hướng trang sức)
        if (chatLieu) {
            const materialArray = chatLieu.split(','); // VD: ['Bạc', 'Ngọc']
            
            const materialOrConditions = materialArray.map(m => {
                // Nếu khách chọn "Ngọc", hệ thống tự động quét cả cột "Chất liệu" VÀ cột "Đá chính"
                if (m === 'Ngọc') {
                    return {
                        [Op.or]: [
                            db.sequelize.where(db.sequelize.literal(`specification->>'$."Chất liệu"'`), 'LIKE', `%${m}%`),
                            db.sequelize.where(db.sequelize.literal(`specification->>'$."Đá chính"'`), 'LIKE', `%${m}%`),
                            db.sequelize.where(db.sequelize.literal(`specification->>'$."Đá phụ"'`), 'LIKE', `%${m}%`)
                        ]
                    };
                }
                
                // Nếu khách chọn "Vàng", "Bạc", "Bạch kim" thì chỉ quét trong cột "Chất liệu"
                return db.sequelize.where(
                    db.sequelize.literal(`specification->>'$."Chất liệu"'`),
                    'LIKE',
                    `%${m}%`
                );
            });
            
            andConditions.push({ [Op.or]: materialOrConditions });
        }

        // 3. LỌC GIỚI TÍNH (Giữ nguyên sự linh hoạt như bạn mong muốn)
        if (gioiTinh) {
            const genderArray = gioiTinh.split(','); // VD: ['Nữ']
            
            const genderOrConditions = genderArray.map(g => 
                // Dùng LIKE để "Nữ" vẫn có thể match được "Nữ (unisex tùy phong cách)"
                db.sequelize.where(
                    db.sequelize.literal(`specification->>'$."Giới tính"'`),
                    'LIKE',
                    `%${g}%`
                )
            );

            andConditions.push({ [Op.or]: genderOrConditions });
        }

        // 4. LẮP RÁP VÀ TRUY VẤN
        const finalWhere = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

        const products = await db.products.findAll({
            where: finalWhere,
            order: [['create_at', 'DESC']]
        });

        return res.status(200).json({
            errCode: 0,
            message: "Lọc sản phẩm thành công!",
            total: products.length,
            data: products
        });

    } catch (error) {
        console.error("Lỗi API Lọc Sản Phẩm:", error);
        return res.status(500).json({ errCode: -1, message: "Lỗi Server!" });
    }
};



module.exports = {getAllProducts, getProductById,searchProduct, getRelatedProducts,getFilteredProducts};
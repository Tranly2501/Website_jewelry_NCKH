const db = require('../models');
// goi model
const Favorites = db.favorites;
const Products = db.products;

// lấy danh sách yêu thích của người dùng
const getFavoriteByUserId = async (req,res) =>{
    try {
        const userId = req.params.userId;// lấy id của nguòi dùng từ url xg 

        // kiểm tra xem có truyền userId lên ko 
        if ( !userId) {
            return res.status(400).json (
                {
                    errCode: 1,
                    errMessage: "Thiếu tham số userId"
                }
            );
        }
        // tìm tất cả các mục yêu thích của người dùng đó, bao gồm thông tin sản phẩm
        const wishlist = await Favorites.findAll ({
            where: {user_id: userId} ,
            include:[
                {
                    model: Products,
                    attributes: ['id', 'name', 'price', 'image_url','quantity'] // chỉ lấy những trường cần thiết của sản phẩm
                }
            ],
            raw:false,
            nest: true
        });
        res.status(200).json({
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            errMessage: "Lỗi khi lấy danh sách yêu thích: " + error.message
        });
    }
};

// thêm sản phẩm vào danh sách yêu thích
const addFavorite = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ errCode: 1, message: 'Thiếu dữ liệu!' });
        }

        // Kiểm tra xem sản phẩm này đã có trong danh sách yêu thích của user chưa
        const existing = await Favorites.findOne({
            where: { user_id, product_id }
        });

        if (existing) {
            return res.status(200).json({ errCode: 2, message: 'Sản phẩm đã có trong yêu thích!' });
        }

        // Tạo mới bản ghi
        await Favorites.create({ user_id, product_id });

        return res.status(200).json({
            errCode: 0,
            message: 'Đã thêm vào danh sách yêu thích thành công!'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: -1, message: 'Lỗi server' });
    }
};

//xóa sản phẩm khỏi danh sách yêu thích 
const removeFavorite = async (req, res) => {
    try {
        // Lấy ID user và ID sản phẩm từ trên thanh URL xuống
        const userId = req.params.userId;
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ errCode: 1, message: 'Thiếu dữ liệu!' });
        }

        // Dùng lệnh destroy của Sequelize để xóa dòng dữ liệu
        await Favorites.destroy({
            where: { 
                user_id: userId, 
                product_id: productId 
            }
        });

        return res.status(200).json({
            errCode: 0,
            message: 'Đã xóa khỏi danh sách yêu thích!'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: -1, message: 'Lỗi server: ' + error.message });
    }
};

module.exports = {addFavorite,getFavoriteByUserId, removeFavorite};
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

module.exports = {getFavoriteByUserId};